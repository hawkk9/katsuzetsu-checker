import {Button, Center, Icon, Text, Textarea} from "@chakra-ui/react";
import {BsFillMicFill} from "react-icons/bs";

const Recording = ({ onClickStopRecording, script }) => {

  return (
    <>
      <Text color={'gray.500'}>
        セリフを読み上げてください。
      </Text>
      <Textarea value={script} />
      <Center>
        <Button
          onClick={onClickStopRecording}
          colorScheme={'red'}
          leftIcon={<Icon as={BsFillMicFill} />}
        >
          読み上げ終了
        </Button>
      </Center>
    </>
  )
};

export default Recording;
