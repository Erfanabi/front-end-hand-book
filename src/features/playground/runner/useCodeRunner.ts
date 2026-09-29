import { useCallback, useEffect, useRef, useState } from 'react'
import { createWorkerSource, type RunMode } from './workerSource'

export type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug'

export interface LogLine {
  level: LogLevel
  text: string
}

export type RunStatus = 'idle' | 'running' | 'done' | 'timeout'

type WorkerMessage = { type: 'log'; level: LogLevel; text: string } | { type: 'done' }

export const RUN_TIMEOUT_SECONDS = 6

const blobUrl = (code: string) =>
  URL.createObjectURL(new Blob([code], { type: 'text/javascript' }))

/**
 * Runs JavaScript in a throw-away module Worker and collects console output.
 * Each run gets a fresh Worker, so state never leaks between runs and an
 * infinite loop is cut off by `terminate()` instead of freezing the page.
 */
export function useCodeRunner() {
  const [logs, setLogs] = useState<LogLine[]>([])
  const [status, setStatus] = useState<RunStatus>('idle')
  const cleanup = useRef<() => void>(() => {})

  const stop = useCallback(() => {
    cleanup.current()
    cleanup.current = () => {}
  }, [])

  const run = useCallback(
    (code: string, mode: RunMode = 'module') => {
      stop()
      setLogs([])
      setStatus('running')

      const userUrl = blobUrl(code)
      const bootUrl = blobUrl(createWorkerSource(userUrl, mode, code))
      const worker = new Worker(bootUrl, { type: 'module' })

      const finish = (next: RunStatus) => {
        window.clearTimeout(timeout)
        worker.terminate()
        URL.revokeObjectURL(userUrl)
        URL.revokeObjectURL(bootUrl)
        setStatus((current) => (current === 'running' ? next : current))
      }

      const timeout = window.setTimeout(() => finish('timeout'), RUN_TIMEOUT_SECONDS * 1000)

      worker.onmessage = ({ data }: MessageEvent<WorkerMessage>) => {
        if (data.type === 'done') return finish('done')
        setLogs((prev) => [...prev, { level: data.level, text: data.text }])
      }

      worker.onerror = (event) => {
        event.preventDefault()
        setLogs((prev) => [...prev, { level: 'error', text: event.message || 'Error' }])
        finish('done')
      }

      cleanup.current = () => finish('idle')
    },
    [stop],
  )

  useEffect(() => stop, [stop])

  return { logs, status, run, stop }
}
