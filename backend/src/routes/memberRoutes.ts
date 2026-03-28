import { Router } from 'express';
import { getMembers, createMember, updateMember, deleteMember } from '../controllers/memberController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getMembers);
router.post('/', authenticateToken, createMember);
router.put('/:id', authenticateToken, updateMember);
router.delete('/:id', authenticateToken, deleteMember);

export default router;
