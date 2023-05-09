import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'

const ReactMediaRecorder = dynamic(() => import('react-media-recorder').then((mod) => mod.ReactMediaRecorder), {
  ssr: false,
});


const inter = Inter({ subsets: ['latin'] })


const onStop = async (blobUrl, blob) => {
  const file = new File(
    [blob],
    'audio.mp3',
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
};

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <ReactMediaRecorder
        onStop={onStop}
        video={false}
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div>
            <button className="btn btn-green" onClick={startRecording}>Start Recording</button>
            <button className="btn btn-red" onClick={stopRecording}>Stop Recording</button>
          </div>
        )}
      />
    </main>
  )
};
