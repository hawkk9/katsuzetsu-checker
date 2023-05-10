import { useState } from 'react';
import dynamic from 'next/dynamic';
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

const ReactMediaRecorder = dynamic(() => import('react-media-recorder').then((mod) => mod.ReactMediaRecorder), {
  ssr: false,
});

const canStartStatuses = ['idle', 'stopped'];


export default function Home() {
  const [transcription, setTranscription] = useState();
  const [script, setScript ] = useState('隣の客はよく柿食う客だ');

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

  const onStopRecord = async (blobUrl, blob) => {
    const file = new File(
      [blob],
      'voice.mp3',
      { type: blob.type }
    );

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
          読み上げに挑戦する言葉を入力してください。
        </Text>
        {renderDiffOrScriptInputArea({ oldText: script, newText: transcription })}
        <ReactMediaRecorder
          onStop={onStopRecord}
          video={false}
          render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
            <div>
              {
                canStartStatuses.includes(status) ?
                  <Button
                    onClick={startRecording}
                    colorScheme={'whatsapp'}
                    leftIcon={<Icon as={BsFillMicFill} />}
                  >
                    読み上げ開始
                  </Button>
                  : <Button
                    onClick={stopRecording}
                    colorScheme={'red'}
                    leftIcon={<Icon as={BsFillMicFill} />}
                  >
                    読み上げ終了
                  </Button>
              }
            </div>
          )}
        />
      </Stack>
    </Container>
  )
};
