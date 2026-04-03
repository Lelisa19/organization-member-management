import { Router } from 'express';
import { getHelpResources } from '../controllers/helpController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/resources', authenticateToken, getHelpResources);

export default router;
