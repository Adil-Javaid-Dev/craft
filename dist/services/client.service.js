"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClient = createClient;
exports.getClientById = getClientById;
exports.listClients = listClients;
exports.updateClient = updateClient;
exports.deleteClient = deleteClient;
exports.setClientStatus = setClientStatus;
const http_errors_1 = __importDefault(require("http-errors"));
const Client_1 = require("../models/Client");
async function createClient(input) {
    const existing = input.email ? await Client_1.ClientModel.findOne({ email: input.email }) : null;
    if (existing) {
        throw new http_errors_1.default.Conflict('Client with this email already exists');
    }
    const client = await Client_1.ClientModel.create({ ...input });
    return client;
}
async function getClientById(id) {
    const client = await Client_1.ClientModel.findById(id);
    if (!client)
        throw new http_errors_1.default.NotFound('Client not found');
    return client;
}
async function listClients(filter = {}, options = {}) {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
        Client_1.ClientModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Client_1.ClientModel.countDocuments(filter)
    ]);
    return { items, total, page, limit, pages: Math.ceil(total / limit) };
}
async function updateClient(id, update) {
    const client = await Client_1.ClientModel.findByIdAndUpdate(id, update, { new: true });
    if (!client)
        throw new http_errors_1.default.NotFound('Client not found');
    return client;
}
async function deleteClient(id) {
    const result = await Client_1.ClientModel.findByIdAndDelete(id);
    if (!result)
        throw new http_errors_1.default.NotFound('Client not found');
}
async function setClientStatus(id, status) {
    const client = await Client_1.ClientModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!client)
        throw new http_errors_1.default.NotFound('Client not found');
    return client;
}
