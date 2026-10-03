---
name: handbook-author
description: Writing standard for this Frontend Interview Handbook (bilingual fa/en MDX). Use whenever writing, rewriting, reviewing or translating any chapter in src/content/{fa,en}, adding a new chapter, or when the user says an explanation is unclear, shallow, or badly translated.
---

# Handbook author — content & translation standard

The reader is a developer preparing for a frontend interview who may meet a topic for the
first time. Every chapter must take them **from 0 to 100**: no step may be skipped, no term
may appear before it is explained, and every claim must be visible in an example.

## 1. Teaching structure (every section, every subtopic)

For each concept, in this order — skip a step only if it truly does not apply:

1. **Why it exists** — the problem it solves, in one or two plain sentences. A tiny story or
   everyday analogy is welcome ("a Map is a phone book: you look up by name, not by position").
2. **What it is** — a precise definition in simple words. Bold the term the first time.
3. **Smallest possible example** — 3–8 lines, runnable (```` ```js run ````) where it makes sense,
   with a comment on every non-obvious line saying what it prints and *why*.
4. **How it works inside** — the mental model: a diagram (`text` box drawing or `mermaid`),
   a step-by-step trace (`<Steps>`), or a table of states. Name every intermediate value.
5. **Details & variations** — every parameter, option, flag, value or form. Nothing "etc.".
   If a property has 5 values, explain all 5 with an example each.
6. **Edge cases & gotchas** — `<Callout type="mistake">` for common bugs, with the wrong
   code, why it fails, and the fix.
7. **When to use / when not** — practical guidance, compared with alternatives in a table.
8. **Interview angle** — `<Callout type="interview">` with how the question is usually asked
   and what a strong answer contains; `<QA>` blocks for real questions.

End every chapter with a `## Recap` / `## جمع‌بندی` section using `<Recap>` (5–10 one-line
takeaways a reader can check off).

### API anatomy (every built-in method, function, hook, CSS property, HTML attribute)

Use `<Api name sig returns mutates>` and list **every** parameter as a markdown list inside:
what it is, its type, default, whether optional, what negative/zero/missing values do.
Then a runnable example covering normal use, each parameter, and edge cases.

### Depth rules

- Never introduce a term without defining it (or linking to where it is defined).
- Never leave a table row as the only explanation of a concept: a table *summarises* what the
  prose already taught.
- Never write "and so on", "etc.", "…" for things the reader needs.
- Every code block: comments explain *why*, not just *what*. Expected output in a comment.
- Every claim about output must be verified: run `node .tmp/run-blocks.mjs <files>` and
  `node .tmp/verify-predict.mjs <files>`, then `pnpm check:content`.
- Prefer several short sections over one long one. One idea per paragraph. 2–4 sentences per paragraph.

## 2. Persian (fa) — natural writing, not translation

Write the Persian **as a Persian teacher would explain it in class**, then write English
from the same outline. Do not translate sentence by sentence.

- Keep established English technical terms in Latin script where Iranian developers use
  them: `Closure`, `Promise`, `Event Loop`, `Hoisting`, `Callback`, `Render`, `State`,
  `Component`, `Selector`, `Specificity`. Persian plural suffix attaches with ZWNJ-free
  style already used in the repo: `Promiseها`, `Componentها`.
- Give a Persian gloss the first time a term appears: «**Closure** (بستار؛ تابعی که متغیرهای
  محیط ساخته‌شدنش را به یاد دارد)». After that use the English term.
- Avoid calques and stiff words. Examples of what to change:

  | raw / literal | natural |
  | --- | --- |
  | حافظه داغ | کدی که زیاد اجرا می‌شود (Hot Code) |
  | در حال حاضر | الان / فعلاً (in informal-teaching tone) |
  | به منظور | برای |
  | می‌باشد | است |
  | گردیده است | شده است |
  | مورد استفاده قرار می‌گیرد | استفاده می‌شود |
  | اقدام به ... نمود | ... کرد |
  | در رابطه با | درباره |
  | یک سری | چند / تعدادی |
  | فراخوانی می‌گردد | صدا زده می‌شود |

- Use active voice and direct address («شما»، «فرض کنید»، «حالا ببینیم»).
- Use half-space (ZWNJ, U+200C) correctly: «می‌شود»، «کتاب‌ها»، «پیش‌فرض»، «نمی‌کند».
- Persian digits in prose (۱، ۲، ۳) are fine; inside code, tables of values and
  `inline code` always use Latin digits.
- Punctuation: Persian comma «،», question mark «؟», semicolon «؛». No space before them.
- Code comments inside fa chapters are in Persian, short and natural.

## 3. Components available in MDX

| Component | Use |
| --- | --- |
| ```` ```js run ```` (`sloppy` flag for non-strict) | editable runnable JS, console captured |
| ```` ```js predict ```` + ```` ```output ```` | guess-the-output quiz |
| ```` ```html live ```` | editable HTML/CSS preview |
| ```` ```mermaid ```` | zoomable diagram |
| ```` ```text ```` | box-drawing diagrams (keep columns aligned, LTR) |
| `<Api>` | API anatomy card |
| `<Steps>` + `<Step title="…">` | numbered step-by-step walkthrough / execution trace |
| `<Recap>` + markdown list | end-of-chapter takeaways |
| `<Callout type="note|tip|warning|interview|mistake">` | asides |
| `<QA q="…" level="junior|mid|senior">` with `<Answer>`, `<Deep>`, `<Mistake>`, `<FollowUp>` | interview Q&A |
| `<EventLoopViz>`, `<FlexboxPlayground>`, `<GridPlayground>`, `<PositionPlayground>` | visualizers |

## 4. Parity

`fa` and `en` files share the same slug, same section order and same code examples (only
comments/prose differ). Internal links are locale-free: `[closure](/javascript/scope-closures#…)`.
Each chapter has a one-line `desc` in `src/features/content/registry.ts` shown under the title.
- Step titles must not start with a number — the <Steps> badge already numbers them.
