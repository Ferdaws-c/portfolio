# Portfolio and CV Maintenance Guide

This file is the operating guide for any AI agent or developer who updates, expands, migrates, or deploys this repository. Read it before changing the website or CV.

The goal is to keep the portfolio professional, fast, accessible, factually accurate, and easy to maintain while preserving a single coherent personal brand across the website, downloadable CV, GitHub repository, and public links.

## 1. Project identity

- Owner: Ferdaws Qaem
- Repository: `https://github.com/Ferdaws-c/portfolio`
- Production site: `https://ferdaws-c.github.io/portfolio/`
- Deployment target: GitHub Pages
- Default branch: `main`
- Architecture: static HTML, CSS, and vanilla JavaScript
- Build step: none for the website
- CV source: `CV/generate_resume.py`
- Generated CV: `CV/Ferdaws_Qaem_Resume.pdf`

Public profile details currently used by the project:

- Location: Istanbul, Türkiye
- Email: `ferdawsqaem@gmail.com`
- Phone: `+90 534 358 66 03`
- GitHub: `https://github.com/Ferdaws-c`
- LinkedIn: `https://linkedin.com/in/ferdaws-qaem`
- Degree: B.Sc. Computer Engineering, Istanbul Kültür University
- Current status: fourth-year student
- Expected graduation: July 2027
- GPA: 3.04 / 4.00
- Erasmus+: VSB-Technical University of Ostrava, September 2025 to January 2026

Treat these as public data, not permission to invent or infer additional personal facts. If a date, metric, role, award, skill level, or project result is not supported by the repository or explicitly supplied by the owner, ask before publishing it.

## 2. Non-negotiable rules

1. Preserve factual accuracy. Do not embellish experience, job titles, project impact, skill levels, credentials, dates, or education.
2. Keep the website and CV synchronized. A material fact changed in one should be reviewed in the other.
3. Treat `CV/generate_resume.py` as the source of truth for the CV. Never manually edit the generated PDF.
4. Preserve GitHub Pages compatibility, including the `/portfolio/` base path.
5. Keep the site usable without JavaScript. JavaScript may enhance interaction but must not hide essential content permanently.
6. Maintain keyboard accessibility, visible focus states, semantic headings, useful alternative text, and reduced-motion support.
7. Do not add trackers, analytics, contact-form services, cookies, external fonts, or new third-party scripts without explicit owner approval.
8. Do not commit secrets, API keys, private contact data, source documents, temporary renders, dependency folders, or local environment files.
9. Preserve unrelated user changes. Inspect `git status` and the relevant diff before editing.
10. Do not replace the current visual identity or migrate frameworks merely to make a small change.

## 3. Repository map

```text
portfolio/
├── AGENTS.md                         # This maintenance and scaling guide
├── README.md                         # Public project overview and local-use notes
├── index.html                        # Entire production page and canonical content
├── 404.html                          # GitHub Pages not-found page
├── assets/
│   ├── css/
│   │   └── style.css                 # Design tokens, layout, components, motion, responsive rules
│   ├── js/
│   │   └── main.js                   # Progressive interactions and accessibility behavior
│   └── images/
│       ├── og-cover.PNG              # Social sharing image
│       ├── credentials/              # Public certificate images
│       └── project-previews/         # Project card artwork/screenshots
└── CV/
    ├── generate_resume.py            # Editable CV source and ReportLab layout
    └── Ferdaws_Qaem_Resume.pdf       # Generated downloadable CV
```

Do not add a framework-generated directory, package manager, or build output until there is a clear maintenance benefit and a deployment plan.

## 4. Current website architecture

### HTML

`index.html` is a single-page portfolio with these primary section IDs:

```text
#hero
#projects
#experience
#credentials
#education
#contact
```

Navigation links and JavaScript section tracking depend on these IDs. If a section ID changes, update every matching anchor, `data-section` value, observer target, and 404/home link.

The page contains:

- SEO, Open Graph, and social metadata in `<head>`
- a skip link and semantic landmarks
- a responsive header and navigation
- an introductory hero and profile snapshot
- filterable project cards
- experience, credential, education, and contact sections
- a native `<dialog>` certificate viewer
- a toast region and back-to-top control

