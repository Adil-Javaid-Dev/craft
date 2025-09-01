"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const env_1 = require("./config/env");
async function bootstrap() {
    await (0, db_1.connectToDatabase)();
    app_1.default.listen(env_1.env.port, () => {
        // eslint-disable-next-line no-console
        console.log(`Server listening on http://localhost:${env_1.env.port}`);
    });
}
bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start server', err);
    process.exit(1);
});
