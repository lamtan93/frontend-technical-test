import {
    Avatar,
    Box,
    Flex,
    Text,
  } from "@chakra-ui/react";
import { CommentsWithAuthors } from "../../api/apiType"
import { Loader } from "../Loader/loader";
import { format } from "timeago.js";

type CommentListType = {
    isLoading: boolean,
    commentsWithAuthorsList: CommentsWithAuthors,
}
export const CommentsList: React.FC<CommentListType> = ({isLoading, commentsWithAuthorsList }) => {
    {return (commentsWithAuthorsList && commentsWithAuthorsList.length > 0) && commentsWithAuthorsList.map((comment, index) =>  
        <Flex key={`${comment.id}-${index}`}>
            <Avatar
                borderWidth="1px"
                borderColor="gray.300"
                size="sm"
                name={comment.author.username}
                src={comment.author.pictureUrl}
                mr={2}
            />
            {commentsWithAuthorsList.length === index + 1 ? !isLoading ? (
            <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
                <Flex
                justifyContent="space-between"
                alignItems="center"
                >
                <Flex>
                    <Text data-testid={`meme-comment-author-${comment.memeId}-${comment.id}`}>{comment.author.username}</Text>
                </Flex>
                <Text
                    fontStyle="italic"
                    color="gray.500"
                    fontSize="small"
                >
                    {format(comment.createdAt)}
                </Text>
                </Flex>
                
                <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-comment-content-${comment.memeId}-${comment.id}`}>
                    {comment.content}
                </Text>
                
            </Box> 
            ): <Loader color="green"  data-testid={'loader'}/> :(
                <Box p={2} borderRadius={8} bg="gray.50" flexGrow={1}>
                <Flex
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Flex>
                    <Text data-testid={`meme-comment-author-${comment.memeId}-${comment.id}`}>{comment.author.username}</Text>
                    </Flex>
                    <Text
                    fontStyle="italic"
                    color="gray.500"
                    fontSize="small"
                    >
                    {format(comment.createdAt)}
                    </Text>
                </Flex>
                <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-comment-content-${comment.memeId}-${comment.id}`}>
                    {comment.content}
                </Text>
            </Box>
    )}
        </Flex> 
    )}
}