"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPostById = async (id, db) => {
    return db.orm.public.Post.first({ id: id || undefined });
};
exports.default = getPostById;
