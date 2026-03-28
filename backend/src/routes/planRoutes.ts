import { Router } from 'express';
import { getPlans, createPlan, updatePlan, deletePlan } from '../controllers/planController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getPlans);
router.post('/', authenticateToken, createPlan);
router.put('/:id', authenticateToken, updatePlan);
router.delete('/:id', authenticateToken, deletePlan);

export default router;
