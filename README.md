# RetDemSetGo!

A responsive, supplementary learning space for selected Fundamentals of Nursing Practice skills among first-year nursing students at the University of Makati.

**Current release: a functional interface prototype, awaiting clinical content.** The official repository was inspected and had no files, commits, branches, dependencies, or working features. This implementation establishes its initial architecture. No existing application was replaced.

## Run locally

Requirements: Node.js 22 or newer and npm. No backend, database, API key, account, or environment variable is needed.

```sh
cd /workspace/RETDEMSETGO  # or your local checkout
npm ci
npm run dev
```

The Vite terminal prints the development address. In restricted cloud workspaces with an unwritable home-directory cache, use `npm ci --cache /workspace/.npm-cache`. Fonts and icons are installed dependencies; the application makes no third-party font or analytics requests.

```sh
npm run build          # TypeScript checks + optimized production files in dist/
npm run build:pages    # GitHub Pages build with repository base and hash routes
npm run preview        # Serve the production build for local verification
npm run lint           # ESLint, TypeScript, React Hooks rules
npm test               # Publication checks, scoring, shuffle, move controls
npm run test:e2e       # Desktop + mobile functional and automated accessibility tests
npm run format        # Format source, configuration, tests, and documentation
```

Before the first browser test on a development machine, run `npx playwright install chromium` (or `npx playwright install --with-deps chromium` on a supported Linux machine). If Chromium is already installed, use `CHROMIUM_PATH=/usr/bin/chromium npm run test:e2e`. The test runner starts Vite on port 5173 automatically. GitHub Actions includes the quality checks and browser installation.

## What works

- Home, student dashboard, saved modules, learning guide, and About & References.
- Three configurable FNP module shells with overview, procedural guide, demonstration, activities, and results sections.
- Search, module filters, local bookmarks, responsive navigation, keyboard focus, and a Help & privacy dialog with local-data reset.
- Sequencing: randomized steps, drag-and-drop, labeled up/down buttons, position scoring, correct order, rationales, safety reminders, and retries.
- Error recognition: scenarios, single-choice answers, immediate explanation, scenario navigation, scoring, and retries.
- Knowledge checks: question navigation, answer progress, submission, explanatory feedback, completed-answer enforcement, results summary, and retries.
- Results: correct/total, percentage, incorrect responses, correct responses, explanations, safety reminders, retry, and dashboard navigation.
- Local latest-attempt results isolated by module, content revision, and demo versus clinical mode. No research results are transmitted.
- Clinical publication checks for status, approval metadata, complete material, references, unique identifiers, answer keys, and accessible media metadata.

## Clinical content boundaries

The three skill names are placeholders. **No clinical procedures, expert findings, academic references, or institutional endorsement have been fabricated.** All three clinical modules are Draft and expose only their empty module structure. Their clinical instructional content and activities are withheld.

`/demo/fnp-skill-1` (and the other module demo routes) uses clearly labeled **nonclinical examples about using the platform**. Reviewers can test every interaction and result without being shown invented nursing instructions. Demo scores are not clinical learning outcomes. Approved clinical content must be supplied and reviewed before clinical content validation or a clinical learning evaluation can be completed. The current prototype can support interface usability exploration; it does not establish educational efficacy or study findings.

This platform supplements instructor demonstrations, supervised laboratory practice, and actual return demonstrations. It is not a patient-care decision tool. Practice scores are formative feedback, not official competency or return-demonstration grades.

## Configure and release a skill

Edit `src/content/skills.ts` using the `Skill` and `SkillContent` contracts in `src/content/types.ts`. Keep the module ID stable and increment `revision` whenever answer keys or instructional content change, so earlier attempts do not appear against changed material.

1. Finalize the selected skill after the needs assessment and suitability evaluation.
2. Keep `status: 'Draft'` while authoring its `content`. Supply introduction, objectives, materials, procedural steps with stable IDs, rationales and safety reminders, scenarios, questions, correct option IDs, explanations, and genuinely approved reference citations.
3. Set `status: 'For Expert Review'` when the material is ready for the actual expert review process. This status continues to hide instructional content on student routes.
4. Apply the actual review findings; do not invent them. Record the real reviewer and ISO review date in `approval: { reviewer, date }`, and set `status: 'Approved'` only after approval is established.
5. Run the quality checks and inspect the skill on its student route. `releaseIssues(skill)` in `src/lib/learning.ts` lists structural release blockers; `isReleased(skill)` is the single gate used by the dashboard, module, and reference pages.

The data structure is:

```text
Skill
  id, number, title, subtitle, description, color, icon
  status: Draft | For Expert Review | Approved
  revision
  approval?: reviewer, date
  content?:
    introduction, objectives[], materials[]
    steps[]: id, instruction, rationale, safety
    scenarios[] / questions[]:
      id, prompt, options[]: id + text,
      correctOption, explanation, safety
    references[]: title, citation, optional HTTPS url
    demonstration?: type (image | video), HTTPS url, title, transcript
```

For sequencing, the `steps` array is the approved answer order; the learner receives a shuffled copy. Question answers are compared by stable option IDs. Incorrect or unanswered responses never receive credit. Questions require submission before the final results can be opened. Sequencing percentages measure exact positions, not partial clinical competency.

