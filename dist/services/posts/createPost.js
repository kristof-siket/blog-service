"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createPost = async (data, blogId, db) => {
    return db.orm.public.Post.create({
        title: data.title,
        content: data.content,
        blogId: blogId,
    });
};
exports.default = createPost;
