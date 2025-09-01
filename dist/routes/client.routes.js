"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const ClientController = __importStar(require("../controllers/client.controller"));
const router = (0, express_1.Router)();
router.get('/', [
    (0, express_validator_1.query)('page').optional().isInt({ min: 1 }).toInt(),
    (0, express_validator_1.query)('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    (0, express_validator_1.query)('status').optional().isIn(['active', 'inactive']),
    (0, express_validator_1.query)('q').optional().isString()
], ClientController.list);
router.post('/', [
    (0, express_validator_1.body)('name').isString().trim().notEmpty(),
    (0, express_validator_1.body)('email').optional().isEmail().normalizeEmail(),
    (0, express_validator_1.body)('phone').optional().isString().trim(),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'inactive'])
], ClientController.create);
router.get('/:id', [
    (0, express_validator_1.param)('id').isMongoId()
], ClientController.getById);
router.put('/:id', [
    (0, express_validator_1.param)('id').isMongoId(),
    (0, express_validator_1.body)('name').optional().isString().trim().notEmpty(),
    (0, express_validator_1.body)('email').optional().isEmail().normalizeEmail(),
    (0, express_validator_1.body)('phone').optional().isString().trim(),
    (0, express_validator_1.body)('status').optional().isIn(['active', 'inactive'])
], ClientController.update);
router.delete('/:id', [
    (0, express_validator_1.param)('id').isMongoId()
], ClientController.remove);
router.patch('/:id/status', [
    (0, express_validator_1.param)('id').isMongoId(),
    (0, express_validator_1.body)('status').isIn(['active', 'inactive'])
], ClientController.setStatus);
exports.default = router;
