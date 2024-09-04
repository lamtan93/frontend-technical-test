import { useState, useEffect } from 'react'
import { getMemeComments, getUserById } from '../api/api';
import { Comment, CommentWithAuthor, CommentsWithAuthors, GetUserByIdResponse } from '../api/apiType';

function useCommentsWithAuthors(token: string, selectedMeme: string, pageNumber: number) {
    const [comments, setComments] = useState<{[memeId: string]: CommentsWithAuthors}>({});
    const [commentsMaxPages, setCommentsMaxPages] = useState<{[memeId: string]: number}>({})
    const [isLoadingComments, setIsLoadingComments] = useState(false);

    const mappingAuthorsToComments = async (commentsList: Comment[]): Promise<CommentsWithAuthors> => {
        const authorsWithComments: CommentsWithAuthors = await Promise.all(
            commentsList.map(async (comment): Promise<CommentWithAuthor> => {
                const author = await getUserById(token, comment.authorId);
                return {
                    ...comment,
                    author,
                };
            })
        );
        return authorsWithComments;
    };

    const addNewComment = (memeId: string, newComment: Comment, author: GetUserByIdResponse) => {
        const newCommentWithAuthor = {
            ...newComment,
            author
        }
        setComments(prevComments => ({
            ...prevComments,
            [memeId]: [newCommentWithAuthor, ...prevComments[memeId]]
        }))
    }

    useEffect(() => {    
        const fetchCommentsWithAuthors = async () => {    
            setIsLoadingComments(true) 
            const commentsAPI = await getMemeComments(token, selectedMeme, pageNumber);
            const authorsWithComments = await mappingAuthorsToComments(commentsAPI.results)
            
            setComments(prevComments => ({
                ...prevComments,
                [selectedMeme]: [
                    ...(prevComments[selectedMeme] || []),
                    ...authorsWithComments
                ]
            }));
            setCommentsMaxPages(prevCommentsMaxPages => ({
                ...prevCommentsMaxPages,
                [selectedMeme] : Math.ceil(commentsAPI.total / commentsAPI.pageSize)
            }))
            setIsLoadingComments(false) 
        };
        
        if (selectedMeme && selectedMeme.trim().length > 0)
            fetchCommentsWithAuthors();
    }, [selectedMeme, pageNumber]);
    

  return {
    comments,
    commentsMaxPages,
    isLoadingComments,
    addNewComment
  }
}

export default useCommentsWithAuthors