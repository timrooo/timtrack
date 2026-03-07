import { useState, useCallback } from 'react'
import { Screen } from '../types'

export function useNav(initial: Screen = { name: 'home' }) {
  const [stack, setStack] = useState<Screen[]>([initial])

  const current = stack[stack.length - 1]

  const navigate = useCallback((screen: Screen) => {
    setStack((prev) => [...prev, screen])
  }, [])

  const goBack = useCallback(() => {
    setStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev))
  }, [])

  const reset = useCallback((screen: Screen) => {
    setStack([screen])
  }, [])

  const canGoBack = stack.length > 1

  return { current, navigate, goBack, reset, canGoBack }
}

export type NavHook = ReturnType<typeof useNav>
