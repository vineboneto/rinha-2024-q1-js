"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ClienteController_repo;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteController = void 0;
class ClienteController {
    constructor(repo) {
        _ClienteController_repo.set(this, void 0);
        __classPrivateFieldSet(this, _ClienteController_repo, repo, "f");
    }
    createTransacao(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = Object.assign(Object.assign({}, (req.params || {})), (req.body || {}));
            const id = Number(input === null || input === void 0 ? void 0 : input.id);
            const valor = Number(input === null || input === void 0 ? void 0 : input.valor);
            const descricao = input === null || input === void 0 ? void 0 : input.descricao;
            const tipo = input === null || input === void 0 ? void 0 : input.tipo;
            const isValid = Number.isInteger(id) &&
                Number.isInteger(valor) &&
                valor > 0 &&
                (tipo === 'c' || tipo === 'd') &&
                typeof descricao === 'string' &&
                (descricao === null || descricao === void 0 ? void 0 : descricao.length) >= 1 &&
                (descricao === null || descricao === void 0 ? void 0 : descricao.length) <= 10;
            if (!isValid)
                return reply.status(422).send();
            const exist = yield __classPrivateFieldGet(this, _ClienteController_repo, "f").find(id);
            if (!exist)
                return reply.status(404).send();
            const valorIncrementado = tipo === 'd' ? -valor : valor;
            const [result] = yield __classPrivateFieldGet(this, _ClienteController_repo, "f").updateSaldo({ valorIncrementado, id });
            if (!result)
                return reply.status(422).send();
            return __classPrivateFieldGet(this, _ClienteController_repo, "f")
                .createTransacao({ id, descricao, tipo, valor })
                .then(() => reply.send({ saldo: result.saldo, limite: result.limite }));
        });
    }
    loadExtrato(req, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = Number((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
            if (!Number.isInteger(id))
                return reply.status(422).send();
            const exist = yield __classPrivateFieldGet(this, _ClienteController_repo, "f").find(id);
            if (!exist)
                return reply.status(404).send();
            return __classPrivateFieldGet(this, _ClienteController_repo, "f").loadExtrato(id).then(([result]) => {
                if (!result)
                    return reply.status(404).send();
                const { saldo, limite, extrato } = result;
                const output = {
                    saldo: {
                        total: saldo,
                        limite: limite,
                        data_extrato: new Date(),
                    },
                    ultimas_transacoes: extrato || [],
                };
                return reply.send(output);
            });
        });
    }
}
exports.ClienteController = ClienteController;
_ClienteController_repo = new WeakMap();
