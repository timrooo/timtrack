import { getDb } from '../index';
export function getConstructionsByFloor(floorId) {
    return getDb().prepare('SELECT * FROM constructions WHERE floor_id = ? ORDER BY code').all(floorId);
}
export function getConstructionsByProject(projectId) {
    return getDb().prepare('SELECT * FROM constructions WHERE project_id = ? ORDER BY floor_id, code').all(projectId);
}
export function getConstructionById(id) {
    return getDb().prepare('SELECT * FROM constructions WHERE id = ?').get(id);
}
export function updateConstructionStatus(id, status) {
    return getDb().prepare('UPDATE constructions SET status = ? WHERE id = ?').run(status, id);
}
