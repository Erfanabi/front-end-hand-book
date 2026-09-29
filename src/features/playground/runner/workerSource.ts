/**
 * Bootstrap code executed inside a dedicated module Worker.
 *
 * - patches `console.*` to post formatted lines back to the page
 * - tracks pending timers so the page knows when the program has gone idle
 * - imports the user's code from a separate Blob URL, so syntax errors and
 *   top-level exceptions are reported with the right message
 *
 * Runs in a Worker: no DOM access, and the page can terminate it at any time.
 */
export type RunMode = 'module' | 'sloppy'

export function createWorkerSource(userCodeUrl: string, mode: RunMode, code: string) {
  // Sloppy mode: indirect eval runs the code as non-strict global code, so
  // top-level `var` becomes a global property and plain calls get `this === globalThis`.
  const start =
    mode === 'sloppy'
      ? `Promise.resolve().then(() => (0, eval)(${JSON.stringify(code)}))`
      : `import(${JSON.stringify(userCodeUrl)})`
  return `
const post = (type, payload = {}) => self.postMessage({ type, ...payload })

function format(value, depth = 0, seen = new WeakSet()) {
  const type = typeof value
  if (value === null) return 'null'
  if (type === 'undefined') return 'undefined'
  if (type === 'string') return depth === 0 ? value : "'" + value + "'"
  if (type === 'number') return Object.is(value, -0) ? '-0' : String(value)
  if (type === 'bigint') return value + 'n'
  if (type === 'boolean') return String(value)
  if (type === 'symbol') return value.toString()
  if (type === 'function') {
    const src = Function.prototype.toString.call(value)
    if (src.startsWith('class')) return '[class ' + (value.name || '(anonymous)') + ']'
    return '[Function: ' + (value.name || '(anonymous)') + ']'
  }
  if (seen.has(value)) return '[Circular]'
  if (value instanceof Error) return value.name + ': ' + value.message
  if (value instanceof Date) return value.toISOString()
  if (value instanceof RegExp) return String(value)
  if (value instanceof Promise) return 'Promise {}'
  if (value instanceof WeakMap) return 'WeakMap { <items unknown> }'
  if (value instanceof WeakSet) return 'WeakSet { <items unknown> }'
  if (depth > 2) return Array.isArray(value) ? '[Array]' : '[Object]'
  seen.add(value)
  const inner = (v) => format(v, depth + 1, seen)
  let out
  if (Array.isArray(value)) {
    const items = []
    for (let i = 0; i < value.length; i++) items.push(i in value ? inner(value[i]) : '<empty>')
    out = '[' + items.join(', ') + ']'
  } else if (value instanceof Map) {
    const items = [...value].map(([k, v]) => inner(k) + ' => ' + inner(v))
    out = 'Map(' + value.size + ') {' + (items.length ? ' ' + items.join(', ') + ' ' : '') + '}'
  } else if (value instanceof Set) {
    const items = [...value].map(inner)
    out = 'Set(' + value.size + ') {' + (items.length ? ' ' + items.join(', ') + ' ' : '') + '}'
  } else {
    const keys = Reflect.ownKeys(value).filter((k) => Object.getOwnPropertyDescriptor(value, k)?.enumerable)
    const items = keys.map((k) => {
      const d = Object.getOwnPropertyDescriptor(value, k)
      const name = typeof k === 'symbol' ? '[' + k.toString() + ']' : /^[A-Za-z_$][\\w$]*$/.test(k) ? k : "'" + k + "'"
      if (d.get || d.set) return name + ': [Getter' + (d.set ? '/Setter' : '') + ']'
      return name + ': ' + inner(d.value)
    })
    const proto = Object.getPrototypeOf(value)
    const ctor = proto && proto !== Object.prototype && proto.constructor ? proto.constructor.name + ' ' : proto === null ? '[Object: null prototype] ' : ''
    out = ctor + (items.length ? '{ ' + items.join(', ') + ' }' : '{}')
  }
  seen.delete(value)
  return out
}

for (const level of ['log', 'info', 'warn', 'error', 'debug', 'table', 'dir']) {
  console[level] = (...args) => {
    const kind = level === 'table' || level === 'dir' ? 'log' : level
    post('log', { level: kind, text: args.map((a) => format(a)).join(' ') })
  }
}

const errorText = (e) => (e && e.name && e.message !== undefined ? e.name + ': ' + e.message : format(e, 1))

self.addEventListener('error', (event) => {
  event.preventDefault()
  post('log', { level: 'error', text: 'Uncaught ' + errorText(event.error ?? event.message) })
})

self.addEventListener('unhandledrejection', (event) => {
  event.preventDefault()
  post('log', { level: 'error', text: 'Uncaught (in promise) ' + errorText(event.reason) })
})

// Count pending timers so we can report when the program is idle.
const timers = new Set()
const nativeSetTimeout = self.setTimeout.bind(self)
const nativeClearTimeout = self.clearTimeout.bind(self)
const nativeSetInterval = self.setInterval.bind(self)
const nativeClearInterval = self.clearInterval.bind(self)

self.setTimeout = (fn, ms, ...args) => {
  const id = nativeSetTimeout(() => {
    timers.delete(id)
    typeof fn === 'function' ? fn(...args) : (0, eval)(fn)
  }, ms)
  timers.add(id)
  return id
}
self.clearTimeout = (id) => { timers.delete(id); nativeClearTimeout(id) }
self.setInterval = (fn, ms, ...args) => {
  const id = nativeSetInterval(fn, ms, ...args)
  timers.add(id)
  return id
}
self.clearInterval = (id) => { timers.delete(id); nativeClearInterval(id) }

let idleChecks = 0
function waitForIdle() {
  nativeSetTimeout(() => {
    idleChecks = timers.size === 0 ? idleChecks + 1 : 0
    idleChecks >= 3 ? post('done') : waitForIdle()
  }, 40)
}

${start}
  .catch((error) => post('log', { level: 'error', text: 'Uncaught ' + errorText(error) }))
  .finally(waitForIdle)
`
}
