import { useState } from 'react'

export function useReport() {
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generate(projectId: number) {
    setText('')
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/ai/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId }),
      })

      if (!res.ok) throw new Error(await res.text())
      if (!res.body) throw new Error('No response body')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        setText((prev) => prev + decoder.decode(value, { stream: true }))
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setText('')
    setError(null)
  }

  return { text, loading, error, generate, reset }
}
