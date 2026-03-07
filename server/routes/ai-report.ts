import { Router } from 'express'
import { streamReport } from '../ai/generate-report'
import { getProjectById, getFloorsByProject } from '../db/queries/projects'
import { getConstructionsByProject } from '../db/queries/constructions'
import { getIssuesByProject } from '../db/queries/issues'

const router = Router()

router.post('/', async (req, res) => {
  const { project_id } = req.body
  if (!project_id) return res.status(400).json({ error: 'project_id required' })

  const project = getProjectById(Number(project_id))
  if (!project) return res.status(404).json({ error: 'Project not found' })

  const floors = getFloorsByProject(Number(project_id)) as Array<{
    name: string; parts_delivered_pct: number; constructions_total: number; constructions_done: number
  }>
  const constructions = getConstructionsByProject(Number(project_id)) as Array<{
    name: string; code: string; status: string; parts_total: number; parts_on_site: number
  }>
  const issues = getIssuesByProject(Number(project_id)) as Array<{
    type: string; comment: string; urgency: string; created_at: string
  }>

  try {
    await streamReport({ project, floors, constructions, issues }, res)
  } catch (err) {
    console.error('Report stream error:', err)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Report generation failed' })
    }
  }
})

export default router
