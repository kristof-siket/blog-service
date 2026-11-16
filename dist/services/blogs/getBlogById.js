"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getBlogById = async (id, db) => {
    return db.orm.public.Blog.first({ id: id || undefined });
};
exports.default = getBlogById;
