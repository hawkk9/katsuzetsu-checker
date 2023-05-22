import {Box, Container, Stack} from "@chakra-ui/react";
import Checker from "@/components/checker";

const CheckerContainer = () => {

  return (
    <Container maxW={'3xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Checker />
      </Stack>
    </Container>
  )
};

export default CheckerContainer;
