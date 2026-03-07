import { useState } from 'react'
import { ParsedIssue } from '../types'

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'done'; result: ParsedIssue }
  | { status: 'error'; message: string }

export function useAIParse() {
  const [state, setState] = useState<State>({ status: 'idle' })

  async function parse(rawInput: string, partContext?: string) {
    setState({ status: 'loading' })
    try {
      const res = await fetch('/api/ai/parse-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw_input: rawInput, part_context: partContext }),
      })
      if (!res.ok) throw new Error(await res.text())
      const result: ParsedIssue = await res.json()
      setState({ status: 'done', result })
    } catch (err) {
      setState({ status: 'error', message: String(err) })
    }
  }

  function reset() {
    setState({ status: 'idle' })
  }

  return { state, parse, reset }
}
