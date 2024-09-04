import { Box, Flex, LinkBox, Text, LinkOverlay, Icon } from "@chakra-ui/react"
import { CaretDown, CaretUp, Chat } from "@phosphor-icons/react";
import { MemePicture } from "../MemePicture/MemePicture"
import { MemeWithAuthor } from "../../api/apiType"


type MemeContent = {
    meme: MemeWithAuthor,
    showComments: (memeId: string) => void,
    openedCommentSection: string | null
}

export const MemeContent: React.FC<MemeContent> = ({ meme, showComments, openedCommentSection }) => {
    return (
        <>
        <MemePicture pictureUrl={meme.pictureUrl} texts={meme.texts} dataTestId={`meme-picture-${meme.id}`} />
        <Box>
            <Text fontWeight="bold" fontSize="medium" mb={2}>
            Description:{" "}
            </Text>
            <Box
            p={2}
            borderRadius={8}
            border="1px solid"
            borderColor="gray.100"
            >
            <Text color="gray.500" whiteSpace="pre-line" data-testid={`meme-description-${meme.id}`}>
                {meme.description}
            </Text>
            </Box>
        </Box>
        <LinkBox as={Box} py={2} borderBottom="1px solid black">
            <Flex justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
                <LinkOverlay
                data-testid={`meme-comments-section-${meme.id}`}
                cursor="pointer"
                onClick={() => showComments(meme.id)}
                >
                <Text data-testid={`meme-comments-count-${meme.id}`}>{meme.commentsCount} comments</Text>
                </LinkOverlay>
                <Icon
                as={
                    openedCommentSection !== meme.id ? CaretDown : CaretUp
                }
                ml={2}
                mt={1}
                />
            </Flex>
            <Icon as={Chat} />
            </Flex>
        </LinkBox>
        </>
    )
}