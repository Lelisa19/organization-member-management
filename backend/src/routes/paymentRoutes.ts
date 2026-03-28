import { Router } from 'express';
import { getPayments, createPayment, getPaymentById } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getPayments);
router.post('/', authenticateToken, createPayment);
router.get('/:id', authenticateToken, getPaymentById);

export default router;
