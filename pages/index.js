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

export default function Home() {
  const [transcription, setTranscription] = useState();
  const [onRecording, setOnRecording] = useState(false);
  const [script, setScript ] = useState('もし俺が謝ってこられてきてたとしたら、絶対に認められてたと思うか？');

  const renderDiffOrScriptInputArea = ({ oldText, newText }) => {
    if (newText === undefined) {
      return <Textarea value={oldText} onChange={onChangeScript} />
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
        setOnRecording(true);
      }).catch((e) => {
        console.error(e);
      });
  };

  const onStopRecording = () => {
    setOnRecording(false);

    recorder
      .stop()
      .getMp3()
      .then(async ([buffer, blob]) => {
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
        <Text color={'gray.500'}>
          読み上げに挑戦するセリフを入力してください。
        </Text>
        {renderDiffOrScriptInputArea({ oldText: script, newText: transcription })}
        <div>
          {
            onRecording ?
              <Button
                onClick={onStopRecording}
                colorScheme={'red'}
                leftIcon={<Icon as={BsFillMicFill} />}
              >
                読み上げ終了
              </Button>
              : <Button
                onClick={onStartRecording}
                colorScheme={'whatsapp'}
                leftIcon={<Icon as={BsFillMicFill} />}
              >
                読み上げ開始
              </Button>
          }
        </div>
      </Stack>
    </Container>
  )
};
