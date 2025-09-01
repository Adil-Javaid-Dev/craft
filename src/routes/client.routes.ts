import { Router } from 'express';
import { body, param, query } from 'express-validator';
import * as ClientController from '../controllers/client.controller';

const router = Router();

router.get('/', [
	query('page').optional().isInt({ min: 1 }).toInt(),
	query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
	query('status').optional().isIn(['active', 'inactive']),
	query('q').optional().isString()
], ClientController.list);

router.post('/', [
	body('name').isString().trim().notEmpty(),
	body('email').optional().isEmail().normalizeEmail(),
	body('phone').optional().isString().trim(),
	body('status').optional().isIn(['active', 'inactive'])
], ClientController.create);

router.get('/:id', [
	param('id').isMongoId()
], ClientController.getById);

router.put('/:id', [
	param('id').isMongoId(),
	body('name').optional().isString().trim().notEmpty(),
	body('email').optional().isEmail().normalizeEmail(),
	body('phone').optional().isString().trim(),
	body('status').optional().isIn(['active', 'inactive'])
], ClientController.update);

router.delete('/:id', [
	param('id').isMongoId()
], ClientController.remove);

router.patch('/:id/status', [
	param('id').isMongoId(),
	body('status').isIn(['active', 'inactive'])
], ClientController.setStatus);

export default router;
