"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = __importDefault(require("postgres"));
class ConnectionDB {
    constructor() {
        ConnectionDB.sql = (0, postgres_1.default)({
            port: 5432,
            database: 'rinha',
            password: '1234',
            username: 'postgres',
            max: 4,
            host: process.env.DB_HOSTNAME || 'localhost',
        });
    }
    static self() {
        if (!ConnectionDB.instance) {
            ConnectionDB.instance = new ConnectionDB();
        }
        return ConnectionDB.instance;
    }
    sql() {
        if (!ConnectionDB.sql)
            throw new Error('ConnectionDB not initialized');
        return ConnectionDB.sql;
    }
}
ConnectionDB.instance = null;
ConnectionDB.sql = null;
const sql = ConnectionDB.self().sql();
exports.default = sql;