### CSS

`assets/css/style.css` owns the complete visual system. Extend existing patterns before creating one-off styles.

Important layers:

- `:root` variables define colors, type, spacing, borders, shadows, and layout dimensions.
- `[data-theme="dark"]` overrides the token set for dark mode.
- component classes cover buttons, project cards, credential cards, timelines, dialog, toast, and navigation.
- `@media` rules provide desktop, tablet, and mobile layouts.
- `prefers-reduced-motion` disables or minimizes decorative motion.

When changing the theme, update semantic tokens instead of scattering literal colors through component rules. Check contrast in both light and dark modes.

### JavaScript

`assets/js/main.js` enhances the static page with:

- persisted light/dark theme selection via `localStorage` key `portfolio-theme`
- scroll progress
- responsive navigation and hamburger state
- active navigation using `IntersectionObserver`
- reveal-on-scroll animation
- project filtering through `.filter-button`, `data-filter`, and project `data-category`
- subtle project-card tilt on fine pointers
- certificate dialog behavior using `data-certificate`, `data-title`, and `data-issuer`
- copy-email feedback
- back-to-top visibility

Keep JavaScript defensive: query an element, verify it exists, then attach behavior. Essential links, project descriptions, certificate images, and contact details must remain available when scripts fail.

## 5. Content sources and synchronization

The project currently duplicates some content because it has no content layer. Use this matrix whenever content changes:

| Content | Website source | CV source | Other affected files |
|---|---|---|---|
| Name, title, summary | `index.html` | `CV/generate_resume.py` | metadata in `index.html`, `README.md` |
| Email, phone, location | `index.html` | `CV/generate_resume.py` | `README.md` for public links |
| Education and GPA | `index.html` | `CV/generate_resume.py` | none |
| Experience | `index.html` | `CV/generate_resume.py` | project descriptions if related |
| Projects and URLs | `index.html` | `CV/generate_resume.py` | preview images, `README.md` if highlighted |
| Credentials | `index.html` | `CV/generate_resume.py` | `assets/images/credentials/` |
| Skills | `index.html` | `CV/generate_resume.py` | project evidence should support them |
| Downloadable CV | link in `index.html` | generated PDF | production asset check |
| Social preview | metadata in `index.html` | not applicable | `assets/images/og-cover.PNG` |

Before editing duplicated content, search the entire repository for the old phrase, date, email, URL, or title. After editing, repeat the search to find stale copies.

Use exact dates in machine-readable HTML attributes, for example:

```html
<time datetime="2026-08-17">17 Aug 2026</time>
```

Known credentials:

- Microsoft Turkey — AI Innovators Internship Program — Summer 2026 — certificate dated 17 August 2026
- Hugging Face Agents Course — Fundamentals of Agents, Unit 1 — certificate dated 29 August 2026

Certificate images are public portfolio assets. They may be shown directly and may also link to the LinkedIn profile. Do not claim that a LinkedIn profile link is a credential verification URL unless a specific public credential/post URL is available.

## 6. Safe editing workflows

### Before every change

```powershell
git -c core.fsmonitor=false status --short --branch
git -c core.fsmonitor=false diff -- index.html assets/css/style.css assets/js/main.js CV/generate_resume.py
```

- Identify pre-existing changes and do not overwrite them.
- Read the relevant file fully enough to understand surrounding structure.
- Prefer the smallest coherent change that satisfies the request.
- Use repository-relative, forward-slash paths in HTML.

### Add or update a project

1. Confirm the project name, role, stack, repository URL, demo URL, and measurable outcomes with evidence.
2. Add or update the project card in `index.html`.
3. Use an optimized preview under `assets/images/project-previews/` with a descriptive lowercase filename.
4. Add useful `alt` text that describes the image, not generic text such as “project image.”
5. Set the card's `data-category` values so existing filters behave correctly.
6. If the project belongs in the CV, update `CV/generate_resume.py` and regenerate the PDF.
7. Test every external link and add `target="_blank" rel="noopener noreferrer"` where appropriate.
8. Test the card at desktop and mobile widths and with keyboard navigation.

