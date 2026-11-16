"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createBlog = async (data, db) => {
    if (data.posts) {
        return db.orm.public.Blog.create({
            slug: data.slug,
            name: data.name,
            posts: (p) => p.create(data.posts),
        });
    }
    return db.orm.public.Blog.create({
        slug: data.slug,
        name: data.name,
    });
};
exports.default = createBlog;
