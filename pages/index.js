import { useState } from 'react';
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import ReactDiffViewer from 'react-diff-viewer-continued';

const ReactMediaRecorder = dynamic(() => import('react-media-recorder').then((mod) => mod.ReactMediaRecorder), {
  ssr: false,
});


const inter = Inter({ subsets: ['latin'] })



export default function Home() {
  const [transcription, setTranscription] = useState();
  const [script, setScript ] = useState('隣の客はよく柿食う客だ');

  const renderDiffOrScriptInputArea = ({ oldText, newText }) => {
    if (newText === undefined) {
      return <textarea value={oldText} onChange={onChangeScript} />
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
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div>
        {renderDiffOrScriptInputArea({ oldText: script, newText: transcription })}
        <ReactMediaRecorder
          onStop={onStopRecord}
          video={false}
          render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
            <div>
              <button className="btn btn-green" onClick={startRecording}>Start Recording</button>
              <button className="btn btn-red" onClick={stopRecording}>Stop Recording</button>
            </div>
          )}
        />
      </div>
    </main>
  )
};
