import { useState, useEffect } from 'react'
import {
    getMemes,
    getUserById,
} from '../api/api';
import { IMemeResponse, MemeWithAuthor, MemesWithAuthor} from '../api/apiType';



function useMemesWithAuthor(token: string, pageNumber: number) {
    const [memes, setMemes] = useState<MemesWithAuthor>([]);
    const [maxPages, setMaxPages] = useState(0)
    const [isLoadingMemes, setIsLoadingMemes] = useState(false);

    const mappingAuthorToMeme = async (memeList: IMemeResponse[]): Promise<MemesWithAuthor> => {
        const memesWithAuthors: MemesWithAuthor = await Promise.all(
            memeList.map(async (meme): Promise<MemeWithAuthor> => {
                const author = await getUserById(token, meme.authorId);
                return {
                    ...meme,
                    author,
                };
            })
        );
        return memesWithAuthors;
    };

    const updateCommentsCountForMeme = (memeId: string) => {
        setMemes(prevMemes => 
             prevMemes.map(meme => 
                meme.id === memeId 
                ? { ...meme, commentsCount: (Number(meme.commentsCount) + 1).toString() } 
                : meme
            )
        )
    }
    

    useEffect(() => {
        const fetchMemesWithAuthors = async () => {      
            setIsLoadingMemes(true)
            const meme = await getMemes(token, pageNumber);
            const memesWithAuthors = await mappingAuthorToMeme(meme.results);
            
            setMemes(state => [...state, ...memesWithAuthors]);
            setIsLoadingMemes(false)
            setMaxPages(Math.ceil(meme.total / meme.pageSize));
        };
        fetchMemesWithAuthors();
    }, [pageNumber]);

  return {
    memes,
    maxPages,
    isLoadingMemes,
    updateCommentsCountForMeme
  }
}

export default useMemesWithAuthor