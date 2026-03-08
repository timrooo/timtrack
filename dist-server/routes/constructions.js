import { Router } from 'express';
import { getConstructionsByFloor, getConstructionsByProject, getConstructionById, updateConstructionStatus, } from '../db/queries/constructions';
const router = Router();
router.get('/floor/:floorId', (req, res) => {
    res.json(getConstructionsByFloor(Number(req.params.floorId)));
});
router.get('/project/:projectId', (req, res) => {
    res.json(getConstructionsByProject(Number(req.params.projectId)));
});
router.get('/:id', (req, res) => {
    const c = getConstructionById(Number(req.params.id));
    if (!c)
        return res.status(404).json({ error: 'Not found' });
    res.json(c);
});
router.patch('/:id/status', (req, res) => {
    const { status } = req.body;
    if (!status)
        return res.status(400).json({ error: 'status required' });
    updateConstructionStatus(Number(req.params.id), status);
    res.json({ ok: true });
});
export default router;
