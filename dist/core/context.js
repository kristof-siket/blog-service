"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.context = void 0;
const service_mjs_1 = __importDefault(require("../service.mjs"));
const { db } = service_mjs_1.default.load();
// TODO auth (i.e. creation of RBAC or other access control mechanism)
exports.context = {
    prisma: db.client,
};
