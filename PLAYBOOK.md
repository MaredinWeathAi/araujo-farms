# Building & Launching a Website with Claude Cowork — A Reusable Playbook

This document captures everything used to design, build, and deploy the **Araujo Farms**
website with Claude in Cowork, so it can be reproduced on another machine. Hand it to
anyone learning Cowork; the two most important parts to copy are **Section 2 (the master
prompt)** and **Section 6 (Cowork setup)**.

> Note: Claude's internal "system prompt" is Anthropic's confidential configuration and
> can't be reproduced verbatim. It didn't need to be — what actually shaped this build was
> the request, the user's own Cowork setup, and the skills/process below. That's all here.

---

## 1. The original request that kicked it off

Copied exactly as it was sent:

> I want you to build me a simple website about farm in Brasil. Both the individuals in
> charge, their experience, the farm and raising cattle.
>
> I want it to look smart and clean. I have also attached images and videos to use, along
> with some text about the farm in the attached folder.
>
> Call it Araujo Farms, just as a starting place. Put it into github and on railway and
> deploy online.

That's it. Short and clear. Everything else came from good setup + Claude's process.

---

## 2. The reusable "master prompt" (copy-paste this)

Fill in the brackets and send it. This is the pattern that works:

```
Build me a clean, professional website about [SUBJECT].
It should cover [KEY SECTIONS — e.g. the people/team and their experience, the product,
the story, contact].

Style: smart and clean, modern and editorial. [Add a vibe if you have one — e.g. warm
and rustic / sleek and corporate / minimalist.]

I've put photos, videos, and some text in the attached folder — use those as the real
content. Keep any private/sensitive data out of the public site.

[If bilingual:] Make it bilingual in [LANG A] and [LANG B] with a language toggle.

Call it "[NAME]" as a starting point.

Then put it on GitHub and deploy it online so I have a public link. Work autonomously —
research the material first, ask me only the few questions that actually change the
outcome, then build, test, and deploy.
```

Tips baked into that prompt:
- "use the attached folder as the real content" → Claude reads your files instead of inventing.
- "keep private data out" → e.g. it kept owner CPF/CNPJ numbers off our public site.
- "ask only the few questions that change the outcome" → you get 2–3 sharp questions
  (language, purpose, how to handle missing info), not twenty.
- "research first, then build, test, deploy" → enforces the right order.

---

## 3. How the work actually flowed (the method)

This is the loop Claude followed. It's worth telling your friend's Claude to work this way.

1. **Read everything first.** Listed the attached folder, read the text, extracted the
   PDFs (an environmental registration doc gave the real farm name, hectares, coordinates,
   licenses), and viewed every photo/video to know what imagery existed.
