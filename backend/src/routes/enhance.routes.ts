import { Router } from 'express';
import * as enhanceController from '../controllers/enhance.controller';

const router = Router();

router.post('/', enhanceController.enhance);
router.get('/status/:requestId', enhanceController.streamStatus);
router.post('/generate-hook', enhanceController.generateHook);
router.post('/guided/structure', enhanceController.generateGuidedStructure);
router.post('/guided/post', enhanceController.generateGuidedPost);
router.post('/guided/variations', enhanceController.generateGuidedVariations);

export default router;
