export interface PostCreateInput {
    content: string
    title?: string
}

export interface BlogCreateInput {
    slug: string
    name: string
    posts?: PostCreateInput[]
}
