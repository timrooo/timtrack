import { Router } from 'express'
import { getAllProjects, getProjectById, getFloorsByProject } from '../db/queries/projects'

const router = Router()

router.get('/', (_req, res) => {
  res.json(getAllProjects())
})

router.get('/:id', (req, res) => {
  const project = getProjectById(Number(req.params.id))
  if (!project) return res.status(404).json({ error: 'Not found' })
  res.json(project)
})

router.get('/:id/floors', (req, res) => {
  res.json(getFloorsByProject(Number(req.params.id)))
})

export default router
