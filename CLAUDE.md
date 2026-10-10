# Frontend Interview Handbook — working notes for Claude

Bilingual (fa RTL / en LTR) static handbook. React 19 + TS + Vite + MDX + Tailwind v4, Paraglide i18n.
Full design in `PLAN.md` (read only if needed). Writing standard: skill `handbook-author` (load it before writing any chapter).

## Token-saving rules (read first)
- Do NOT read old session transcripts to find "where we left off" — the **Progress** section below is the source of truth. Update it at the end of every chapter.
- Don't re-read whole existing chapters for style; read ~60 lines of one sibling chapter at most.
- Check `html live` demo outputs: `node .tmp/live-blocks.mjs <mdx...>` → `public/__live-blocks.json`; then in the dev page `const { runLive } = await import("/.tmp/run-live.js?" + Date.now()); await runLive()` (real previews are sandboxed). Delete the json afterwards.
- Mermaid: `node .tmp/mermaid-blocks.mjs <mdx...>` then in the dev page `mermaid.parse` each block from `/__mermaid-blocks.json` (import `/node_modules/.vite/deps/mermaid.js`). `js run` blocks: `node .tmp/run-blocks.mjs -v <mdx...>`.
- Use `pnpm check:content` (compiles all MDX, checks fa/en parity) instead of opening pages one by one; use the browser only for a final visual check per chapter (one screenshot, scale 0.6).
- Verify code claims with tiny scripts in `.tmp/` (scratch, safe to overwrite), not by long reasoning.
- Keep chat summaries short; details belong in the chapters.

## Git
- Commit and push to `origin main` after every finished chapter/fix (user request). Pushing deploys to GitHub Pages.

## Adding a chapter
1. Slug already listed in `src/features/content/registry.ts` (`parts[].chapters`).
2. Write `src/content/fa/<part>/<slug>.mdx` and `src/content/en/<part>/<slug>.mdx` (same headings/anchors).
3. Add a one-line `descriptions['<part>/<slug>'] = { fa, en }` entry at the end of `registry.ts`.
   Links are locale-free (`/html/fundamentals#…`), but heading anchors differ: en slugs are English, fa slugs are the Persian heading text (e.g. `#dom-چیست`). Check them on the rendered page.
4. End with `## جمع‌بندی` / `## Recap` using `<Recap>`.
5. `pnpm check:content`, then dev server (`.claude/launch.json` → "handbook", port 5173), light+dark.
6. `pnpm build` at the end of a part.

## Progress (update me)
- ✅ HTML (6), CSS (8), JavaScript (18), TypeScript (5) — all fa+en, with recaps. Build passes (2026-10-10).
- ✅ Browser (7): dom, events, rendering-pipeline, storage, http-fetch, websocket, security. Build passes (2026-10-10).
- ⏳ React (8) · Tooling (3) · Algorithms (3) · Patterns (4) · Architecture (3) · Interview (2) · Cheatsheet (2)
- ⏳ Deploy to Vercel (user asked for it at the very end; `vercel.json` exists)
- Next up: **React** (8 planned chapters). User decision (2026-10-10): make React the most complete part —
  cover React 19 and every later update (19.x features, React Compiler, etc.) and the tricky parts in depth;
  State chapter covers built-ins + Zustand + TanStack Query. Verify APIs against installed `react` / `@types/react`.
- React plan (decided 2026-10-10, react 19.3.0 installed): 10 chapters, in order —
  fundamentals · hooks · rendering · state · effects · performance (memo + Compiler + Activity) ·
  react-19 (NEW: Actions, useActionState, useOptimistic, use, ref-as-prop, metadata, 19.1→19.3, ViewTransition) ·
  patterns (NEW: composition, compound, error boundaries, portals, controlled/uncontrolled) ·
  advanced (concurrent, Suspense, RSC, SSR/streaming/hydration) · interview-questions.
  ✅ Step 0 done: ```jsx live``` / ```tsx live``` blocks (ReactLive.tsx + build/react-runtime-plugin.ts;
  runtime is fetched once and sent to the sandboxed iframe by postMessage — <script src>/blob URLs are blocked there).
  zustand + @tanstack/react-query (devDeps) and sucrase (dep) installed.
  Testing note: if the Browser pane is hidden, IntersectionObserver never fires, so live blocks never mount —
  stub `IntersectionObserver` in the page, then remount via history.pushState + popstate.
  Note: `pnpm lint` is broken (typescript-eslint 8.71 rejects TS 7); this predates the React work.
  ✅ react/fundamentals (fa+en, 14 live demos, all click-tested). Check live blocks: `node .tmp/react-blocks.mjs <mdx>`.
  ✅ react/hooks (fa+en, 12 live demos click-tested; effects/memo/transitions/React-19 hooks deferred to their chapters).
  ✅ react/rendering (fa+en, 7 live demos; commit/effect order and batching verified in the browser).
  Live demos may call console.clear() to reset their console.
  ✅ react/state (fa+en, 7 live demos; Zustand object-selector loop and the optimistic rollback verified in the browser).
  Live demos can also import `zustand/shallow`.
  Hidden Browser pane: diagrams stay on "drawing…" too; validate with `mermaid.render` using the page's own
  `/deps/mermaid.js?v=…` URL (from performance entries) — importing it without `?v=` breaks Vite's dep cache.
  ✅ react/effects (fa+en, 9 live demos; console output checked in the browser).
  Slugs: rehype-slug strips ZWNJ, so fa anchors use «میکند» not «می‌کند» (`node .tmp/slug.mjs '<heading>'`).
  Hidden pane: live-demo consoles are mirrored into the parent page text (`innerText.split('
Console
')`).
  ✅ react/performance (fa+en, 8 live demos: Profiler, memo, useMemo, virtualization, lazy, Activity).
  Next: react/react-19.
- JWT (user request 2026-10-10): cover JWT in the post-React parts — full treatment in
  architecture/auth-security-performance (structure header.payload.signature, base64url, signing HS256 vs RS256,
  claims exp/iat/nbf/aud/iss, verification, access + refresh tokens and rotation, where to store: httpOnly
  cookie vs memory vs localStorage and XSS/CSRF trade-offs, revocation, JWT vs sessions, `alg: none` / weak secret
  attacks, decoding demo) and short mentions/links from patterns, interview and cheatsheet chapters.
