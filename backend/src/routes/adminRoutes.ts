import { Router } from 'express';
import { getOrganizations, createOrganization, updateOrganization, deleteOrganization } from '../controllers/adminController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/organizations', authenticateToken, getOrganizations);
router.post('/organizations', authenticateToken, createOrganization);
router.put('/organizations/:id', authenticateToken, updateOrganization);
router.delete('/organizations/:id', authenticateToken, deleteOrganization);

export default router;
