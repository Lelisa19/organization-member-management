import { Router } from 'express';
import { getBlogs, createBlog, updateBlog, deleteBlog } from '../controllers/blogController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getBlogs);
router.post('/', authenticateToken, createBlog);
router.put('/:id', authenticateToken, updateBlog);
router.delete('/:id', authenticateToken, deleteBlog);

export default router;
