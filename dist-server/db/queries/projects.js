import { getDb } from '../index';
export function getAllProjects() {
    return getDb().prepare('SELECT * FROM projects ORDER BY created_at DESC').all();
}
export function getProjectById(id) {
    return getDb().prepare('SELECT * FROM projects WHERE id = ?').get(id);
}
export function getFloorsByProject(projectId) {
    return getDb().prepare(`
    SELECT * FROM floors WHERE project_id = ? ORDER BY id
  `).all(projectId);
}
