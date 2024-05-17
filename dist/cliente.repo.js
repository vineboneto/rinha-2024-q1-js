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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteRepository = void 0;
const db_1 = __importDefault(require("./db"));
class ClienteRepository {
    createTransacao(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, valor, descricao, tipo, }) {
            return (0, db_1.default) `insert into transacoes ${(0, db_1.default)({
                id_cliente: id,
                valor,
                descricao,
                tipo,
            })}`;
        });
    }
    updateSaldo(_a) {
        return __awaiter(this, arguments, void 0, function* ({ valorIncrementado, id, }) {
            return (0, db_1.default) `
      update clientes
      set saldo = saldo + ${valorIncrementado}
      where id = ${id} and (saldo + ${valorIncrementado}) * -1 <= limite
      returning saldo, limite
    `;
        });
    }
    find(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let [cliente] = yield (0, db_1.default) `select id from clientes where id = ${id}`;
            if (!cliente) {
                return false;
            }
            return true;
        });
    }
    loadExtrato(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, db_1.default) `
      select
        c.limite,
        c.saldo,
        (select json_agg(f.*) from (
          select 
              t.valor,
              t.descricao,
              t.tipo,
              t.realizada_em
            from transacoes t
            where t.id_cliente = c.id
            order by t.realizada_em desc limit 10
          ) as f
        ) as extrato
      from clientes c where c.id = ${id}
    `;
        });
    }
}
exports.ClienteRepository = ClienteRepository;
