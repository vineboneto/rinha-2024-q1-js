"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const db_1 = __importDefault(require("./db"));
const port = Number(process.env.PORT) || 3000;
app_1.default.listen({
    host: '0.0.0.0',
    port,
    listenTextResolver: (address) => {
        console.log(`Server is running at pid: ${process.pid}, address: ${address}...`);
        return address;
    },
});
function gracefulShutdown() {
    console.log('Received kill signal, shutting down gracefully...');
    db_1.default.end();
    app_1.default.close(() => {
        process.exit(0);
    });
}
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
