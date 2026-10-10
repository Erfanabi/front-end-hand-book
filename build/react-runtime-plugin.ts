import { fileURLToPath, URL } from 'node:url'
import { build, normalizePath, type Plugin } from 'vite'

/** Served (dev) and emitted (build) at this path; see `build/react-runtime/entry.ts`. */
export const REACT_RUNTIME_FILE = 'react-runtime.js'

const entry = fileURLToPath(new URL('./react-runtime/entry.ts', import.meta.url))

async function bundle(): Promise<string> {
  const result = await build({
    configFile: false,
    logLevel: 'error', // libraries' "use client" directives are irrelevant here
    // Development React on purpose: StrictMode double-calls and dev warnings are part of the lessons.
    define: { 'process.env.NODE_ENV': '"development"' },
    build: {
      write: false,
      minify: true,
      lib: { entry, formats: ['iife'], name: '__reactLiveBundle', fileName: () => REACT_RUNTIME_FILE },
    },
  })
  const output = (Array.isArray(result) ? result[0] : result) as { output: { type: string; code?: string }[] }
  return output.output.find((o) => o.type === 'chunk')!.code!
}

/** Builds the classic-script runtime that sandboxed ```jsx live``` iframes load. */
export function reactRuntimePlugin(): Plugin {
  let cached: Promise<string> | undefined
  const get = () => (cached ??= bundle())

  return {
    name: 'react-live-runtime',
    configureServer(server) {
      server.watcher.add(entry)
      server.watcher.on('change', (file) => {
        if (normalizePath(file) === normalizePath(entry)) cached = undefined
      })
      server.middlewares.use(`/${REACT_RUNTIME_FILE}`, (_req, res) => {
        get().then(
          (code) => {
            res.setHeader('Content-Type', 'text/javascript')
            res.end(code)
          },
          (error) => {
            res.statusCode = 500
            res.end(String(error))
          },
        )
      })
    },
    async generateBundle() {
      this.emitFile({ type: 'asset', fileName: REACT_RUNTIME_FILE, source: await get() })
    },
  }
}
