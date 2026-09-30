import type { Locale } from '@/features/i18n'

export interface Step {
  /** 0-based line of `code` being executed, or null when the engine is between tasks. */
  line: number | null
  stack: string[]
  webApis: string[]
  micro: string[]
  tasks: string[]
  console: string[]
  note: Record<Locale, string>
}

export interface Scenario {
  code: string
  steps: Step[]
}

const s = (
  line: number | null,
  stack: string[],
  webApis: string[],
  micro: string[],
  tasks: string[],
  output: string[],
  fa: string,
  en: string,
): Step => ({ line, stack, webApis, micro, tasks, console: output, note: { fa, en } })

export const scenarios: Record<string, Scenario> = {
  basic: {
    code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`,
    steps: [
      s(0, ['global()', 'console.log("A")'], [], [], [], ['A'],
        'Global Execution Context روی Call Stack قرار می‌گیرد و اولین خط به‌صورت Synchronous اجرا می‌شود. A چاپ می‌شود.',
        'The global execution context is pushed onto the call stack and the first line runs synchronously. A is printed.'),
      s(1, ['global()', 'setTimeout(cb, 0)'], ['timer 0ms → cbB'], [], [], ['A'],
        'setTimeout خودش فقط Callback را به Timer مرورگر (Web API) می‌سپارد و فوراً برمی‌گردد. Callback هنوز اجرا نمی‌شود.',
        'setTimeout only hands the callback to the browser timer (a Web API) and returns immediately. The callback does not run yet.'),
      s(1, ['global()'], [], [], ['cbB'], ['A'],
        'Timer با تأخیر 0 تمام شده و cbB به Task Queue رفته است. اما تا وقتی Call Stack خالی نشود، هیچ Task‌ای اجرا نمی‌شود.',
        'The 0 ms timer has expired and cbB moves to the task queue. No task can run until the call stack is empty.'),
      s(2, ['global()', 'Promise.then(cbC)'], [], ['cbC'], ['cbB'], ['A'],
        'Promise از قبل resolve شده است، پس then فوراً cbC را در Microtask Queue قرار می‌دهد.',
        'The promise is already resolved, so then() immediately puts cbC in the microtask queue.'),
      s(3, ['global()', 'console.log("D")'], [], ['cbC'], ['cbB'], ['A', 'D'],
        'کد Synchronous ادامه پیدا می‌کند و D چاپ می‌شود.',
        'Synchronous code keeps running and D is printed.'),
      s(null, [], [], ['cbC'], ['cbB'], ['A', 'D'],
        'اسکریپت تمام شد و Global Context از Stack خارج شد. حالا Event Loop قبل از هر Task، کل Microtask Queue را خالی می‌کند.',
        'The script finished and the global context is popped. Before any task, the event loop drains the entire microtask queue.'),
      s(2, ['cbC()'], [], [], ['cbB'], ['A', 'D', 'C'],
        'cbC از Microtask Queue وارد Call Stack می‌شود و C چاپ می‌شود.',
        'cbC moves from the microtask queue to the call stack and C is printed.'),
      s(null, [], [], [], ['cbB'], ['A', 'D', 'C'],
        'Microtask Queue خالی است. مرورگر می‌تواند Render انجام دهد و سپس Event Loop قدیمی‌ترین Task را برمی‌دارد.',
        'The microtask queue is empty. The browser may render, then the event loop takes the oldest task.'),
      s(1, ['cbB()'], [], [], [], ['A', 'D', 'C', 'B'],
        'cbB اجرا می‌شود و B چاپ می‌شود. ترتیب نهایی: A, D, C, B.',
        'cbB runs and B is printed. Final order: A, D, C, B.'),
    ],
  },

  'async-await': {
    code: `async function run() {
  console.log("1");
  await null;
  console.log("2");
}
console.log("start");
run();
Promise.resolve().then(() => console.log("3"));
console.log("end");`,
    steps: [
      s(5, ['global()', 'console.log("start")'], [], [], [], ['start'],
        'اعلان run در Creation Phase ثبت شده است؛ اولین خط اجرایی start را چاپ می‌کند.',
        'run was registered during the creation phase; the first executed line prints start.'),
      s(1, ['global()', 'run()'], [], [], [], ['start', '1'],
        'فراخوانی یک async function تا رسیدن به اولین await کاملاً Synchronous است. پس 1 فوراً چاپ می‌شود.',
        'Calling an async function is fully synchronous until the first await, so 1 is printed immediately.'),
      s(2, ['global()'], [], ['resume run'], [], ['start', '1'],
        'await null اجرای run را معلق می‌کند و ادامه تابع (Continuation) را به‌صورت Microtask زمان‌بندی می‌کند. run یک Promise در حالت pending برمی‌گرداند.',
        'await null suspends run and schedules the rest of the function (its continuation) as a microtask. run returns a pending promise.'),
      s(7, ['global()', 'Promise.then(cb3)'], [], ['resume run', 'cb3'], [], ['start', '1'],
        'cb3 پشت سر continuation تابع run در Microtask Queue قرار می‌گیرد. صف FIFO است.',
        'cb3 is queued behind run’s continuation. The microtask queue is FIFO.'),
      s(8, ['global()', 'console.log("end")'], [], ['resume run', 'cb3'], [], ['start', '1', 'end'],
        'آخرین خط Synchronous: end.',
        'Last synchronous line: end.'),
      s(3, ['run() (resumed)'], [], ['cb3'], [], ['start', '1', 'end', '2'],
        'Stack خالی شد؛ اولین Microtask یعنی ادامه run اجرا می‌شود و 2 چاپ می‌شود.',
        'The stack is empty; the first microtask, run’s continuation, prints 2.'),
      s(7, ['cb3()'], [], [], [], ['start', '1', 'end', '2', '3'],
        'سپس cb3 اجرا می‌شود. خروجی: start, 1, end, 2, 3.',
        'Then cb3 runs. Output: start, 1, end, 2, 3.'),
    ],
  },

  nested: {
    code: `setTimeout(() => {
  console.log("T1");
  Promise.resolve().then(() => console.log("M-in-T1"));
}, 0);
setTimeout(() => console.log("T2"), 0);
Promise.resolve().then(() => {
  console.log("M1");
  setTimeout(() => console.log("T3"), 0);
});`,
    steps: [
      s(0, ['global()'], [], [], ['T1 cb'], [],
        'اولین Timer ثبت می‌شود و پس از اتمام، Callback آن در Task Queue قرار می‌گیرد.',
        'The first timer is registered and, once it expires, its callback is in the task queue.'),
      s(4, ['global()'], [], [], ['T1 cb', 'T2 cb'], [],
        'دومین Timer پشت سر اولی در Task Queue قرار می‌گیرد.',
        'The second timer callback queues behind the first.'),
      s(5, ['global()'], [], ['M1 cb'], ['T1 cb', 'T2 cb'], [],
        'Callback مربوط به Promise وارد Microtask Queue می‌شود.',
        'The promise callback enters the microtask queue.'),
      s(6, ['M1 cb()'], [], [], ['T1 cb', 'T2 cb', 'T3 cb'], ['M1'],
        'اسکریپت تمام شد؛ Microtaskها اول اجرا می‌شوند. M1 چاپ می‌شود و Timer سوم ثبت می‌شود؛ T3 انتهای Task Queue قرار می‌گیرد.',
        'The script is done; microtasks run first. M1 prints and a third timer is registered, so T3 goes to the end of the task queue.'),
      s(1, ['T1 cb()'], [], ['M-in-T1 cb'], ['T2 cb', 'T3 cb'], ['M1', 'T1'],
        'Event Loop یک Task برمی‌دارد: T1. داخل آن یک Microtask جدید ساخته می‌شود.',
        'The event loop takes one task: T1. It creates a new microtask.'),
      s(2, ['M-in-T1 cb()'], [], [], ['T2 cb', 'T3 cb'], ['M1', 'T1', 'M-in-T1'],
        'نکته کلیدی: بعد از «هر» Task، کل Microtask Queue خالی می‌شود — پس M-in-T1 قبل از T2 اجرا می‌شود.',
        'Key point: after every single task the whole microtask queue is drained — so M-in-T1 runs before T2.'),
      s(4, ['T2 cb()'], [], [], ['T3 cb'], ['M1', 'T1', 'M-in-T1', 'T2'],
        'Task بعدی: T2.',
        'Next task: T2.'),
      s(7, ['T3 cb()'], [], [], [], ['M1', 'T1', 'M-in-T1', 'T2', 'T3'],
        'آخرین Task: T3. خروجی نهایی: M1, T1, M-in-T1, T2, T3.',
        'Last task: T3. Final output: M1, T1, M-in-T1, T2, T3.'),
    ],
  },
}
