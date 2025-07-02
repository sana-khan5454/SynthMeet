import { useState } from 'react';
import Recorder from '../components/Recorder';
import UploadMeeting from '../components/UploadMeeting';

export default function RecorderPage() {
  const [audio, setAudio] = useState(null);

  const handleRecordingComplete = (blob) => {
    const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
    setAudio(file);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Record &amp; Upload</h1>
      <Recorder onRecordingComplete={handleRecordingComplete} />
      <div className="mt-8">
        <UploadMeeting initialAudio={audio} />
      </div>
    </div>
  );
}
