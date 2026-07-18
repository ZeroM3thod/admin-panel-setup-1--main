"use client"

import { useState, useEffect } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const isClient = typeof window !== "undefined"

  const [storedValue, setStoredValue] = useState<T>(() => {
    if (!isClient) {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error("Error reading from local storage", error)
      return initialValue
    }
  })

  useEffect(() => {
    if (!isClient) {
      return
    }
    try {
      const valueToStore =
        typeof storedValue === "function"
          ? storedValue(storedValue)
          : storedValue
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error("Error writing to local storage", error)
    }
  }, [key, storedValue, isClient])

  return [storedValue, setStoredValue] as const
}
