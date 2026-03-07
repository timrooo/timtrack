import { Router } from 'express'
import { parseIssue } from '../ai/parse-issue'

const router = Router()

router.post('/', async (req, res) => {
  const { raw_input, part_context } = req.body
  if (!raw_input || typeof raw_input !== 'string') {
    return res.status(400).json({ error: 'raw_input required' })
  }

  try {
    const parsed = await parseIssue(raw_input, part_context)
    res.json(parsed)
  } catch (err) {
    console.error('AI parse error:', err)
    res.status(500).json({ error: 'AI parsing failed' })
  }
})

export default router
