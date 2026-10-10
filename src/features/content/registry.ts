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
      ch('react-19', 'React 19 و نسخه‌های بعدی', 'React 19 and beyond'),
      ch('patterns', 'الگوهای کامپوننت در React', 'React component patterns'),
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
  'javascript/fundamentals': {
    fa: 'JavaScript دقیقاً چیست، ECMAScript چه نقشی دارد، Engine کد را چطور اجرا می‌کند و Runtime چه چیزی اضافه می‌کند.',
    en: 'What JavaScript really is, what ECMAScript is, how an engine runs your code and what a runtime adds.',
  },
  'javascript/variables-tdz': {
    fa: 'تفاوت واقعی var و let و const، Block Scope، Temporal Dead Zone و اینکه const دقیقاً چه چیزی را ثابت می‌کند.',
    en: 'The real differences between var, let and const, block scope, the temporal dead zone and what const actually freezes.',
  },
  'javascript/execution-context': {
    fa: 'موتور قبل از اجرای کد شما چه کار می‌کند؛ Execution Context، Lexical Environment و Hoisting.',
    en: 'What the engine does before running your code: execution contexts, lexical environments and hoisting.',
  },
  'javascript/scope-closures': {
    fa: 'هر متغیر کجا دیده می‌شود و چرا یک تابع متغیرهای بیرونش را به یاد می‌آورد؛ Scope Chain و Closure.',
    en: 'Where each variable is visible and why a function remembers its outer variables: the scope chain and closures.',
  },
  'javascript/types-coercion': {
    fa: 'هشت Type زبان، Primitive در برابر Reference، تبدیل نوع ضمنی و قواعد دقیق == و ===.',
    en: 'The eight types, primitives vs references, implicit conversion and the exact rules of == and ===.',
  },
  'javascript/objects-prototypes': {
    fa: 'Object از صفر: Property، Descriptor، Getter و Setter، کپی کردن، و زنجیره Prototype.',
    en: 'Objects from scratch: properties, descriptors, getters and setters, copying, and the prototype chain.',
  },
  'javascript/classes': {
    fa: 'class در JavaScript پشت صحنه چیست؛ constructor، ارث‌بری، super، فیلدهای خصوصی و static.',
    en: 'What a JavaScript class is under the hood: constructors, inheritance, super, private fields and static members.',
  },
  'javascript/this-functions': {
    fa: 'روش‌های تعریف تابع، پارامترها، Arrow Function و چهار قانون تعیین مقدار this؛ call و apply و bind.',
    en: 'Ways to define functions, parameters, arrow functions and the four rules that decide this; call, apply and bind.',
  },
  'javascript/arrays': {
    fa: 'همه متدهای آرایه با پارامترها و خروجی؛ کدام آرایه را تغییر می‌دهد، map و filter و reduce و sort.',
    en: 'Every array method with its parameters and return value: which ones mutate, map, filter, reduce and sort.',
  },
  'javascript/strings': {
    fa: 'رشته‌ها و Unicode، Template Literal و همه متدهای پرکاربرد رشته با مثال.',
    en: 'Strings and Unicode, template literals and every commonly used string method, with examples.',
  },
  'javascript/collections': {
    fa: 'Map و Set در برابر Object و Array؛ WeakMap، WeakSet و WeakRef و نقششان در مدیریت حافظه.',
    en: 'Map and Set vs objects and arrays; WeakMap, WeakSet and WeakRef and how they help with memory.',
  },
  'javascript/iterators-generators': {
    fa: 'Symbol چیست، پروتکل Iterator، for...of از درون، و Generatorها با yield.',
    en: 'What symbols are, the iterator protocol, for...of from the inside, and generators with yield.',
  },
  'javascript/proxy-reflect': {
    fa: 'رهگیری عملیات روی Object با Proxy، همه Trapها، Reflect و کاربردهای واقعی مثل Validation و Reactivity.',
    en: 'Intercepting object operations with Proxy, every trap, Reflect and real uses such as validation and reactivity.',
  },
  'javascript/event-loop': {
    fa: 'JavaScript تک‌نخی چطور چند کار را هم‌زمان مدیریت می‌کند؛ Call Stack، Task و Microtask و Rendering.',
    en: 'How single-threaded JavaScript handles concurrent work: the call stack, tasks, microtasks and rendering.',
  },
  'javascript/async': {
    fa: 'از Callback تا Promise و async/await؛ حالت‌های Promise، زنجیره then، مدیریت خطا و ترکیب Promiseها.',
    en: 'From callbacks to promises and async/await: promise states, then-chains, error handling and combinators.',
  },
  'javascript/memory-gc': {
    fa: 'داده‌ها کجا ذخیره می‌شوند، Garbage Collector چطور حافظه را آزاد می‌کند و Memory Leak از کجا می‌آید.',
    en: 'Where data lives, how the garbage collector frees memory and where memory leaks come from.',
  },
  'javascript/modules': {
    fa: 'چرا ماژول لازم داریم؛ import و export، Live Binding، Dynamic Import و تفاوت ES Modules با CommonJS.',
    en: 'Why we need modules: import and export, live bindings, dynamic import and ES modules vs CommonJS.',
  },
  'javascript/errors': {
    fa: 'انواع خطا، try/catch/finally، ساختن Error سفارشی، خطا در کد Async و مدیریت خطای سراسری.',
    en: 'Error types, try/catch/finally, custom errors, errors in async code and global error handling.',
  },
  'typescript/fundamentals': {
    fa: 'TypeScript چه مشکلی را حل می‌کند، Typeهای پایه، Type Inference، interface و type و تنظیمات tsconfig.',
    en: 'What problem TypeScript solves, basic types, type inference, interface vs type and tsconfig settings.',
  },
  'typescript/narrowing': {
    fa: 'کار با Union بدون خطا؛ typeof، in، instanceof، Discriminated Union، بررسی never، Type Predicate و Assertion Function.',
    en: 'Working with unions safely: typeof, in, instanceof, discriminated unions, never checks, type predicates and assertion functions.',
  },
  'typescript/generics': {
    fa: 'پارامتر نوع از صفر: استنتاج T، Constraint با extends، keyof و T[K]، Interface و کلاس جنریک و دام‌های رایج.',
    en: 'Type parameters from scratch: inferring T, constraints with extends, keyof and T[K], generic interfaces and classes, and common traps.',
  },
  'typescript/advanced-types': {
    fa: 'ساختن Type از روی Type؛ keyof و typeof، همه Utility Typeها، Mapped و Conditional Type، infer، Template Literal و Branded Type.',
    en: 'Building types from types: keyof and typeof, every utility type, mapped and conditional types, infer, template literals and branded types.',
  },
  'typescript/react-typescript': {
    fa: 'Props و children، useState و useRef، Type رویدادها، useReducer و Context، ComponentProps، Component جنریک و ref در React 19.',
    en: 'Props and children, useState and useRef, event types, useReducer and context, ComponentProps, generic components and ref in React 19.',
  },
  'browser/dom': {
    fa: 'Node و سلسله‌مراتب کلاس‌ها، querySelector و مجموعه‌های زنده، textContent در برابر innerHTML، ساختن و جابه‌جایی Element، Layout Thrashing، اندازه‌گیری و Observerها.',
    en: 'Nodes and the class hierarchy, querySelector and live collections, textContent vs innerHTML, creating and moving elements, layout thrashing, measuring and observers.',
  },
  'browser/events': {
    fa: 'addEventListener و Optionهایش، Event Object، فازهای Capture و Bubble، stopPropagation و preventDefault، Event Delegation، CustomEvent و ترتیب Microtaskها.',
    en: 'addEventListener and its options, the event object, capture and bubble phases, stopPropagation and preventDefault, delegation, CustomEvent and microtask ordering.',
  },
  'browser/rendering-pipeline': {
    fa: 'از URL تا پیکسل: Navigation، Processها و Threadها، Parse، Style، Layout، Paint، لایه‌ها، Raster و Composite، زندگی یک Frame و Long Taskها.',
    en: 'From URL to pixels: navigation, processes and threads, parsing, style, layout, paint, layers, raster and composite, the life of a frame and long tasks.',
  },
  'browser/storage': {
    fa: 'Origin و پارتیشن‌بندی، localStorage و sessionStorage، Event storage، Cookie و Attributeهایش، IndexedDB و Transactionها، Cache API، سهمیه و انتخاب انبار درست.',
    en: 'Origins and partitioning, localStorage and sessionStorage, the storage event, cookies and their attributes, IndexedDB and transactions, the Cache API, quotas and choosing a store.',
  },
  'browser/http-fetch': {
    fa: 'ساختار HTTP، Methodها و Status Codeها، نسخه‌های HTTP، fetch و Response، مدیریت خطا، لغو و Timeout، HTTP Cache و CORS با Preflight.',
    en: 'HTTP messages, methods and status codes, HTTP versions, fetch and Response, error handling, cancel and timeouts, the HTTP cache, and CORS with preflight.',
  },
  'browser/websocket': {
    fa: 'Polling در برابر SSE در برابر WebSocket، Handshake و فریم‌ها، API و کدهای بسته شدن، طراحی پیام، اتصال دوباره با Backoff، Heartbeat، احراز هویت و EventSource.',
    en: 'Polling vs SSE vs WebSocket, the handshake and frames, the API and close codes, message design, reconnecting with backoff, heartbeats, authentication and EventSource.',
  },
  'browser/security': {
    fa: 'Origin و Site، انواع XSS و Sinkهای خطرناک، Escape و اعتبارسنجی URL، CSP و Trusted Types، CSRF، Clickjacking، HSTS، Headerهای امنیتی و کد Third-party.',
    en: 'Origins and sites, XSS types and dangerous sinks, escaping and URL validation, CSP and Trusted Types, CSRF, clickjacking, HSTS, security headers and third-party code.',
  },
  'react/fundamentals': {
    fa: 'UI = f(state)، createRoot، JSX و Elementها، Componentها و props، Render شرطی، لیست و key، Eventها، useState و Snapshot، Immutability، خالص بودن و StrictMode.',
    en: 'UI = f(state), createRoot, JSX and elements, components and props, conditional rendering, lists and keys, events, useState and snapshots, immutability, purity and StrictMode.',
  },
  'react/hooks': {
    fa: 'قوانین Hookها و دلیلشان، useState با جزئیات، useReducer، useRef و Ref Callbackها، useImperativeHandle، useContext، useId، useSyncExternalStore و Custom Hookها.',
    en: 'The rules of hooks and why, useState in depth, useReducer, useRef and ref callbacks, useImperativeHandle, useContext, useId, useSyncExternalStore and custom hooks.',
  },
  'react/rendering': {
    fa: 'Trigger، Render و Commit، ترتیب Refها و Effectها، چه چیزی Re-render می‌کند، Bailout و ترفند children، Batching و flushSync، Virtual DOM، Reconciliation، Fiber، Work Loop و Laneها.',
    en: 'Trigger, render and commit, the order of refs and effects, what causes a re-render, bailouts and the children trick, batching and flushSync, the virtual DOM, reconciliation, Fiber, the work loop and lanes.',
  },
  'react/state': {
    fa: 'انواع State و جای هر کدام، ساختار دادن به State، Lifting State Up، Reducer + Context، Zustand (Selectorها، useShallow، Middleware)، TanStack Query (staleTime، gcTime، Mutation، Optimistic) و URL State.',
    en: 'Kinds of state and where each lives, structuring state, lifting state up, reducer + context, Zustand (selectors, useShallow, middleware), TanStack Query (staleTime, gcTime, mutations, optimistic updates) and URL state.',
  },
  'react/effects': {
    fa: 'Effect برای همگام‌سازی با سیستم‌های بیرونی، useEffect و سه شکل Dependency، Cleanup، اجرای دوباره در StrictMode، useLayoutEffect و useInsertionEffect، Stale Closure، useEffectEvent، Race Condition در Fetch و جاهایی که Effect لازم نیست.',
    en: "Effects as synchronization with external systems, useEffect and its three dependency forms, cleanup, the StrictMode double run, useLayoutEffect and useInsertionEffect, stale closures, useEffectEvent, fetch race conditions, and when you don't need an Effect.",
  },
  'react/performance': {
    fa: 'اندازه‌گیری با Profiler، پایین بردن State و ترفند children، memo، useMemo و useCallback، React Compiler، Context و Performance، Virtualization، Code Splitting با lazy و Activity.',
    en: 'Measuring with the Profiler, moving state down and the children trick, memo, useMemo and useCallback, React Compiler, context performance, virtualization, code splitting with lazy, and Activity.',
  },
  'react/react-19': {
    fa: 'Actionها و Transitionهای Async، useActionState، Actionهای فرم و useFormStatus، useOptimistic، use، ref به‌عنوان prop و Ref روی Fragment، Metadata سند، خطاهای بهتر، تازه‌های 19.1 تا 19.3 و ViewTransition.',
    en: 'Actions and async transitions, useActionState, form actions and useFormStatus, useOptimistic, use, ref as a prop and Fragment refs, document metadata, better errors, what 19.1–19.3 added, and ViewTransition.',
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
