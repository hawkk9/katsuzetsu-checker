import {Button, Center, Icon, Text, Textarea} from "@chakra-ui/react";
import {BsFillMicFill} from "react-icons/bs";

const Idle = ({ onChangeScript, onClickStartRecording, script }) => {

  return (
    <>
      <Text color={'gray.500'}>
        読み上げに挑戦するセリフを入力してください。
      </Text>
      <Textarea value={script} onChange={onChangeScript} />
      <Center>
        <Button
          onClick={onClickStartRecording}
          colorScheme={'whatsapp'}
          leftIcon={<Icon as={BsFillMicFill} />}
        >
          読み上げ開始
        </Button>
      </Center>
    </>
  )
};

export default Idle;