2. **Ask the few decisions that matter.** Three multiple-choice questions: language
   (chose bilingual EN/PT), site purpose (brand/story vs for-sale, and whether to show a
   price), and how to handle missing info (the people's bios → editable placeholders).
3. **Curate the media.** Picked the 16 best distinct photos + 4 best videos, skipped
   near-duplicates and anything off-brand, and web-optimized them (resized/compressed
   images, transcoded videos, generated poster frames).
4. **Build the site** (see Section 4).
5. **Test before claiming done.** Ran it locally, checked every image/link, verified the
   language toggle, took full-page + mobile screenshots with a headless browser, and
   validated that every translation key existed in both languages.
6. **Deploy and verify live** (see Section 5) — then actually loaded the public URL to
   confirm it rendered.
7. **Iterate on request** — later added a real person (principal manager) and re-deployed.

---

## 4. The technical recipe (what got built)

Deliberately simple and portable — no framework needed for a content site.

- **One self-contained `public/index.html`** — all HTML, CSS, and JS in a single file.
  Editorial layout: fixed nav, full-bleed hero, alternating text/image sections, stat bar,
  team cards, photo gallery, video section, an embedded map, and a footer.
- **Bilingual via a tiny JS dictionary.** Every translatable element carries a
  `data-i18n="key"` attribute; a JS object holds `{ en: {...}, pt: {...} }`; a `setLang()`
  function swaps `textContent`. A language remembers itself with `localStorage`. Keeping all
  copy in one dictionary makes editing text trivial.
- **A minimal Node/Express server (`server.js`)** that just serves the `public/` folder.
  It reads `process.env.PORT` so any host can run it. (A content site is static, so it can
  also be hosted with zero server — see Pages below.)
- **`package.json`** with a `start` script and Node engine, so hosts auto-detect it.
- **Media** lives in `public/media/photos` and `public/media/videos` with clean, meaningful
  filenames (`hero.jpg`, `river-boat.mp4`, …) referenced by **relative** paths (`media/...`,
  not `/media/...`) so the site works both at a domain root and in a sub-path.
- **Design choices that read as "smart and clean":** a restrained palette (deep forest
  green, warm cream, a single gold accent), a serif display font (Fraunces) paired with a
  clean sans (Inter) from Google Fonts, generous whitespace, subtle scroll-reveal
  animations, and full mobile responsiveness. Facts on the page all came from the source
  documents; nothing about real people was invented (placeholders were clearly marked).

---

## 5. Deployment recipe (GitHub + hosting)

The build machine had two things pre-set (see Section 6): the **GitHub CLI (`gh`) logged
in**, and **git configured to use an SSH key**. With those, deployment is a few commands.

**GitHub (from the machine's terminal / Cowork's shell):**
```bash
cd your-project
git init -b main
git add -A
git commit -m "Initial site"
# creates the repo AND pushes, using your existing gh login:
gh repo create <name> --public --source=. --remote=origin --push
```

**Hosting — two good options:**

*Option A — GitHub Pages (free, fully automatic, great for content sites).* Add a workflow
file at `.github/workflows/pages.yml` that publishes the `public/` folder, then enable Pages:
```bash
gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow
```
Every push then auto-deploys. Site lives at `https://<owner>.github.io/<repo>/`.
(Requires relative asset paths — that's why we used `media/...` not `/media/...`.)

*Option B — Railway (for a running server / private repos).* New Project → Deploy from
GitHub repo → pick the repo. Railway auto-detects Node, runs `npm start`, sets `PORT`
itself; then Networking → Generate Domain for a public URL. Railway needs a **one-time
login** (Continue with GitHub) that only the account owner can do — Claude can't enter
credentials for you.

**Always verify:** after deploy, actually open the public URL (or `curl` it) and confirm
the page and a couple of images return HTTP 200.

---

## 6. Set your Cowork up like ours (the real "secret sauce")

This is what made Claude able to work autonomously. Have your friend do these once:

**a) A "global instructions / working memory" note.** In Cowork settings, add standing
instructions Claude sees every session. Ours included a clear working style. A good starter
template:
```
# Working Memory / Standing Instructions

## Who I am
- [Name], [role]. I work on [macOS/Windows]. I use Terminal, VS Code, GitHub.
- Git protocol: SSH. GitHub username: [username].

## Working style — do it, don't ask
- Before asking me to do something, try several concrete approaches yourself first.
  Exhaust file-based options (SSH keys, tokens, CLI logins) before asking me for anything.
- Prefer direct action. When a fix is clear, ship it — don't hand me a to-do list.
- Always verify a change works (run it, load the URL) before saying it's done.

## Projects / tools
- [List your apps, repos, deploy targets, and any hard-won "gotchas" so Claude reuses them.]
```
(Don't put secrets like private keys in here — just point to where they live.)

**b) Make the machine's credentials available** so Claude can deploy without you:
- Install & log in the **GitHub CLI**: `gh auth login` (choose SSH). Verify: `gh auth status`.
- Have an **SSH key** set up with GitHub (`ssh -T git@github.com` should greet you).
- Optionally install the **Railway CLI** and `railway login` if you'll use Railway.

**c) Connect the project/asset folder** to the Cowork session ("Add folder") so Claude can
read your photos/text and write the project back to disk.

