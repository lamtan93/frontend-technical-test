import { Flex, Text, Avatar } from "@chakra-ui/react"
import { MemeWithAuthor } from "../../api/apiType"
import { format } from "timeago.js"

type MemeHeaderType = {
    meme: MemeWithAuthor,
    lastMemeRef?: React.MutableRefObject<HTMLDivElement | null>
}

export const MemeHeader: React.FC<MemeHeaderType> = ({ meme, lastMemeRef }) => {
    return (
        <Flex ref={lastMemeRef} justifyContent="space-between" alignItems="center">
            <Flex >
                <Avatar
                    borderWidth="1px"
                    borderColor="gray.300"
                    size="xs"
                    name={meme.author.username}
                    src={meme.author.pictureUrl}
                />
                <Text ml={2} data-testid={`meme-author-${meme.id}`}>{meme.author.username}</Text>
            </Flex>
            <Text fontStyle="italic" color="gray.500" fontSize="small" >
                {format(meme.createdAt)}
            </Text>
        </Flex>
    )
}