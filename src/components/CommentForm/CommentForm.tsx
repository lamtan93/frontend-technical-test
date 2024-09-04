import React from 'react'
import {
    Avatar,
    Box,
    Flex,
    Input
  } from "@chakra-ui/react";
import { GetUserByIdResponse } from '../../api/apiType';

type CommentFormType = {
    inputRef: React.MutableRefObject<HTMLInputElement[]>,
    user: GetUserByIdResponse | undefined,
    indexMeme: number,
    handleOnSubmit: (e: React.FormEvent<HTMLFormElement>) => void,
}
export const CommentForm: React.FC<CommentFormType> = ({ inputRef, handleOnSubmit, user, indexMeme}) => {
  return (
    <Box mb={6}>
        <form onSubmit={handleOnSubmit}>
            <Flex alignItems="center">
                <Avatar
                    borderWidth="1px"
                    borderColor="gray.300"
                    name={user ? user.username : ''}
                    src={user ? user.pictureUrl : ''}
                    size="sm"
                    mr={2}
                />
                <Input
                    data-testid={`input-comment-${indexMeme}`}
                    placeholder="Type your comment here..."
                    ref={(el) => {
                        if (el) {
                            inputRef.current[indexMeme] = el;
                        }
                    }}
                />
            </Flex>
        </form>
    </Box>
  )
}