### Add a credential

1. Confirm the exact issuer, title, completion date, and whether a verification URL exists.
2. Place the original or responsibly optimized image in `assets/images/credentials/`.
3. Use a stable name such as `issuer-course-year.png`; avoid spaces and temporary names.
4. Add a credential card to `index.html` with semantic metadata and descriptive alternative text.
5. Add matching dialog trigger attributes:

```html
data-certificate="assets/images/credentials/example-certificate-2026.png"
data-title="Exact credential title"
data-issuer="Issuer · Context"
```

6. Add the credential to `CV/generate_resume.py` if it strengthens the target roles.
7. Regenerate and visually inspect the PDF.
8. Verify both the thumbnail and dialog image on the deployed site.

Do not remove identifying content from certificate images unless the owner asks. Do not fabricate credential IDs or verification links.

### Update contact information

Search and update all forms of the value, including visible text, `mailto:`, `tel:`, `data-email`, PDF hyperlinks, metadata, and README links.

### Add a new page or route

This site is served from a repository subpath. A root-relative link such as `/about/` points to the domain root, not automatically to `/portfolio/about/`.

- Prefer relative links such as `about/` or `assets/...` within the site.
- If an absolute production path is required, include `/portfolio/`.
- Update navigation, sitemap/metadata if added, and `404.html` where relevant.
- Verify the route through the GitHub Pages URL, not only on `localhost`.

## 7. CV generation and quality control

### Source-of-truth rule

Edit `CV/generate_resume.py`, then generate `CV/Ferdaws_Qaem_Resume.pdf`. The PDF is a derived artifact and must always match the generator committed beside it.

The generator uses ReportLab and currently registers Segoe UI fonts from `C:/Windows/Fonts`. This is a portability constraint. On a non-Windows machine or CI runner, either install equivalent fonts and deliberately update the typography or bundle a redistributable open-source font. Never commit proprietary font files copied from Windows.

### Generate

From the repository root:

```powershell
python CV/generate_resume.py
```

If the default interpreter lacks ReportLab, use the project's configured Python runtime or install the dependency in an isolated environment. Do not commit that environment.

### Verify content

Check that:

- the script exits successfully;
- the PDF exists and has a sensible nonzero size;
- all expected sections and recent facts are present;
- text extraction produces readable text in the correct order;
- email, LinkedIn, GitHub, and project hyperlinks are valid;
- dates and punctuation render as expected;
- there are no accidental blank pages.

### Render and inspect every page

PDF generation success does not prove the layout is correct. Render all pages to a temporary directory:

```powershell
pdftoppm -png CV/Ferdaws_Qaem_Resume.pdf <temporary-directory>/resume
```

Visually inspect every rendered page at full resolution. Look for clipping, overlap, orphan headings, weak hierarchy, excessive whitespace, tiny text, broken glyphs, inconsistent spacing, and links running outside their intended column.

The current CV is designed as a two-page, ATS-friendly document. Keep it to two pages unless a deliberate content strategy requires a change. Prefer concise evidence over dense keyword lists. Use standard section names, selectable text, simple reading order, and restrained styling.

### CV content policy

- Lead bullets with actions and concrete technical scope.
- Add metrics only when they are true and defensible.
- Avoid first-person pronouns in bullets.
- Do not use progress bars, skill percentages, portrait photos, multi-column reading traps, or decorative icons that damage ATS extraction.
- Keep tense consistent: present tense for active work, past tense for completed work.
- Tailor ordering to the target role without inventing experience.
- Remove weaker content before shrinking body text below a readable size.

## 8. Validation checklist

Run checks appropriate to the change. A large visual or structural update requires the full checklist.

### Static checks

```powershell
node --check assets/js/main.js
git -c core.fsmonitor=false diff --check
git -c core.fsmonitor=false status --short
```

Also verify:

- every `id` is unique;
- every in-page anchor has a matching target;
- local image, script, stylesheet, and PDF paths exist;
- images have meaningful `alt` text or intentionally empty `alt=""` when decorative;
- external links use HTTPS when available;
- no development-only URLs or absolute local paths appear in production files;
- no secrets or source certificate files were added accidentally.

