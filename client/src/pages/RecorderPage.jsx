import { useState } from 'react';
import RecorderFixed from '../components/RecorderFixed';
import UploadMeetingFixed from '../components/UploadMeetingFixed';

export default function RecorderPage() {
  const [audio, setAudio] = useState(null);

  const handleRecordingComplete = (blob) => {
    const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
    setAudio(file);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Record &amp; Upload</h1>
      <RecorderFixed onRecordingComplete={handleRecordingComplete} />
      <div className="mt-8">
        <UploadMeetingFixed initialAudio={audio} />
      </div>
    </div>
  );
}