Media is optional: without it the module explicitly says there is no demonstration. Use only approved, licensed media. Video must be understandable through its descriptive text transcript; image media requires an accurate title and full description. The current player expects a direct media-file URL, not a video-sharing page or iframe. For future media requiring synchronized captions or audio description, add and validate the appropriate accessible tracks before publication.

**Review is a repository-based workflow, not an authenticated content-management system.** The release checks establish structural completeness; they cannot verify a reviewer’s identity or the clinical accuracy of a reference. Human clinical validation remains necessary. Do not put sensitive reviewer or student information in client-bundled data. For confidential draft authoring, use a separate private workflow: any data imported into this static application is shipped in its client bundle, even when not rendered on student pages.

## Architecture

```text
src/
  App.tsx                       Routes and shared local progress
  components/
    Layout.tsx                  Navigation, search, mobile drawer, help dialog
    Brand.tsx, HeroArt.tsx       Original vector branding and illustration
    SkillCard.tsx               Reusable configurable module card
    Activities.tsx              Sequencing, questions, results, activity picker
  content/
    types.ts                    Clinical content contracts and statuses
    skills.ts                   Placeholders + separate nonclinical demo
    activities.ts               Shared activity names
  lib/
    learning.ts                 Publication checks and activity algorithms
    progress.ts                 Defensive, local-only persistence
    learning.test.ts            Unit tests
  pages/
    Home.tsx, Dashboard.tsx      Student entry points
    Module.tsx                  Reusable module and demo workflow
    Information.tsx             Learning guide, About & References
  styles.css                    Responsive visual system and reduced motion
tests/learning.spec.ts          Desktop/mobile browser checks
```

Stack: React, TypeScript, Vite, React Router, Lucide icons, self-hosted DM Sans and Manrope, Vitest, Playwright, axe-core, ESLint, and Prettier. No personal data service or research instrument has been added.

## Privacy, accessibility, and deployment

The only persistent application data is the `retdemsetgo-progress-v1` entry in browser localStorage: bookmarked module IDs and latest practice results. No names, student numbers, or activity timestamps are collected. This data is limited to the same browser and origin; users can clear it in Help & privacy. If storage is unavailable, the activities still work in the current session. A shared device can retain earlier users’ local results until cleared.

Features include a skip link, native radios and dialog, labeled reorder controls, keyboard drawer navigation, live feedback, visible interactive focus, reduced-motion support, and responsive layouts. Automated WCAG A/AA scans are part of the browser suite, but do not establish full accessibility conformance; manual assistive-technology and cross-browser evaluation remain appropriate before release.

The default `npm run build` targets a domain root with browser-history routes. Serve `dist/` with an HTTPS static host and configure all application routes to fall back to `index.html`. A basic static server without SPA fallback will fail on direct links such as `/skill/fnp-skill-1`. Vite’s development and preview servers already handle these routes.

### Deploy with GitHub Pages

The repository includes a **manual** deployment workflow. Pushing code alone does not publish the website.

**A white page after deployment usually means the source branch was published instead of the compiled app.** Do not select **Deploy from a branch → development/learning-platform → /(root)**: that serves the development `index.html`, which references TypeScript source the browser cannot run. Use the GitHub Actions source and the workflow below to publish the built `dist/` directory. The workflow registers and checks itself when its file is pushed, but its deploy job runs only when you choose **Run workflow**.

1. Open [the repository’s Pages settings](https://github.com/CZKDYN/RETDEMSETGO/settings/pages). Under **Build and deployment → Source**, select **GitHub Actions**. Pages availability depends on the repository visibility and GitHub plan.
2. Open **Actions → Deploy GitHub Pages → Run workflow**. Select `development/learning-platform` (or the default branch containing these files) and run it. If the workflow is not listed, ensure `.github/workflows/deploy-pages.yml` is present on the repository’s default branch; GitHub lists manually runnable workflows from the default branch.
3. Wait for both the build and deploy jobs to succeed. The deployment job and Pages settings provide the actual published URL. For this repository, the expected URL without a custom domain is `https://czkdyn.github.io/RETDEMSETGO/`.

The workflow installs from the lockfile, runs lint and unit tests, builds, and uploads `dist/`. GitHub supplies its own workflow authentication; no personal access token or application secret is required. A newly created `github-pages` deployment environment may need to allow the selected branch under **Settings → Environments → github-pages → Deployment branches and tags**. Do not bypass any existing environment approval requirements.

`npm run build:pages` builds with `/RETDEMSETGO/` as the asset base and a hash router so static hosting supports direct module links and refreshes, for example `/RETDEMSETGO/#/demo/fnp-skill-1`. For a custom domain or renamed repository, update the Pages `base` in `vite.config.ts` before building. To inspect this exact build locally, run `npm run build:pages` followed by `npm run preview -- --mode pages`, and open the repository path printed by Vite.

The deployment remains a **prototype with unpublished clinical placeholders** and explicitly nonclinical activities. Publishing it does not establish clinical validation or institutional approval. Nothing in this implementation requires pushing directly to `main`.

Each cloud task already has an isolated checkout. Use the existing `/workspace/RETDEMSETGO` checkout; do not create a Git worktree unless explicitly requested. Reinstall only if dependencies need refreshing. Runtime processes must be restarted in a new task even if the installed filesystem is retained.
