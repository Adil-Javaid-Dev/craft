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
exports.create = create;
exports.list = list;
exports.getById = getById;
exports.update = update;
exports.remove = remove;
exports.setStatus = setStatus;
const express_validator_1 = require("express-validator");
const ClientService = __importStar(require("../services/client.service"));
async function create(req, res, next) {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const client = await ClientService.createClient(req.body);
        return res.status(201).json(client);
    }
    catch (err) {
        next(err);
    }
}
async function list(req, res, next) {
    try {
        const { page, limit, status, q } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (q)
            filter.name = { $regex: String(q), $options: 'i' };
        const data = await ClientService.listClients(filter, { page: Number(page), limit: Number(limit) });
        return res.json(data);
    }
    catch (err) {
        next(err);
    }
}
async function getById(req, res, next) {
    try {
        const client = await ClientService.getClientById(req.params.id);
        return res.json(client);
    }
    catch (err) {
        next(err);
    }
}
async function update(req, res, next) {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const client = await ClientService.updateClient(req.params.id, req.body);
        return res.json(client);
    }
    catch (err) {
        next(err);
    }
}
async function remove(req, res, next) {
    try {
        await ClientService.deleteClient(req.params.id);
        return res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
async function setStatus(req, res, next) {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });
        const client = await ClientService.setClientStatus(req.params.id, req.body.status);
        return res.json(client);
    }
    catch (err) {
        next(err);
    }
}
