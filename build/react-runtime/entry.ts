/**
 * Runtime for ```jsx live``` blocks. Bundled once as a classic IIFE script
 * (React *development* build, so StrictMode double-calls and key warnings show
 * up like in a real dev setup) and loaded inside each sandboxed preview iframe.
 *
 * The page compiles the reader's code with sucrase into CommonJS and calls
 * `__reactLive.run(code)`; `require` resolves from the module map below.
 */
import * as React from 'react'
import * as JsxRuntime from 'react/jsx-runtime'
import * as ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'
import * as Zustand from 'zustand'
import * as ZustandMiddleware from 'zustand/middleware'
import * as ReactQuery from '@tanstack/react-query'

const modules: Record<string, unknown> = {
  react: React,
  'react/jsx-runtime': JsxRuntime,
  'react-dom': ReactDOM,
  'react-dom/client': ReactDOMClient,
  zustand: Zustand,
  'zustand/middleware': ZustandMiddleware,
  '@tanstack/react-query': ReactQuery,
}

type Level = 'log' | 'info' | 'warn' | 'error' | 'debug'

const post = (message: Record<string, unknown>) => parent.postMessage({ source: 'react-live', ...message }, '*')

function format(value: unknown, depth = 0): string {
  if (typeof value === 'string') return depth ? JSON.stringify(value) : value
  if (typeof value === 'function') return `ƒ ${value.name || 'anonymous'}()`
  if (typeof value === 'symbol' || typeof value === 'bigint') return String(value)
  if (value instanceof Error) return `${value.name}: ${value.message}`
  if (value === null || typeof value !== 'object') return String(value)
  if (value instanceof Element) return `<${value.tagName.toLowerCase()}>`
  if (depth > 2) return Array.isArray(value) ? '[…]' : '{…}'
  if (Array.isArray(value)) return `[${value.map((v) => format(v, depth + 1)).join(', ')}]`
  if (value instanceof Map) return `Map(${value.size}) {${[...value].map(([k, v]) => `${format(k, depth + 1)} => ${format(v, depth + 1)}`).join(', ')}}`
  if (value instanceof Set) return `Set(${value.size}) {${[...value].map((v) => format(v, depth + 1)).join(', ')}}`
  const entries = Object.entries(value).map(([k, v]) => `${k}: ${format(v, depth + 1)}`)
  return `{ ${entries.join(', ')} }`
}

/** React dev warnings use printf-style `%s`; substitute them so the text reads normally. */
function formatArgs(args: unknown[]) {
  if (typeof args[0] === 'string' && /%[sdoO]/.test(args[0])) {
    const rest = args.slice(1)
    const head = args[0].replace(/%[sdoO]/g, () => (rest.length ? format(rest.shift()) : ''))
    args = [head, ...rest]
  }
  return args.map((a) => format(a)).join(' ')
}

for (const level of ['log', 'info', 'warn', 'error', 'debug'] as Level[]) {
  const original = console[level].bind(console)
  console[level] = (...args: unknown[]) => {
    original(...args)
    post({ type: 'log', level, text: formatArgs(args) })
  }
}
// Demos call console.clear() before a new step so the log shows only that step.
console.clear = () => post({ type: 'clear' })

function showError(error: unknown) {
  const box = document.getElementById('__error') ?? document.body.appendChild(document.createElement('pre'))
  box.id = '__error'
  box.textContent = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
  post({ type: 'log', level: 'error', text: box.textContent })
}

// Let the page size the iframe to its content.
// Measure <body> plus its 14px margins: measuring <html> would never let the frame shrink.
// (Evaluated after the frame's body exists — see ReactLive.tsx.)
const reportHeight = () =>
  post({ type: 'height', value: Math.ceil(document.body.getBoundingClientRect().height) + 28 })
new ResizeObserver(reportHeight).observe(document.body)

addEventListener('error', (e) => showError(e.error ?? e.message))
addEventListener('unhandledrejection', (e) => showError(e.reason))

function run(code: string, { strict = true } = {}) {
  const module = { exports: {} as Record<string, unknown> }
  const require = (name: string) => {
    if (name in modules) return modules[name]
    throw new Error(`Module "${name}" is not available in live demos.`)
  }
  try {
    new Function('require', 'module', 'exports', code)(require, module, module.exports)
  } catch (error) {
    showError(error)
    return
  }
  const App = (module.exports.default ?? module.exports.App) as React.ComponentType | undefined
  if (!App) return // a script-only demo (e.g. just console.log) is fine
  const root = ReactDOMClient.createRoot(document.getElementById('root')!, {
    onUncaughtError: (error) => showError(error),
  })
  const app = React.createElement(App)
  root.render(strict ? React.createElement(React.StrictMode, null, app) : app)
  // Fallback for when ResizeObserver doesn't fire (e.g. the page is in a background tab).
  setTimeout(reportHeight, 100)
}

;(window as unknown as { __reactLive: unknown }).__reactLive = { run }
