import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthToken } from "../../contexts/authentication";
import { createFileRoute } from "@tanstack/react-router";
import { CommentsList } from "../../components/CommentList/CommentsList";
import { CommentForm } from "../../components/CommentForm/CommentForm";
import { MemeHeader } from "../../components/MemeHeader/MemeHeader";
import { MemeContent } from "../../components/MemeContent/MemeContent";
import { Loader } from "../../components/Loader/loader";
import { jwtDecode } from "jwt-decode";
import useMemesWithAuthor from "../../hooks/useMemesWithAuthor";
import useCommentsWithAuthors from "../../hooks/useCommentsWithAuthors";
import {
  createMemeComment,
  getUserById,
} from "../../api/api";
import {
  Collapse,
  Flex,
  StackDivider,
  VStack,
} from "@chakra-ui/react";
import { isScrolledToBottom } from "../../utils/functionHelpers";
import { Comment } from "../../api/apiType";

export const MemeFeedPage: React.FC = () => {
  const token = useAuthToken();

  const [openedCommentSection, setOpenedCommentSection] = useState<string | null>(null);

  const [selectedMemeId, setSelectedMemeId] = useState('')
  const [pageNumberMemes, setPageNumberMemes] = useState(1);
  const [pageNumberComments, setPageNumberComments] = useState<{[memeId: string]: number}>({});
  
  const { isLoadingMemes, memes, maxPages, updateCommentsCountForMeme } = useMemesWithAuthor(token, pageNumberMemes);
  const { isLoadingComments, comments, commentsMaxPages, addNewComment } = useCommentsWithAuthors(token, selectedMemeId, pageNumberComments[selectedMemeId]);

  const lastMemeRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    if(lastMemeRef.current){
      const observer = new IntersectionObserver(([entry]) => {
        if(entry.isIntersecting && pageNumberMemes !== maxPages){
          setPageNumberMemes(pageNumberMemes => pageNumberMemes + 1)
          lastMemeRef.current = null
          observer.disconnect()
        }
      })
      observer.observe(lastMemeRef.current);
    }
    inputRef.current = inputRef.current.slice(0, memes.length)
  }, [memes])
  
  const handleScrollComments = (e: React.UIEvent<HTMLDivElement>) => {
    const atBottom = isScrolledToBottom(e)

    if (atBottom && pageNumberComments[selectedMemeId] !== commentsMaxPages[selectedMemeId]) { 
        setPageNumberComments(prevPageNumberComments => {
          return {
          ...prevPageNumberComments,
          [selectedMemeId]: prevPageNumberComments[selectedMemeId] + 1
        }});
    }
 }

  const showComments = async (memeId: string) => {
    setSelectedMemeId(memeId)
    if(!pageNumberComments[memeId]){
      setPageNumberComments(prev => ({...prev, [memeId]: 1}))
    }
    
    setOpenedCommentSection(
     openedCommentSection === memeId ? null : memeId,
    )
  }

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>, index: number) => {
    event.preventDefault();
    if(inputRef.current && inputRef.current[index].value){
      mutate({
        memeId: selectedMemeId,
        content: inputRef.current[index].value,
      });
      inputRef.current[index].value = ''
    }
  }
  
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      return await getUserById(token, jwtDecode<{ id: string }>(token).id);
    },
  });
  
  const { mutate } = useMutation({
    mutationFn: async (data: { memeId: string; content: string }) => {
      return await createMemeComment(token, data.memeId, data.content);
    },
    onSuccess: (newComment: Comment) => {
      if(user)
        addNewComment(newComment.memeId, newComment, user)
        updateCommentsCountForMeme(newComment.memeId)
    },
    onError: (error) => {
      throw new Error(`Erreur lors de la création du commentaire: ${error.message}`)
    }
  });

  return (
    <Flex width="full" height="full" justifyContent="center" overflowY="auto">
      <VStack
        p={4}
        width="full"
        maxWidth={800}
        divider={<StackDivider border="gray.200" />}
      >
        {memes && memes.length > 0 ? memes.map((meme, index) => (
              <VStack 
                key={`${meme.id}-${index}`} 
                p={4} 
                width="full" 
                align="stretch"
              >
                {memes.length === index + 1 ? !isLoadingMemes ?
                  <MemeHeader 
                    meme={meme} 
                    lastMemeRef={lastMemeRef} 
                  /> : <Loader />
                :
                  <MemeHeader meme={meme} />
                }
                <MemeContent 
                  meme={meme} 
                  showComments={showComments} 
                  openedCommentSection={openedCommentSection}
                />
                <Collapse 
                  in={openedCommentSection === meme.id} 
                  animateOpacity
                >
                  <CommentForm 
                    inputRef={inputRef} 
                    user={user} 
                    indexMeme={index} 
                    handleOnSubmit={(e) => handleOnSubmit(e, index)} 
                  />
                  <VStack 
                    align="stretch" 
                    spacing={4} 
                    overflow={"auto"} 
                    onScroll={handleScrollComments} 
                    overflowY={'scroll'}
                    maxHeight={"400px"}
                    >
                      <CommentsList 
                        isLoading={isLoadingComments} 
                        commentsWithAuthorsList={comments[selectedMemeId]}
                      />
                  </VStack>
                </Collapse>
              </VStack>
        ))
          : <Loader color="green" />
        }
      </VStack>
    </Flex>
  );
};

export const Route = createFileRoute("/_authentication/")({
  component: MemeFeedPage,
});
