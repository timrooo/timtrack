import { getDb } from '../index'

export interface ProjectRow {
  id: number
  name: string
  site_code: string
  address: string
  status: string
  progress_pct: number
  created_at: string
}

export function getAllProjects(): ProjectRow[] {
  return getDb().prepare('SELECT * FROM projects ORDER BY created_at DESC').all() as ProjectRow[]
}

export function getProjectById(id: number): ProjectRow | undefined {
  return getDb().prepare('SELECT * FROM projects WHERE id = ?').get(id) as ProjectRow | undefined
}

export function getFloorsByProject(projectId: number) {
  return getDb().prepare(`
    SELECT * FROM floors WHERE project_id = ? ORDER BY id
  `).all(projectId)
}
