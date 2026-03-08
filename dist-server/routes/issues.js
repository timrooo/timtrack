import { Router } from 'express';
import { getIssuesByPart, getIssuesByConstruction, getIssuesByProject, createIssue } from '../db/queries/issues';
const router = Router();
router.get('/part/:partId', (req, res) => {
    res.json(getIssuesByPart(Number(req.params.partId)));
});
router.get('/construction/:constructionId', (req, res) => {
    res.json(getIssuesByConstruction(Number(req.params.constructionId)));
});
router.get('/project/:projectId', (req, res) => {
    res.json(getIssuesByProject(Number(req.params.projectId)));
});
router.post('/', (req, res) => {
    const { part_id, construction_id, type, comment, urgency, reported_by, raw_input } = req.body;
    if (!part_id || !construction_id || !type || !comment) {
        return res.status(400).json({ error: 'part_id, construction_id, type, comment required' });
    }
    const id = createIssue({ part_id, construction_id, type, comment, urgency: urgency || 'medium', reported_by: reported_by || 'worker', raw_input });
    res.status(201).json({ id });
});
export default router;
