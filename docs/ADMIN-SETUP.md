# Portfolio Studio setup

The site stays on GitHub Pages. Supabase provides email/password sign-in, published content, version history, and public PDF/image uploads. No password is stored in this repository.

## 1. Create Supabase

1. Create a project at https://supabase.com/dashboard. Choose your own project/database password; do not paste it in chat or commit it.
2. In SQL Editor run the contents of `supabase/setup.sql` once. The script is a first-install migration, not a repeatable reset. If it fails, inspect the transaction error before retrying.
3. In Authentication settings disable public sign-ups. In Authentication → Users, create your own email/password user and confirm its email. Do not create a user through public website registration.
4. Copy that user's UUID, then run this in SQL Editor, replacing the UUID:

```sql
insert into public.portfolio_admins(user_id)
values ('YOUR-AUTH-USER-UUID'::uuid);
```

Only UUIDs entered by a database administrator can publish. Any other authenticated user remains read-only.

## 2. Connect the website

Open `assets/js/cms-config.js` and fill in the project's URL and public publishable key (or legacy anon key) from Supabase's Connect/API settings:

```js
window.PORTFOLIO_CMS = Object.freeze({
  url: "https://YOUR-PROJECT.supabase.co",
  anonKey: "YOUR-PUBLIC-PUBLISHABLE-OR-ANON-KEY"
});
```

These settings are public by design. Never use a secret key, service_role key, database password, or admin password. Commit and push the config to GitHub. Leave the existing site URL and hosting intact.

## 3. First sign-in and publish

Visit https://ferdaws-c.github.io/portfolio/admin/ and use your administrator email and password.

- On first sign-in the existing portfolio is loaded from `content/portfolio.json`.
- Review About & photo, Projects, Education, and CV library.
- Select **Show preview** to see a draft in the website's existing design.
- Upload a portrait or a new CV PDF. Uploads are public immediately; use public portfolio files only.
- Choose exactly one default CV. The hero and navigation buttons use it.
- Publish to create the first database version. Later edits appear on the next visitor page load, without another GitHub deployment.
- The current owner-supplied photo CV remains available at the stable `CV/Ferdaws_Qaem_Resume.pdf` URL.

Before setup, the admin page offers an explicitly local editor for draft exploration. That mode cannot upload, sign in, or publish. It is not a security bypass.

## Daily use

The editor autosaves a device draft after field changes. Restore it explicitly using **Restore device draft**. This also recovers work after a refresh or sign-in session loss. Drafts contain public portfolio content; shared computers retain them until browser storage is cleared. Passwords and auth tokens stay in memory and disappear on reload/sign-out.

**Export backup** downloads a JSON copy of the draft. Published history keeps previous content snapshots; restore one to a draft, review, then publish. Files are not included in JSON backups. Keep your own copies of uploaded PDFs and photos.

Reorder entries with up/down buttons. Removing an entry changes its draft reference; it does not delete storage files. This preserves historical versions. Storage cleanup is a separate deliberate operation in the Supabase dashboard.

Only the owner can edit, but visitors can read published content and media. An obsolete PDF remains publicly accessible until it is deliberately removed from storage.

## CVs by field

Use a clear title and target field, for example “AI Engineering CV”, “Software Engineering CV”, or “Embedded Systems CV”. Upload a different PDF for each when available; do not relabel one file as if it were a tailored CV. The initial library contains only the existing actual CV.

The editor uploads and organizes PDFs; it does not rewrite their contents or automatically regenerate tailored CVs. The default download is the exact owner-supplied photo CV. The older Python template now writes `CV/Ferdaws_Qaem_Resume_Generated.pdf` separately so running it cannot overwrite the supplied document.

## How appearance is protected

The dashboard edits structured text, links, categories, and image/PDF references. It cannot edit HTML, CSS, JavaScript, component layout, or arbitrary markup. Text is escaped and links are restricted to HTTPS or known asset paths. Category filters and default CV buttons are reinitialized after content rendering. A portrait placeholder appears when no photo is supplied.

The original HTML is still a usable fallback if scripts fail. The bundled JSON supplies the managed default content. If Supabase cannot be reached, the bundled content remains displayed; it may be older than the most recently published database version.

## Security and acceptance checks

After setup perform these checks before relying on the dashboard:

1. Signed out: public content is readable; uploading and publishing fail.
2. Admin sign-in: an image/PDF upload and publish succeed.
3. A separate non-admin account cannot call `publish_portfolio`, read version history, upload, or add itself to `portfolio_admins`.
4. Direct REST writes to `portfolio_content` fail even for an admin; only the publish RPC writes it.
5. Open two editor tabs at the same version. Publish in one; publishing in the other reports a conflict.
6. Restore a previous published version to a draft and preview it.
7. Test portrait and CV links, project filters, both themes, and iPhone Safari scrolling.

RLS policies and the publish function enforce authorization on the server, not only by hiding buttons. The public key alone never grants write access. Keep Supabase Auth rate limits enabled. Reset a forgotten admin password through Supabase's dashboard; the website does not implement public registration or password recovery yet.

## Maintenance and deployment

- GitHub owns layout, scripts, fallbacks, and this setup.
- Supabase owns published content, history, and uploaded files.
- Keep `content/portfolio.json` reasonably current with exported, reviewed public content. Do not store auth sessions in it.
- No backend credentials are required for ordinary static preview.
- Use `python -m http.server 4173` from the repository root and open `http://localhost:4173/admin/`.
- Run `node --test tests/content.test.cjs` and syntax checks before deploying.
- The SQL migration requires a real project to execute; local tests do not prove deployed RLS behavior.
- Monitor Supabase service quotas and storage usage in its dashboard.

Official references: [password authentication](https://supabase.com/docs/guides/auth/passwords), [row level security](https://supabase.com/docs/guides/database/postgres/row-level-security), [storage access control](https://supabase.com/docs/guides/storage/security/access-control).

