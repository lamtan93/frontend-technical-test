import { createFileRoute, Link } from "@tanstack/react-router";
import { MemeEditor } from "../../components/MemeEditor/MemeEditor";
import { useMemo, useState } from "react";
import { MemePictureProps } from "../../components/MemePicture/MemePicture";
import { Plus, Trash } from "@phosphor-icons/react";
import { createMeme } from "../../api/api";
import { useAuthToken, useTokenDateExpriration } from "../../contexts/authentication";
import { useNavigateTo } from "../../hooks/useNavigateTo";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";


export const Route = createFileRoute("/_authentication/create")({
  component: CreateMemePage,
});

type Picture = {
  url: string;
  file: File
};

function CreateMemePage() {
  const token = useAuthToken();
  // const tokenExp = useTokenDateExpriration();

  const [picture, setPicture] = useState<Picture | null>(null);
  const [texts, setTexts] = useState<MemePictureProps["texts"]>([]);
  const [description, setDescription] = useState('');

  const { navigateTo } = useNavigateTo()
  
  const handleDrop = (file: File) => {
    setPicture({
      url: URL.createObjectURL(file),
      file,
    });
  };

  const handleAddCaptionButtonClick = () => {
    setTexts([
      ...texts,
      {
        content: `New caption ${texts.length + 1}`,
        x: Math.round(Math.random() * 400),
        y: Math.round(Math.random() * 225),
      },
    ]);
  };

  const handleDeleteCaptionButtonClick = (index: number) => {
    setTexts(texts.filter((_, i) => i !== index));
  };

  const memePicture = useMemo(() => {
    if (!picture) {
      return undefined;
    }

    return {
      pictureUrl: picture.url,
      texts,
    };
  }, [picture, texts]);

  const handleSubmit = async () => {
    if(!picture) {
      alert('please add a picture!')
      return
    } 
    await createMeme(token, picture.file, description, texts)
    navigateTo('/')
  }

  const handleOnChangeCaption = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const currentContent = e.currentTarget.value;
    if(currentContent.trim().length > 0){
      setTexts(prevTexts => 
        prevTexts.map((text, i) => i === index ? {...text, content: currentContent} : text)
      )
    }
  }
  const handleOnChangeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentDescription = e.currentTarget.value;
    setDescription(currentDescription);
  }

  return (
    <Flex width="full" height="full">
      <Box flexGrow={1} height="full" p={4} overflowY="auto">
        <VStack spacing={5} align="stretch">
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Upload your picture
            </Heading>
            <MemeEditor onDrop={handleDrop} memePicture={memePicture} />
          </Box>
          <Box>
            <Heading as="h2" size="md" mb={2}>
              Describe your meme
            </Heading>
            <Textarea placeholder="Type your description here..." onChange={handleOnChangeDescription}/>
          </Box>
        </VStack>
      </Box>
      <Flex
        flexDir="column"
        width="30%"
        minW="250"
        height="full"
        boxShadow="lg"
      >
        <Heading as="h2" size="md" mb={2} p={4}>
          Add your captions
        </Heading>
        <Box p={4} flexGrow={1} height={0} overflowY="auto">
          <VStack>
            {texts.map((text, index) => (
              <Flex width="full" key={`${text}-${index}`}>
                <Input key={index} defaultValue={text.content} mr={1} onChange={(e) => handleOnChangeCaption(e,index)}/>
                <IconButton
                  onClick={() => handleDeleteCaptionButtonClick(index)}
                  aria-label="Delete caption"
                  icon={<Icon as={Trash} />}
                />
              </Flex>
            ))}
            <Button
              colorScheme="cyan"
              leftIcon={<Icon as={Plus} />}
              variant="ghost"
              size="sm"
              width="full"
              onClick={handleAddCaptionButtonClick}
              isDisabled={memePicture === undefined}
            >
              Add a caption
            </Button>
          </VStack>
        </Box>
        <HStack p={4}>
          <Button
            as={Link}
            to="/"
            colorScheme="cyan"
            variant="outline"
            size="sm"
            width="full"
          >
            Cancel
          </Button>
          <Button
            colorScheme="cyan"
            size="sm"
            width="full"
            color="white"
            isDisabled={memePicture === undefined}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );
}
