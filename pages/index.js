import { useState } from 'react';
import ReactDiffViewer from 'react-diff-viewer-continued';
import { BsFillMicFill } from 'react-icons/bs'
import {
  Box,
  Container,
  Textarea,
  Button,
  Stack,
  Icon,
  Text,
} from '@chakra-ui/react';
import MicRecorder from 'mic-recorder-to-mp3';
const recorder = new MicRecorder({
  bitRate: 128
});

const recordStatuses = {
  idle: 'idle',
  recording: 'recording',
  stopped: 'stopped',
};
const canStartStatuses = ['idle', 'stopped'];
const recordStatusInstructionMap = {
  'idle': '読み上げに挑戦するセリフを入力してください。',
  'recording': 'セリフを読み上げてください。',
  'stopped': '結果です！',
}

export default function Home() {
  const [transcription, setTranscription] = useState(null);
  const [recordStatus, setRecordStatus] = useState(recordStatuses.idle);
  const [script, setScript ] = useState('もし俺が謝ってこられてきてたとしたら、絶対に認められてたと思うか？');

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
      return <Textarea value={oldText} onChange={onChangeScript} isReadOnly={recordStatus === recordStatuses.recording} />
    }
    return <ReactDiffViewer
      oldValue={oldText}
      newValue={newText}
      splitView={true}
      showDiffOnly={false}
      hideLineNumbers={true}
    />
  }

  const onStartRecording = () => {
    recorder
      .start()
      .then(() => {
        setTranscription(null);
        setRecordStatus(recordStatuses.recording);
      }).catch((e) => {
        console.error(e);
      });
  };

  const onStopRecording = () => {

    recorder
      .stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
        setRecordStatus(recordStatuses.stopped);
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
  const onChangeScript = (e) => {
    setScript(e.target.value);
  };

  return (
    <Container maxW={'3xl'}>
      <Stack
        as={Box}
        textAlign={'center'}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}>
        {renderInstructionText({ recordStatus })}
        {renderDiffOrScriptInputArea({ recordStatus, oldText: script, newText: transcription })}
        <div>
          {
            canStartStatuses.includes(recordStatus) ?
              <Button
                onClick={onStartRecording}
                colorScheme={'whatsapp'}
                leftIcon={<Icon as={BsFillMicFill} />}
              >
                読み上げ開始
              </Button>
              : <Button
                onClick={onStopRecording}
                colorScheme={'red'}
                leftIcon={<Icon as={BsFillMicFill} />}
              >
                読み上げ終了
              </Button>
          }
        </div>
      </Stack>
    </Container>
  )
};
