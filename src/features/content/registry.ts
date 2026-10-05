import type { Locale } from '@/features/i18n'

/**
 * Table of contents for the whole handbook — the single source of truth for
 * ordering, titles and URLs. Each chapter maps to
 * `src/content/{locale}/{part}/{chapter}.mdx`.
 */
type Localized = Record<Locale, string>

export interface Chapter {
  slug: string
  title: Localized
  /** One-line "what you will learn", shown under the chapter title. */
  desc?: Localized
}

export interface Part {
  id: string
  title: Localized
  summary: Localized
  chapters: Chapter[]
}

const ch = (slug: string, fa: string, en: string): Chapter => ({ slug, title: { fa, en } })

export const parts: Part[] = [
  {
    id: 'html',
    title: { fa: 'HTML', en: 'HTML' },
    summary: {
      fa: 'ساختار سند، Meta Tagها، Semantic HTML، فرم‌ها، Accessibility و بارگذاری منابع.',
      en: 'Document structure, meta tags, semantic HTML, forms, accessibility and resource loading.',
    },
    chapters: [
      ch('fundamentals', 'مبانی HTML و DOM', 'HTML & DOM fundamentals'),
      ch('document-and-meta', 'ساختار سند و Meta Tagها', 'Document structure & meta tags'),
      ch('semantic', 'Semantic HTML', 'Semantic HTML'),
      ch('forms', 'فرم‌ها و Validation', 'Forms & validation'),
      ch('accessibility', 'Accessibility و ARIA', 'Accessibility & ARIA'),
      ch('performance', 'Performance در HTML', 'HTML performance'),
    ],
  },
  {
    id: 'css',
    title: { fa: 'CSS', en: 'CSS' },
    summary: {
      fa: 'Cascade و Specificity، Selectorها، Box Model، Positioning، Flexbox، Grid، Responsive و Rendering.',
      en: 'Cascade and specificity, selectors, box model, positioning, flexbox, grid, responsive design and rendering.',
    },
    chapters: [
      ch('fundamentals', 'Cascade، Specificity و Inheritance', 'Cascade, specificity & inheritance'),
      ch('selectors', 'Selectorها، Pseudo-class و Pseudo-element', 'Selectors, pseudo-classes & pseudo-elements'),
      ch('box-model-display', 'Box Model و Display', 'Box model & display'),
      ch('positioning', 'Positioning و Stacking Context', 'Positioning & stacking context'),
      ch('flexbox', 'Flexbox', 'Flexbox'),
      ch('grid', 'CSS Grid', 'CSS Grid'),
      ch('responsive', 'Responsive، واحدها و CSS Variables', 'Responsive design, units & variables'),
      ch('rendering-performance', 'Performance در CSS', 'CSS performance'),
    ],
  },
  {
    id: 'javascript',
    title: { fa: 'JavaScript', en: 'JavaScript' },
    summary: {
      fa: 'از مبانی زبان تا Engine Internals: TDZ، Lexical Environment، Closure، Prototype، this، Event Loop و Garbage Collection.',
      en: 'From language basics to engine internals: TDZ, lexical environments, closures, prototypes, this, the event loop and garbage collection.',
    },
    chapters: [
      ch('fundamentals', 'JavaScript، ECMAScript، Engine و Runtime', 'JavaScript, ECMAScript, engines & runtimes'),
      ch('variables-tdz', 'var، let، const و TDZ', 'var, let, const & the TDZ'),
      ch('execution-context', 'Execution Context، Lexical Environment و Hoisting', 'Execution context, lexical environment & hoisting'),
      ch('scope-closures', 'Scope و Closure', 'Scope & closures'),
      ch('types-coercion', 'Typeها، Equality و Coercion', 'Types, equality & coercion'),
      ch('objects-prototypes', 'Objectها، Getter/Setter و Prototype', 'Objects, getters/setters & prototypes'),
      ch('classes', 'Classها و OOP در JavaScript', 'Classes & OOP in JavaScript'),
      ch('this-functions', 'Functionها و this', 'Functions & this'),
      ch('arrays', 'Arrayها و متدهای آرایه', 'Arrays & array methods'),
      ch('strings', 'Stringها، Unicode و متدهای رشته', 'Strings, Unicode & string methods'),
      ch('collections', 'Map، Set، WeakMap و WeakRef', 'Map, Set, WeakMap & WeakRef'),
      ch('iterators-generators', 'Symbol، Iterator و Generator', 'Symbols, iterators & generators'),
      ch('proxy-reflect', 'Proxy، Reflect و Metaprogramming', 'Proxy, Reflect & metaprogramming'),
      ch('event-loop', 'Event Loop — بررسی عمیق', 'The event loop — deep dive'),
      ch('async', 'Async JavaScript: Callback، Promise و async/await', 'Async JavaScript: callbacks, promises & async/await'),
      ch('memory-gc', 'Call Stack، Heap و Garbage Collection', 'Call stack, heap & garbage collection'),
      ch('modules', 'ES Modules و CommonJS', 'ES modules & CommonJS'),
      ch('errors', 'Error Handling', 'Error handling'),
    ],
  },
  {
    id: 'typescript',
    title: { fa: 'TypeScript', en: 'TypeScript' },
    summary: {
      fa: 'Type System، Narrowing، Generics، Typeهای پیشرفته (Conditional، Mapped، Template Literal) و TypeScript در React.',
      en: 'The type system, narrowing, generics, advanced types (conditional, mapped, template literal) and TypeScript with React.',
    },
    chapters: [
      ch('fundamentals', 'مبانی TypeScript و Type System', 'TypeScript fundamentals & the type system'),
      ch('narrowing', 'Union، Narrowing و Type Guard', 'Unions, narrowing & type guards'),
      ch('generics', 'Generics', 'Generics'),
      ch('advanced-types', 'Typeهای پیشرفته و Utility Types', 'Advanced types & utility types'),
      ch('react-typescript', 'TypeScript در React', 'TypeScript with React'),
    ],
  },
  {
    id: 'browser',
    title: { fa: 'Browser و Web Platform', en: 'Browser & Web Platform' },
    summary: {
      fa: 'DOM، Eventها، Rendering Pipeline، Storage، HTTP و CORS، WebSocket و امنیت مرورگر.',
      en: 'DOM, events, the rendering pipeline, storage, HTTP & CORS, WebSocket and browser security.',
    },
    chapters: [
      ch('dom', 'DOM', 'The DOM'),
      ch('events', 'Eventها، Propagation و Delegation', 'Events, propagation & delegation'),
      ch('rendering-pipeline', 'Browser Rendering Pipeline', 'The browser rendering pipeline'),
      ch('storage', 'Browser Storage', 'Browser storage'),
      ch('http-fetch', 'HTTP، Fetch و CORS', 'HTTP, fetch & CORS'),
      ch('websocket', 'WebSocket', 'WebSocket'),
      ch('security', 'امنیت مرورگر', 'Browser security'),
    ],
  },
  {
    id: 'react',
    title: { fa: 'React', en: 'React' },
    summary: {
      fa: 'Componentها و Hookها، Rendering و Fiber، State، Effectها، Performance و قابلیت‌های React 19.',
      en: 'Components and hooks, rendering and Fiber, state, effects, performance and React 19 features.',
    },
    chapters: [
      ch('fundamentals', 'مبانی React', 'React fundamentals'),
      ch('hooks', 'Hookها', 'Hooks'),
      ch('rendering', 'Rendering، Reconciliation و Fiber', 'Rendering, reconciliation & Fiber'),
      ch('state', 'مدیریت State', 'State management'),
      ch('effects', 'Effectها', 'Effects'),
      ch('performance', 'Performance در React', 'React performance'),
      ch('advanced', 'Concurrent React، Server Components و SSR', 'Concurrent React, Server Components & SSR'),
      ch('interview-questions', '۵۰ سوال مصاحبه React', '50 React interview questions'),
    ],
  },
  {
    id: 'tooling',
    title: { fa: 'Tooling، Testing و Performance', en: 'Tooling, Testing & Performance' },
    summary: {
      fa: 'Bundlerها و Build Pipeline، تست Unit/Integration/E2E و اندازه‌گیری و بهبود Web Performance و Core Web Vitals.',
      en: 'Bundlers and the build pipeline, unit/integration/E2E testing, and measuring and improving web performance and Core Web Vitals.',
    },
    chapters: [
      ch('build-tools', 'Bundler، Transpiler و Build Pipeline', 'Bundlers, transpilers & the build pipeline'),
      ch('testing', 'تست در Frontend', 'Frontend testing'),
      ch('web-performance', 'Web Performance و Core Web Vitals', 'Web performance & Core Web Vitals'),
    ],
  },
  {
    id: 'algorithms',
    title: { fa: 'الگوریتم‌ها', en: 'Algorithms' },
    summary: {
      fa: 'الگوریتم‌های مخصوص مصاحبه Frontend؛ از Two Sum تا Debounce، LRU Cache و پیاده‌سازی Promise.',
      en: 'Algorithms for frontend interviews, from Two Sum to debounce, an LRU cache and a Promise implementation.',
    },
    chapters: [
      ch('level-1', 'سطح ۱ — مسائل پایه', 'Level 1 — the basics'),
      ch('level-2', 'سطح ۲ — الگوهای حل مسئله', 'Level 2 — problem-solving patterns'),
      ch('level-3', 'سطح ۳ — Utilityهای Frontend', 'Level 3 — frontend utilities'),
    ],
  },
  {
    id: 'patterns',
    title: { fa: 'Design Patterns', en: 'Design Patterns' },
    summary: {
      fa: 'الگوهای Creational، Structural و Behavioral و الگوهای مخصوص Frontend و React.',
      en: 'Creational, structural and behavioral patterns, plus patterns specific to frontend and React.',
    },
    chapters: [
      ch('creational', 'الگوهای Creational', 'Creational patterns'),
      ch('structural', 'الگوهای Structural', 'Structural patterns'),
      ch('behavioral', 'الگوهای Behavioral', 'Behavioral patterns'),
      ch('frontend-patterns', 'الگوهای Frontend و React', 'Frontend & React patterns'),
    ],
  },
  {
    id: 'architecture',
    title: { fa: 'معماری Frontend', en: 'Frontend Architecture' },
    summary: {
      fa: 'ساختار پروژه، Design System، لایه داده، Authentication، Caching، امنیت و Performance در مقیاس.',
      en: 'Project structure, design systems, the data layer, authentication, caching, security and performance at scale.',
    },
    chapters: [
      ch('structure', 'ساختار و Component Architecture', 'Structure & component architecture'),
      ch('data-layer', 'لایه داده، State و Caching', 'Data layer, state & caching'),
      ch('auth-security-performance', 'Auth، امنیت و Performance Architecture', 'Auth, security & performance architecture'),
    ],
  },
  {
    id: 'interview',
    title: { fa: 'سوالات مصاحبه', en: 'Interview Questions' },
    summary: {
      fa: 'سوالات دام‌دار JavaScript و بیش از ۱۰۰ سوال دسته‌بندی‌شده از Junior تا Senior.',
      en: 'JavaScript trick questions and 100+ categorized questions from junior to senior.',
    },
    chapters: [
      ch('trick-questions', 'سوالات دام‌دار JavaScript', 'JavaScript trick questions'),
      ch('senior-questions', 'سوالات مصاحبه Senior', 'Senior interview questions'),
    ],
  },
  {
    id: 'cheatsheet',
    title: { fa: 'مرور سریع', en: 'Rapid Revision' },
    summary: {
      fa: 'Cheat Sheet نهایی و ۱۰۰ سوال ضروری برای مرور در شب قبل از مصاحبه.',
      en: 'The final cheat sheet and 100 must-know questions to review the night before.',
    },
    chapters: [
      ch('rapid-revision', 'Ultimate Frontend Cheat Sheet', 'Ultimate frontend cheat sheet'),
      ch('must-know', '۱۰۰ سوال ضروری', '100 must-know questions'),
    ],
  },
]

