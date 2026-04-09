import { useEffect, useState } from 'react';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import ToastFixed from './ToastFixed';
import api from '../lib/api';

const maxFileSize = 25 * 1024 * 1024;
const MotionDiv = motion.div;
const supportedTypes = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/webm',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
  'audio/ogg',
  'audio/flac',
  'audio/x-flac',
];

export default function UploadMeetingFixed({ initialAudio }) {
  const [title, setTitle] = useState('');
  const [audio, setAudio] = useState(initialAudio || null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (initialAudio) {
      setAudio(initialAudio);
      if (!title) {
        const inferredTitle = initialAudio.name?.replace(/\.[^.]+$/, '').trim();
        setTitle(inferredTitle || '');
      }
    }
  }, [initialAudio, title]);

  const validateAudio = (file) => {
    if (!file) {
      return 'Please choose an audio file to continue.';
    }

    if (!supportedTypes.includes(file.type) && !file.type.startsWith('audio/')) {
      return 'Unsupported format. Please use MP3, WAV, M4A, OGG, FLAC, MP4, or WEBM audio.';
    }

    if (file.size > maxFileSize) {
      return 'Audio files must be 25MB or smaller.';
    }

    return null;
  };

  const applySelectedFile = (file) => {
    const validationError = validateAudio(file);
    if (validationError) {
      setToast({ type: 'error', message: validationError });
      return;
    }

    setAudio(file);
    setResult(null);
  };

  const handleFileSelect = (event) => {
    applySelectedFile(event.target.files?.[0]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    applySelectedFile(event.dataTransfer.files?.[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    const validationError = validateAudio(audio);
    if (validationError) {
      setToast({ type: 'error', message: validationError });
      return;
    }

    const formData = new FormData();
    formData.append('audio', audio);
    formData.append('title', title || 'Untitled Meeting');

    try {
      setLoading(true);
      const res = await api.post('/meetings', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(res.data);
      setToast({ type: 'success', message: 'Meeting uploaded successfully.' });
    } catch (err) {
      setToast({
        type: 'error',
        message: err.response?.data?.error || 'Upload failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {toast && <ToastFixed {...toast} onClose={() => setToast(null)} />}

      <form onSubmit={handleUpload} className="space-y-6">
        <div className="flex flex-col gap-3">
          <label htmlFor="title" className="text-sm text-gray-300 font-medium">Meeting Title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g., Weekly Sync"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white placeholder:text-gray-400"
          />
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          className="relative w-full border-2 border-dashed border-blue-600 hover:border-blue-400 transition rounded-lg p-6 text-center cursor-pointer bg-zinc-800 group"
        >
          <input
            type="file"
            accept="audio/*,.mp3,.wav,.m4a,.ogg,.flac,.webm,.mp4"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <CloudArrowUpIcon className="w-10 h-10 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-gray-400 text-sm">
            {audio ? audio.name || 'Recorded audio ready for upload' : 'Drag and drop or click to upload audio'}
          </p>
          <p className="mt-2 text-xs text-gray-500">Supports MP3, WAV, M4A, OGG, FLAC, MP4, and WEBM up to 25MB.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 px-4 rounded text-white font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Uploading...' : 'Upload & Summarize'}
        </button>
      </form>

      {result && (
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-zinc-900 p-4 rounded-lg shadow space-y-4"
        >
          <h3 className="text-xl font-bold text-blue-300">Summary</h3>
          <p className="text-sm text-gray-300 whitespace-pre-line">{result.summary}</p>

          <h4 className="text-md font-semibold text-blue-200 mt-4">Tasks</h4>
          {result.tasks?.length ? (
            <ul className="list-disc list-inside text-sm text-gray-300">
              {result.tasks.map((task, idx) => (
                <li key={idx}>{task}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No action items were detected for this meeting.</p>
          )}

          {result.sections?.length > 0 && (
            <>
              <h4 className="text-md font-semibold text-blue-200 mt-4">Timeline Sections</h4>
              <div className="space-y-3">
                {result.sections.map((section, idx) => (
                  <div key={`${section.title}-${idx}`} className="rounded border border-zinc-700 bg-zinc-800/60 p-3">
                    <p className="text-sm font-semibold text-white">{section.title}</p>
                    <p className="mt-1 text-sm text-gray-400">{section.overview}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </MotionDiv>
      )}
    </div>
  );
}
