import { Flex, Spinner } from "@chakra-ui/react"

interface ILoader {
  size?: string,
  color?: string,
}

export const Loader: React.FC<ILoader> = ({size = 'xl', color="cyan.600"}) => {
  return <Flex width="full" height="full" alignItems="center" justifyContent="center">
    <Spinner color={color} size={size} />
  </Flex>
}