"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildClienteController = void 0;
const cliente_controller_1 = require("./cliente.controller");
const cliente_repo_1 = require("./cliente.repo");
function buildClienteController() {
    const repo = new cliente_repo_1.ClienteRepository();
    const controller = new cliente_controller_1.ClienteController(repo);
    return controller;
}
exports.buildClienteController = buildClienteController;
