"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getBlogBySlug = async (slug, db) => {
    return db.orm.public.Blog.where({ slug: slug || undefined }).first();
};
exports.default = getBlogBySlug;
