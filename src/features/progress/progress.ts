import { useCallback, useSyncExternalStore } from 'react'
import { createPersistentStore } from '@/shared/lib/createStore'

/** Read chapters are stored by language-independent key (`part/chapter`). */
const store = createPersistentStore<string[]>('progress', [])

export function useProgress() {
  const read = useSyncExternalStore(store.subscribe, store.get)

  const isRead = useCallback((key: string) => read.includes(key), [read])

  const toggle = useCallback((key: string) => {
    const current = store.get()
    store.set(current.includes(key) ? current.filter((k) => k !== key) : [...current, key])
  }, [])

  return { read, isRead, toggle }
}