### Local preview

Run a static server from the repository root:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173/` and check:

- page load with no console errors;
- header, section navigation, and active-link state;
- mobile navigation open, close, Escape, and focus behavior;
- light/dark mode and persistence after refresh;
- project filters and layout after filtering;
- certificate dialog open, close button, Escape, backdrop, and keyboard focus;
- copy-email behavior and feedback announcement;
- CV download/open behavior;
- all project, GitHub, LinkedIn, email, phone, article, and demo links;
- back-to-top behavior;
- content with JavaScript disabled;
- keyboard-only navigation;
- `prefers-reduced-motion` behavior.

Test representative viewport widths around 1440, 1040, 820, 560, and 360 pixels. Watch for horizontal scrolling, clipped cards, overflowing URLs, broken navigation, and inaccessible controls.

### Visual quality

- Maintain clear hierarchy and generous but consistent spacing.
- Keep line lengths readable and button labels unambiguous.
- Check light and dark mode contrast.
- Use motion to communicate state, not as decoration everywhere.
- Optimize large images and set intrinsic dimensions when practical to reduce layout shift.
- Keep hover-only effects supplemental; all actions must work on touch and keyboard.

### Accessibility

- Preserve the skip link and semantic landmarks.
- Maintain one clear `<h1>` and a logical heading order.
- Ensure focus is visible against every background.
- Associate controls with accessible names and state attributes.
- Do not encode meaning by color alone.
- Use native controls before custom widgets.
- Confirm dialog focus returns to its trigger when closed.
- Avoid autoplay, flashing, and motion that ignores user preferences.

## 9. Git and deployment workflow

The production site is expected to deploy from GitHub Pages after changes reach `main`.

1. Review the complete diff.
2. Run validation and regenerate the CV if its source changed.
3. Stage only intended files.
4. Use a descriptive commit message.
5. Push to `origin main` only when authorized.
6. Wait for GitHub Pages to finish deploying.
7. Verify production with a cache-busting query parameter.

Example production URLs:

```text
https://ferdaws-c.github.io/portfolio/?v=<commit-or-timestamp>
https://ferdaws-c.github.io/portfolio/CV/Ferdaws_Qaem_Resume.pdf?v=<commit>
https://ferdaws-c.github.io/portfolio/assets/images/credentials/microsoft-ai-innovators-2026.jpg?v=<commit>
```

Production verification must include the live page title, stylesheet and script loading, certificate images, downloadable PDF, mobile behavior, and at least one external link. A successful `git push` is not proof of a successful deployment.

Do not switch hosting providers, rewrite history, force-push, or change repository visibility unless explicitly requested.

## 10. Scaling strategy

Scale only when the cost of the current architecture becomes greater than the complexity of the next one.

### Stage 1: improve the current static site

Use this stage for the next several content additions.

- Extract repeated values into clearly marked content blocks or a small structured data file.
- Add image width/height metadata and modern formats where browser support and quality allow.
- Add a favicon and web app metadata if the owner provides or approves the artwork.
- Add automated local-link, duplicate-ID, and HTML validation.
- Keep dependencies at zero or near zero.

### Stage 2: introduce lightweight tooling

Consider a minimal Node-based toolchain when formatting, content duplication, or validation becomes error-prone.

- Add Prettier and focused linting.
- Add a link checker and image optimization script.
- Generate repeated project and credential markup from structured data.
- Document exact commands in `README.md` and pin versions with a lockfile.
- Keep the generated site fully static and deployable to GitHub Pages.

Do not add a package manager only for one trivial script.

### Stage 3: migrate to a static site generator

Consider Astro or an equivalent static-first system only when at least one of these becomes real:

- many projects or credentials make hand-authored HTML difficult;
- a blog, case studies, tags, pagination, or multiple routes are required;
- reusable components materially reduce maintenance;
- localized content is required;
- a content editor or CMS becomes necessary.

Migration requirements:

- preserve the current design intent, metadata, content, URLs, and accessibility behavior;
- configure the GitHub Pages base path as `/portfolio/`;
- produce static output;
- preserve or redirect old URLs;
- compare old and new pages visually at all target breakpoints;
- avoid shipping a large client-side runtime for static content;
- document development, build, preview, and deployment commands.

### Stage 4: continuous integration

When a build system exists, add GitHub Actions that can:

- validate HTML, CSS, JavaScript, and links;
- check formatting and duplicate IDs;
- build the static site;
- run accessibility and performance checks on representative pages;
- verify that generated artifacts exist;
- deploy only after checks pass.

CV generation in CI needs a font strategy first because the current script depends on Windows Segoe UI fonts. Resolve that explicitly before automating PDF builds on Linux.

### Stage 5: content and measurement systems

Add a CMS only if the owner will update content frequently enough to justify authentication, schema maintenance, and service dependency. Add analytics only after choosing a privacy approach and obtaining explicit approval. The portfolio must still work if optional services fail.

## 11. Performance and quality budgets

Use these as targets, not excuses to manipulate audit scores:

- no avoidable render-blocking third-party scripts;
- no uncompressed full-resolution images used as thumbnails;
- no layout shift from images or dynamically inserted content;
- meaningful content visible quickly on a typical mobile connection;
- Lighthouse targets on production: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+;
- zero uncaught JavaScript errors;
- zero broken first-party links or missing production assets;
- responsive layout down to 360 CSS pixels;
- complete keyboard access to every interaction.

Measure production as well as localhost because GitHub Pages caching and path handling can reveal different failures.

## 12. Design and content direction

The portfolio positions Ferdaws as an early-career engineer working across local AI, software products, and embedded systems. The visual direction is editorial and technical: strong typography, structured cards, blue-led accents, careful motion, and a professional light/dark system.

When extending the design:

- prioritize project evidence, role clarity, and outcomes;
- use the existing visual tokens and components;
- keep decorative effects restrained;
- avoid generic AI imagery and stock-photo clichés;
- do not bury contact actions or the CV;
- favor detailed case studies over adding many shallow cards;
- make new interactions discoverable and accessible;
- keep language direct, credible, and concise.

The existing `assets/images/og-cover.PNG` may not always reflect future design changes. Review it after major rebranding, but do not replace it casually because social previews are part of the public identity.

## 13. Known constraints and risks

- GitHub Pages serves the site under `/portfolio/`; careless root-relative paths will break.
- The website content is currently hand-authored and duplicated in the CV generator.
- The CV generator depends on Windows Segoe UI font paths.
- Credential LinkedIn actions currently lead to the profile, not a credential-specific verification page.
- Some project demos are hosted on Google Drive and can change permissions independently of this repository.
- The public phone number and email are intentional current content; confirm with the owner before changing their visibility.
- Browser testing should tolerate a missing favicon until one is intentionally added.
- Education start dates appear in the CV but not the website. If the website begins showing a start date, confirm it against the CV and owner-provided facts.

## 14. Definition of done

A portfolio or CV task is complete only when:

- the requested content and behavior are implemented;
- no unsupported claims were introduced;
- duplicated facts are synchronized;
- affected interactions work with mouse, touch, and keyboard;
- light, dark, desktop, tablet, and mobile presentations are checked;
- JavaScript syntax and repository whitespace checks pass;
- changed local and external links are verified;
- the CV is regenerated and every page is visually inspected when its source changes;
- the diff contains only intended files;
- documentation is updated if architecture, commands, or content ownership changed;
- production is checked after deployment when a push was requested.

## 15. Handoff template for future AI agents

At the end of an update, report:

```text
Summary:
- What changed and why

Files changed:
- Exact paths and their roles

Content decisions:
- Facts added, removed, or synchronized
- Assumptions explicitly confirmed by the owner

Validation:
- Commands run and their results
- Viewports, themes, interactions, and PDF pages inspected
- Links and production assets checked

Deployment:
- Commit hash and branch, if committed
- Push/deployment status, if authorized
- Production URL and verification result

Remaining work:
- Known limitations, optional improvements, or owner decisions still needed
```

Never report deployment, testing, visual inspection, or link verification unless it was actually performed.

---

Last documentation review: 14 September 2026. Update this guide whenever the architecture, deployment process, CV generator, canonical content model, or validation workflow changes.
