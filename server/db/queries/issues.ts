import { getDb } from '../index'

export function getIssuesByPart(partId: number) {
  return getDb().prepare('SELECT * FROM issues WHERE part_id = ? ORDER BY created_at DESC').all(partId)
}

export function getIssuesByConstruction(constructionId: number) {
  return getDb().prepare('SELECT * FROM issues WHERE construction_id = ? ORDER BY created_at DESC').all(constructionId)
}

export function getIssuesByProject(projectId: number) {
  return getDb().prepare(`
    SELECT i.* FROM issues i
    JOIN constructions c ON c.id = i.construction_id
    WHERE c.project_id = ?
    ORDER BY i.created_at DESC
  `).all(projectId)
}

export function createIssue(data: {
  part_id: number
  construction_id: number
  type: string
  comment: string
  urgency: string
  reported_by: string
  raw_input?: string | null
}) {
  const result = getDb().prepare(`
    INSERT INTO issues (part_id, construction_id, type, comment, urgency, reported_by, raw_input)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    data.part_id,
    data.construction_id,
    data.type,
    data.comment,
    data.urgency,
    data.reported_by,
    data.raw_input ?? null
  )
  return result.lastInsertRowid
}
