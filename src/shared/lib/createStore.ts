/**
 * Minimal external store backed by localStorage, consumed with
 * `useSyncExternalStore`. Also syncs across browser tabs.
 */
export function createPersistentStore<T>(key: string, fallback: T) {
  const listeners = new Set<() => void>()
  let state: T = read()

  function read(): T {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : fallback
    } catch {
      return fallback
    }
  }

  window.addEventListener('storage', (event) => {
    if (event.key !== key) return
    state = read()
    listeners.forEach((listener) => listener())
  })

  return {
    get: () => state,
    set(next: T) {
      state = next
      localStorage.setItem(key, JSON.stringify(next))
      listeners.forEach((listener) => listener())
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
  }
}
