"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostsOfBlog = exports.createPost = exports.createBlog = exports.getPostById = exports.getBlogBySlug = exports.getBlogById = void 0;
var getBlogById_1 = require("./blogs/getBlogById");
Object.defineProperty(exports, "getBlogById", { enumerable: true, get: function () { return __importDefault(getBlogById_1).default; } });
var getBlogBySlug_1 = require("./blogs/getBlogBySlug");
Object.defineProperty(exports, "getBlogBySlug", { enumerable: true, get: function () { return __importDefault(getBlogBySlug_1).default; } });
var getPostById_1 = require("./posts/getPostById");
Object.defineProperty(exports, "getPostById", { enumerable: true, get: function () { return __importDefault(getPostById_1).default; } });
var createBlog_1 = require("./blogs/createBlog");
Object.defineProperty(exports, "createBlog", { enumerable: true, get: function () { return __importDefault(createBlog_1).default; } });
var createPost_1 = require("./posts/createPost");
Object.defineProperty(exports, "createPost", { enumerable: true, get: function () { return __importDefault(createPost_1).default; } });
var getPostsOfBlog_1 = require("./blogs/getPostsOfBlog");
Object.defineProperty(exports, "getPostsOfBlog", { enumerable: true, get: function () { return __importDefault(getPostsOfBlog_1).default; } });
