import {Button, Center, HStack, Icon, Text, Textarea} from "@chakra-ui/react";
import {useState} from "react";
import {BsFillMicFill} from "react-icons/bs";
import {AiFillEdit} from "react-icons/ai";
import ReactDiffViewer from "react-diff-viewer-continued";
import MicRecorder from "mic-recorder-to-mp3";
import Idle from "@/components/idle";
import {RecordStatus} from "@/lib/constants"
import Recording from "@/components/recording";

const recorder = new MicRecorder({
  bitRate: 128
});
const canStartStatuses = ['idle', 'stopped'];
const recordStatusInstructionMap = {
  'idle': '読み上げに挑戦するセリフを入力してください。',
  'recording': 'セリフを読み上げてください。',
  'stopped': '結果です！',
};

const Checker = () => {
  const [transcription, setTranscription] = useState(null);
  const [recordStatus, setRecordStatus] = useState(RecordStatus.idle);
  const [script, setScript ] = useState('もし俺が謝ってこられてきてたとしたら、絶対に認められてたと思うか？');

  const onChangeScript = (e) => {
    setScript(e.target.value);
  };

  const renderInstructionText = ({ recordStatus }) => {
    const instruction = recordStatusInstructionMap[recordStatus];
    return (
      <Text color={'gray.500'}>
        {instruction}
      </Text>
    )
  }

  const renderDiffOrScriptInputArea = ({ recordStatus, oldText, newText }) => {
    if (newText === null) {
      return <Textarea value={oldText} onChange={onChangeScript} isReadOnly={recordStatus === RecordStatus.recording} />
    }
    return <ReactDiffViewer
      oldValue={oldText}
      newValue={newText}
      splitView={true}
      showDiffOnly={false}
      hideLineNumbers={true}
    />
  }

  const onClickStartRecording = () => {
    recorder
      .start()
      .then(() => {
        setTranscription(null);
        setRecordStatus(RecordStatus.recording);
      }).catch((e) => {
      console.error(e);
    });
  };

  const onClickStopRecording = () => {
    recorder
      .stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
        setRecordStatus(RecordStatus.stopped);
        const file = new File(buffer, 'voice.mp3', {
          type: blob.type,
          lastModified: Date.now()
        });

        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(
          '/api/transcription',
          {
            method: 'POST',
            body: formData,
          }
        );
        const json = await response.json();
        setTranscription(json.transcription);
      }).catch((e) => {
      console.error(e);
    });
  };

  const onClickEditScript = () => {
    setRecordStatus(RecordStatus.idle);
    setTranscription(null);
  };

  switch (recordStatus) {
    case  RecordStatus.idle:
      return <Idle onChangeScript={onChangeScript} onClickStartRecording={onClickStartRecording} script={script} />
    case RecordStatus.recording:
      return <Recording onClickStopRecording={onClickStopRecording} script={script} />
  }

  return (
    <>
      {renderInstructionText({ recordStatus })}
      {renderDiffOrScriptInputArea({ recordStatus, oldText: script, newText: transcription })}
      <Center>
        <HStack spacing='24px'>
          {
            canStartStatuses.includes(recordStatus) ?
              <Button
                onClick={onClickStartRecording}
                colorScheme={'whatsapp'}
                leftIcon={<Icon as={BsFillMicFill} />}
              >
                読み上げ開始
              </Button>
              :
              <Button
                onClick={onClickStopRecording}
                colorScheme={'red'}
                leftIcon={<Icon as={BsFillMicFill} />}
              >
                読み上げ終了
              </Button>
          }
          {recordStatus === RecordStatus.stopped ?
            <Button
              onClick={onClickEditScript}
              leftIcon={<Icon as={AiFillEdit} />}
            >
              セリフ変更
            </Button> : null}
        </HStack>
      </Center>
    </>
  )
};

export default Checker;
