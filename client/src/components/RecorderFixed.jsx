import { useEffect, useRef, useState } from 'react';
import { MicrophoneIcon, StopIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

export default function RecorderFixed({ onRecordingComplete }) {
  const [recording, setRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState(null);
  const [mediaUrl, setMediaUrl] = useState(null);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunks = useRef([]);

  useEffect(() => () => {
    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, [mediaUrl]);

  const startRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : undefined,
      });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setMediaBlob(blob);
        setMediaUrl(url);
        onRecordingComplete?.(blob);
        chunks.current = [];
        streamRef.current?.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch {
      setError('Microphone access was blocked or unavailable in this browser.');
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const downloadRecording = () => {
    if (!mediaBlob || !mediaUrl) {
      return;
    }

    const link = document.createElement('a');
    link.href = mediaUrl;
    link.download = 'recording.webm';
    link.click();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 shadow-lg mt-8">
      <h2 className="text-xl font-bold text-blue-400 mb-4">In-App Recorder</h2>

      <div className="flex items-center gap-4 mb-4">
        {!recording ? (
          <button
            type="button"
            onClick={startRecording}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <MicrophoneIcon className="w-5 h-5" />
            Start Recording
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center gap-2 transition"
          >
            <StopIcon className="w-5 h-5" />
            Stop Recording
          </button>
        )}

        {mediaBlob && (
          <button
            type="button"
            onClick={downloadRecording}
            className="bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded flex items-center gap-2 transition border border-zinc-600"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Download
          </button>
        )}
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {mediaUrl && (
        <div>
          <p className="text-sm text-gray-400 mb-2">Preview:</p>
          <audio controls src={mediaUrl} className="w-full rounded bg-zinc-800" />
        </div>
      )}
    </div>
  );
}