**d) Turn on the relevant skills.** Cowork "skills" are pre-packaged know-how. The ones
central to this build:
- **create-web-desktop-app** — scaffolding websites/apps.
- **deploy-github-railway** — the GitHub + Railway deployment pipeline.
- (Handy extras: **docx/pptx/xlsx/pdf** for documents, **canvas-design** for graphics.)
These appear automatically when the task matches; your friend just needs them enabled in
their Cowork/plugin settings.

**e) Optional: Desktop Commander.** A local-shell tool that lets Claude run commands on the
machine (git, gh, build tools). It's what let us build and push straight from the Mac.

---

## 7. Prompting tips that made a difference

- **Point Claude at real source material** ("use the attached folder") instead of asking it
  to make things up.
- **Say the outcome, not the steps** — "deploy it online so I have a public link" beats
  micromanaging commands.
- **Give a style in a few words** — "smart and clean," "warm and editorial." That's enough.
- **Let it ask a couple of questions**, then answer them; those 30 seconds prevent building
  the wrong thing.
- **Ask for verification** — "test it and show me screenshots / the live link."
- **Iterate in small asks** — "make [person] the principal manager," "add these photos,"
  "make the repo private." Each is quick and safe.

---

## 8. Efficiency & token-conscious development (the practices that keep it cheap and fast)

There is **no magic "minimize tokens" skill** — efficiency comes from working habits. These
are the concrete ones used on this build; they cut token use *and* make development faster.
Your friend can literally add a line to their global instructions: *"Work token-efficiently:
batch tool calls, read only what's needed, verify programmatically, and don't redo work."*

- **Batch independent actions into one step.** Reading ten photos, or running several
  unrelated shell checks, happens in a single message instead of ten round-trips. Fewer
  round-trips = fewer tokens and far less wall-clock time.
- **Read only what you need.** Open the part of a file that matters (line offsets/ranges),
  not the whole thing. Never re-read a file you just wrote or edited — the tools already
  confirm the change.
- **Search, don't dump.** Use find/grep-style tools to locate the exact line, rather than
  loading an entire large file into context to eyeball it.
- **Curate inputs early.** 16 chosen, web-optimized photos + 4 videos instead of all 37
  raw files — less to process, smaller everything. Resize/compress media before it ever
  enters the project.
- **Verify with tiny scripts, not by re-reading.** A 10-line script checked that every
  translation key existed in both languages and that the live pages returned HTTP 200 —
  cheaper and more reliable than scrolling a 700-line file or trusting a glance.
- **Do the work where the files live.** The site was assembled and pushed on the machine
  itself, and files were moved via the connected folder / small encoded transfers — not by
  pasting big blobs of code or media back and forth through the chat.
- **Edit, don't rewrite.** Change the few lines that need changing rather than regenerating
  a whole file each time (e.g. the "principal manager" update touched only those strings).
- **Keep deliverables self-contained.** One `index.html` with inline CSS/JS = fewer files
  to track, read, and reason about than a sprawling multi-file scaffold.
- **Ask 2–3 sharp questions up front.** The single biggest token *saver* is not building
  the wrong thing and having to redo it. A few clarifying questions beats a full rebuild.
- **Reuse existing auth and tools.** Deploying through the already-logged-in `gh`/SSH,
  instead of re-deriving credentials or exploring dead ends, avoids a lot of wasted steps.
- **Use a task list.** Tracking what's done prevents re-doing completed work and keeps long
  jobs on-track across many steps.

For heavier jobs there are also "sub-agents" (delegating a big search or a self-contained
chunk to a separate worker so its file-reading doesn't fill the main conversation) — useful
when a task would otherwise mean reading across many files. Overkill for a site this size,
but worth knowing for large codebases.

---

## 9. What isn't in here (and why it doesn't matter)

The only thing not reproduced is Claude's internal system prompt — that's Anthropic's
private configuration, and copying it out isn't something I can do. But that prompt is the
*same* for your friend's Claude already. The parts that were specific to *how we worked* —
the request, the setup, the skills, the process, the technical recipe — are all above, and
those are exactly what your friend needs to get the same results.

Good luck — tell your friend to start with Section 2 and Section 6.
