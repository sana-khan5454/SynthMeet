import { useEffect, useRef, useState } from 'react';
import { MicrophoneIcon, StopIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function Recorder({ onRecordingComplete }) {
  const [recording, setRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setMediaBlob(blob);
        setMediaUrl(url);
        onRecordingComplete?.(blob);
        chunks.current = [];
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (err) {
      alert("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const downloadRecording = () => {
    if (!mediaBlob) return;
    const a = document.createElement('a');
    a.href = mediaUrl;
    a.download = 'recording.webm';
    a.click();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-lg mt-8">
      <h2 className="text-xl font-bold text-blue-400 mb-4">In-App Recorder</h2>

      <div className="flex items-center gap-4 mb-4">
        {!recording ? (
          <button
            onClick={startRecording}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <MicrophoneIcon className="w-5 h-5" />
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <StopIcon className="w-5 h-5" />
            Stop Recording
          </button>
        )}

        {mediaBlob && (
          <button
            onClick={downloadRecording}
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded flex items-center gap-2 transition border border-zinc-600"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Download
          </button>
        )}
      </div>

      {mediaUrl && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Preview:</p>
          <audio controls src={mediaUrl} className="w-full rounded bg-zinc-800" />
        </div>
      )}
    </div>
  );
}