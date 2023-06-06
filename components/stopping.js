import { Center, Text } from "@chakra-ui/react";
import { Spinner } from '@chakra-ui/react'

const Stopping = ({ }) => {
  return (
    <>
      <Text color={'gray.500'}>
        判定しています…
      </Text>
      <Center>
        <Spinner size='xl' />
      </Center>
    </>
  )
};

export default Stopping;
