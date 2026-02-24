const ARENA_STORAGE_PREFIX = "arena_"

export const enum StorageKey {
  ARENA_SETTINGS = "arena_settings",
  ONBOARDING_COMPLETED = "arena_onboarding_completed",
  LAST_ARENA_ID = "arena_last_arena_id",
  WALLET_ADDRESS = "arena_wallet_address",
  SELECTED_CURRENCY = "arena_selected_currency",
  HAS_STAKED = "inversearena_has_staked",
}

export function getItem<T>(key: StorageKey | string, fallback: T): T {
  if (typeof window === "undefined") return fallback

  try {
    const rawValue = window.localStorage.getItem(key)
    if (rawValue === null) return fallback

    try {
      return JSON.parse(rawValue) as T
    } catch (error) {
      console.warn(
        `[ArenaStorage] Failed to parse JSON for key "${key}". Returning fallback.`,
        error
      )
      return fallback
    }
  } catch (error) {
    console.warn(
      `[ArenaStorage] Failed to read key "${key}" from localStorage.`,
      error
    )
    return fallback
  }
}

export function setItem<T>(key: StorageKey | string, value: T): void {
  if (typeof window === "undefined") return

  try {
    const serializedValue = JSON.stringify(value)
    window.localStorage.setItem(key, serializedValue)
  } catch (error) {
    console.warn(
      `[ArenaStorage] Failed to write key "${key}" to localStorage.`,
      error
    )
  }
}

export function removeItem(key: StorageKey | string): void {
  if (typeof window === "undefined") return

  try {
    window.localStorage.removeItem(key)
  } catch (error) {
    console.warn(
      `[ArenaStorage] Failed to remove key "${key}" from localStorage.`,
      error
    )
  }
}

export function clearArenaStorage(): void {
  if (typeof window === "undefined") return

  try {
    const keysToRemove: string[] = []

    for (let i = 0; i < window.localStorage.length; i += 1) {
      try {
        const key = window.localStorage.key(i)
        if (key && key.startsWith(ARENA_STORAGE_PREFIX)) {
          keysToRemove.push(key)
        }
      } catch (error) {
        console.warn("[ArenaStorage] Failed while reading localStorage key.", error)
      }
    }

    for (const key of keysToRemove) {
      try {
        window.localStorage.removeItem(key)
      } catch (error) {
        console.warn(`[ArenaStorage] Failed to remove arena key "${key}".`, error)
      }
    }
  } catch (error) {
    console.warn("[ArenaStorage] Failed to clear arena-prefixed keys.", error)
  }
}
