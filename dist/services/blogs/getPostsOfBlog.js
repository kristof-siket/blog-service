"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getPostsOfBlog = async (blogId, db) => {
    return db.orm.public.Post.where({ blogId: blogId || undefined }).all();
};
exports.default = getPostsOfBlog;
