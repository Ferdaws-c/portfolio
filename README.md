# Ferdaws Qaem Portfolio

Personal engineering portfolio showcasing work across local AI, cross-platform mobile development, embedded IoT systems, and interactive software.

**Live site:** [ferdaws-c.github.io/portfolio](https://ferdaws-c.github.io/portfolio/)

## Highlights

- Filterable project portfolio with source, demo, and article links
- Interactive certificate gallery for Microsoft and Hugging Face credentials
- Responsive light and dark themes with saved user preference
- Accessible navigation, keyboard focus states, reduced-motion support, and semantic markup
- Downloadable ATS-friendly resume

## Portfolio Studio

Open [the editor](https://ferdaws-c.github.io/portfolio/admin/) to manage your about information, portrait, projects, education, and multiple CV PDFs by field. Structured fields preserve the site's layout. Drafts can be previewed before publishing, and previous published versions can be restored.

**Activation required:** follow [docs/ADMIN-SETUP.md](docs/ADMIN-SETUP.md) to create the Supabase project, run the SQL migration, create your administrator email/password, and add the public configuration. No account or backend is preconfigured. Before activation, local exploration saves drafts on the current device only.

The website remains on GitHub Pages. Supabase supplies secure account access, published content, history, and public file uploads. Layout/code changes remain in GitHub; dashboard publishing updates the database. The current default PDF is the owner-supplied photo CV. The legacy Python generator writes a separate `CV/Ferdaws_Qaem_Resume_Generated.pdf` and must not replace the active download.

Validation: `node --test tests/content.test.cjs`.

## Website technology

- Semantic HTML5
- Modern CSS with custom properties and responsive layouts
- Vanilla JavaScript for filtering, dialogs, themes, scroll state, and small interactions
- GitHub Pages deployment

## Project structure

```text
portfolio/
├── index.html
├── 404.html
├── assets/
│   ├── css/style.css
│   ├── js/main.js
│   └── images/
│       ├── credentials/
│       └── project-previews/
├── CV/
│   ├── Ferdaws_Qaem_Resume.pdf
│   └── generate_resume.py
└── README.md
```

## Contact

- [LinkedIn](https://linkedin.com/in/ferdaws-qaem)
- [GitHub](https://github.com/Ferdaws-c)
- [Email](mailto:ferdawsqaem@gmail.com)
