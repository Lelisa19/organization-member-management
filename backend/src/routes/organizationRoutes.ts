import { Router } from 'express';
import { listPublicOrganizations } from '../controllers/organizationController';

const router = Router();

router.get('/', listPublicOrganizations);

export default router;
