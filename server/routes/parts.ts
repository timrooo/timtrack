import { Router } from 'express'
import { getPartsByConstruction, getPartById, getScanHistory, updatePartStatus } from '../db/queries/parts'

const router = Router()

router.get('/construction/:constructionId', (req, res) => {
  res.json(getPartsByConstruction(Number(req.params.constructionId)))
})

router.get('/:id', (req, res) => {
  const part = getPartById(Number(req.params.id))
  if (!part) return res.status(404).json({ error: 'Not found' })
  res.json(part)
})

router.get('/:id/scan-history', (req, res) => {
  res.json(getScanHistory(Number(req.params.id)))
})

router.patch('/:id/status', (req, res) => {
  const { status } = req.body
  if (!status) return res.status(400).json({ error: 'status required' })
  updatePartStatus(Number(req.params.id), status)
  res.json({ ok: true })
})

export default router
