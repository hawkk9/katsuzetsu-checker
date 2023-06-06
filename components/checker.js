import {useState} from "react";
import MicRecorder from "mic-recorder-to-mp3";
import Idle from "@/components/idle";
import {RecordStatus} from "@/lib/constants"
import Recording from "@/components/recording";
import Stopped from "@/components/stopped";
import Stopping from "@/components/stopping";

const recorder = new MicRecorder({
  bitRate: 128
});

const Checker = () => {
  const [transcription, setTranscription] = useState(null);
  const [recordStatus, setRecordStatus] = useState(RecordStatus.idle);
  const [script, setScript ] = useState('もし俺が謝ってこられてきてたとしたら、絶対に認められてたと思うか？');

  const onChangeScript = (e) => {
    setScript(e.target.value);
  };

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
        setRecordStatus(RecordStatus.stopping);
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
        setRecordStatus(RecordStatus.stopped);
      }).catch((e) => {
      console.error(e);
    });
  };

  const onClickEditScript = () => {
    setRecordStatus(RecordStatus.idle);
    setTranscription(null);
  };

  switch (recordStatus) {
    case RecordStatus.idle:
      return <Idle onChangeScript={onChangeScript} onClickStartRecording={onClickStartRecording} script={script} />
    case RecordStatus.recording:
      return <Recording onClickStopRecording={onClickStopRecording} script={script} />
    case RecordStatus.stopping:
      return <Stopping />
    case RecordStatus.stopped:
      return <Stopped onClickEditScript={onClickEditScript} onClickStartRecording={onClickStartRecording} script={script} transcription={transcription} />
  }
};

export default Checker;
