import { getDb } from '../index';
export function getPartsByConstruction(constructionId) {
    return getDb().prepare('SELECT * FROM parts WHERE construction_id = ? ORDER BY number').all(constructionId);
}
export function getPartById(id) {
    return getDb().prepare('SELECT * FROM parts WHERE id = ?').get(id);
}
export function getScanHistory(partId) {
    return getDb().prepare('SELECT * FROM scan_history WHERE part_id = ? ORDER BY created_at DESC').all(partId);
}
export function updatePartStatus(id, status) {
    return getDb().prepare('UPDATE parts SET status = ? WHERE id = ?').run(status, id);
}
