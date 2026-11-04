-- Run once in the Supabase SQL editor. This script does NOT create an administrator.
begin;
create table if not exists public.portfolio_admins (
 user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.portfolio_admins enable row level security;
revoke all on public.portfolio_admins from anon, authenticated;
grant select on public.portfolio_admins to authenticated;
create policy "Admins can read own membership" on public.portfolio_admins
 for select to authenticated using (user_id = (select auth.uid()));

create function public.is_portfolio_admin() returns boolean
 language sql stable security definer set search_path = ''
 as $$ select exists(select 1 from public.portfolio_admins where user_id = (select auth.uid())); $$;
revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

create table public.portfolio_content (
 id text primary key check (id='main'),
 content jsonb not null check (
  content->>'schemaVersion'='1'
  and jsonb_typeof(content->'profile')='object'
  and jsonb_typeof(content->'projects')='array'
  and jsonb_typeof(content->'education')='array'
  and jsonb_typeof(content->'cvs')='array'
  and octet_length(content::text) < 500000
 ),
 version bigint not null default 1,
 updated_at timestamptz not null default now()
);
alter table public.portfolio_content enable row level security;
revoke all on public.portfolio_content from anon, authenticated;
grant select on public.portfolio_content to anon, authenticated;
create policy "Public may read published content" on public.portfolio_content for select to anon, authenticated using (true);

create table public.portfolio_history (
 version bigint primary key,
 content jsonb not null,
 created_at timestamptz not null default now()
);
alter table public.portfolio_history enable row level security;
revoke all on public.portfolio_history from anon, authenticated;
grant select on public.portfolio_history to authenticated;
create policy "Admins may read version history" on public.portfolio_history for select to authenticated using ((select public.is_portfolio_admin()));

-- Only this function writes content, so version/history cannot be bypassed by REST writes.
create function public.publish_portfolio(new_content jsonb, expected_version bigint)
 returns bigint language plpgsql security definer set search_path = '' as $$
declare current_version bigint; next_version bigint;
begin
 if not public.is_portfolio_admin() then raise exception 'Administrator access required' using errcode='42501'; end if;
 perform pg_advisory_xact_lock(712804651);
 select version into current_version from public.portfolio_content where id='main';
 if coalesce(current_version,0) <> expected_version then
  raise exception 'Publish conflict: a newer version exists. Reload before publishing.';
 end if;
 next_version := coalesce(current_version,0)+1;
 insert into public.portfolio_content(id,content,version,updated_at)
 values ('main',new_content,next_version,now())
 on conflict(id) do update set content=excluded.content,version=excluded.version,updated_at=excluded.updated_at;
 insert into public.portfolio_history(version,content) values(next_version,new_content);
 return next_version;
end; $$;
revoke all on function public.publish_portfolio(jsonb,bigint) from public, anon;
grant execute on function public.publish_portfolio(jsonb,bigint) to authenticated;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('portfolio-media','portfolio-media',true,10485760,array['application/pdf','image/jpeg','image/png','image/webp']);
create policy "Only admins upload portfolio media" on storage.objects
 for insert to authenticated with check (
  bucket_id='portfolio-media'
  and (storage.foldername(name))[1]=(select auth.uid())::text
  and (select public.is_portfolio_admin())
 );
-- No anonymous writes, self-registration of admins, file overwrite, or file deletion.
-- Public bucket downloads are intentional. Draft uploads are public too.
commit;

