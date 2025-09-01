"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
exports.errorHandler = errorHandler;
const http_errors_1 = __importDefault(require("http-errors"));
function notFoundHandler(_req, _res, next) {
    next(new http_errors_1.default.NotFound('Route not found'));
}
function errorHandler(err, _req, res, _next) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    if (process.env.NODE_ENV !== 'test') {
        // eslint-disable-next-line no-console
        console.error(err);
    }
    res.status(status).json({ message, status });
}
