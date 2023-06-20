import {Box, Container, Stack} from "@chakra-ui/react";
import Checker from "@/components/checker";
import {MarkGithubIcon} from '@primer/octicons-react'

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
      <Stack
        as={Box}
        textAlign={'center'}
      >
        <a href='https://github.com/hawkk9/katsuzetsu-checker' target='_blank'>
          <MarkGithubIcon size={24} />
        </a>
      </Stack>
    </Container>
  )
};

export default CheckerContainer;
