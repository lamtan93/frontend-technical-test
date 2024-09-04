export type LoginResponse = {
    jwt: string
}

export type GetUserByIdResponse = {
    id: string;
    username: string;
    pictureUrl: string;
}

export type IMemeResponse = {
    id: string;
    authorId: string;
    pictureUrl: string;
    description: string;
    commentsCount: string;
    texts: {
      content: string;
      x: number;
      y: number;
    }[];
    createdAt: string;
  }
  
export type MemeWithAuthor = 
IMemeResponse & { author: GetUserByIdResponse }

export type MemesWithAuthor = MemeWithAuthor[]

export type GetMemesResponse = {
    total: number;
    pageSize: number;
    results: IMemeResponse[]
}

export type Comment = {
    id: string;
    authorId: string;
    memeId: string;
    content: string;
    createdAt: string;
}
  
export type CommentWithAuthor = Comment & { author: GetUserByIdResponse}
export type CommentsWithAuthors = CommentWithAuthor[]

export type GetMemeCommentsResponse = {
    total: number;
    pageSize: number;
    results: Comment[]
}

export type CreateCommentResponse = {
    id: string;
    content: string;
    createdAt: string;
    authorId: string;
    memeId: string;
}

export type TextCaption = {
    content: string,
    x: number,
    y: number
  }