/** Chapter descriptions, keyed by `part/slug`. Kept apart so the outline above stays scannable. */
const descriptions: Record<string, Localized> = {
  'html/fundamentals': {
    fa: 'HTML چیست، مرورگر چطور آن را به DOM تبدیل می‌کند، Element و Attribute و Nesting و تفاوت HTML با DOM.',
    en: 'What HTML is, how the browser turns it into the DOM, elements, attributes, nesting and how HTML differs from the DOM.',
  },
  'html/document-and-meta': {
    fa: 'اسکلت یک سند HTML، Doctype، بخش head، Meta Tagهای ضروری، SEO و Open Graph.',
    en: 'The skeleton of an HTML document: doctype, the head, essential meta tags, SEO and Open Graph.',
  },
  'html/semantic': {
    fa: 'چرا تگ درست مهم است؛ Landmarkها، ساختار Heading، و انتخاب بین div و تگ‌های معنایی.',
    en: 'Why the right tag matters: landmarks, heading structure and choosing between div and semantic elements.',
  },
  'html/forms': {
    fa: 'ساختن فرم از صفر: input و انواعش، label، Validation داخلی مرورگر، FormData و ارسال فرم.',
    en: 'Building forms from scratch: inputs and their types, labels, built-in validation, FormData and submission.',
  },
  'html/accessibility': {
    fa: 'Accessibility یعنی چه، Screen Reader صفحه را چطور می‌خواند، کیبورد، Focus و قواعد ARIA.',
    en: 'What accessibility means, how screen readers read a page, keyboard support, focus and the rules of ARIA.',
  },
  'html/performance': {
    fa: 'مرورگر منابع را چطور بارگذاری می‌کند؛ async و defer، preload، Lazy Loading و تصاویر Responsive.',
    en: 'How the browser loads resources: async and defer, preload, lazy loading and responsive images.',
  },
  'css/fundamentals': {
    fa: 'وقتی چند قانون با هم رقابت می‌کنند کدام برنده است؛ Cascade، Specificity، Inheritance و Cascade Layers.',
    en: 'Which rule wins when several compete: the cascade, specificity, inheritance and cascade layers.',
  },
  'css/selectors': {
    fa: 'همه نوع Selector از ساده تا :has()؛ Combinatorها، Pseudo-classها و Pseudo-elementها با مثال.',
    en: 'Every kind of selector up to :has(): combinators, pseudo-classes and pseudo-elements, with examples.',
  },
  'css/box-model-display': {
    fa: 'هر عنصر یک جعبه است؛ content، padding، border، margin، box-sizing، Margin Collapse و مقادیر display.',
    en: 'Every element is a box: content, padding, border, margin, box-sizing, margin collapse and display values.',
  },
  'css/positioning': {
    fa: 'static، relative، absolute، fixed و sticky قدم به قدم؛ Containing Block، z-index و Stacking Context.',
    en: 'static, relative, absolute, fixed and sticky step by step; containing blocks, z-index and stacking contexts.',
  },
  'css/flexbox': {
    fa: 'چیدمان یک‌بعدی با Flexbox؛ محور اصلی و فرعی، همه Propertyهای Container و Item و فرمول flex.',
    en: 'One-dimensional layout with flexbox: main and cross axes, every container and item property, and the flex formula.',
  },
  'css/grid': {
    fa: 'چیدمان دوبعدی با Grid؛ Track و Line و Area، واحد fr، repeat و minmax و Auto Placement.',
    en: 'Two-dimensional layout with grid: tracks, lines and areas, the fr unit, repeat, minmax and auto-placement.',
  },
  'css/responsive': {
    fa: 'طراحی برای هر اندازه صفحه؛ واحدها، Media Query، Container Query، clamp و CSS Variables.',
    en: 'Designing for every screen: units, media queries, container queries, clamp() and CSS variables.',
  },
  'css/rendering-performance': {
    fa: 'هزینه هر تغییر CSS؛ Reflow و Repaint و Composite، انیمیشن روان، will-change و contain.',
    en: 'What each CSS change costs: reflow, repaint and composite, smooth animation, will-change and contain.',
  },
}

for (const part of parts) {
  for (const chapter of part.chapters) chapter.desc ??= descriptions[`${part.id}/${chapter.slug}`]
}

export interface ChapterRef {
  part: Part
  partIndex: number
  chapter: Chapter
  key: string
}

/** Flat, ordered list — drives prev/next navigation and progress. */
export const allChapters: ChapterRef[] = parts.flatMap((part, partIndex) =>
  part.chapters.map((chapter) => ({ part, partIndex, chapter, key: `${part.id}/${chapter.slug}` })),
)

export const findChapter = (partId?: string, slug?: string) =>
  allChapters.findIndex((c) => c.part.id === partId && c.chapter.slug === slug)

export const chapterPath = (locale: Locale, ref: Pick<ChapterRef, 'part' | 'chapter'>) =>
  `/${locale}/${ref.part.id}/${ref.chapter.slug}`
