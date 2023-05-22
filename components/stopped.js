import {Button, Center, HStack, Icon, Text, Textarea} from "@chakra-ui/react";
import {BsFillMicFill} from "react-icons/bs";
import {AiFillEdit} from "react-icons/ai";
import ReactDiffViewer from "react-diff-viewer-continued";

const Stopped = ({ onClickEditScript, onClickStartRecording, script, transcription }) => {
  if (transcription === null) {
    return <></>
  }
  return (
    <>
      <Text color={'gray.500'}>
        結果です！
      </Text>
      <ReactDiffViewer
        oldValue={script}
        newValue={transcription}
        splitView={true}
        showDiffOnly={false}
        hideLineNumbers={true}
      />
      <Center>
        <HStack spacing='24px'>
          <Button
            onClick={onClickStartRecording}
            colorScheme={'whatsapp'}
            leftIcon={<Icon as={BsFillMicFill} />}
          >
            読み上げ開始
          </Button>
          <Button
            onClick={onClickEditScript}
            leftIcon={<Icon as={AiFillEdit} />}
          >
            セリフ変更
          </Button>
        </HStack>
      </Center>
    </>
  )
};

export default Stopped;
