"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.safeParseInt = void 0;
function safeParseInt(v) {
    if (!v)
        return 0;
    const int = parseInt(v);
    if (isNaN(int))
        return 0;
    return int;
}
exports.safeParseInt = safeParseInt;
