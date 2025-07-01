import { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import Toast from './Toast';
import { motion } from 'framer-motion';

export default function UploadMeeting({ initialAudio }) {
  const [title, setTitle] = useState('');
  const [audio, setAudio] = useState(initialAudio || null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  // Auto-set audio if passed from Recorder
  useEffect(() => {
    if (initialAudio) {
      setAudio(initialAudio);
    }
  }, [initialAudio]);

  const handleFileSelect = (e) => {
    setAudio(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setAudio(e.dataTransfer.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!audio) {
      setToast({ type: 'error', message: 'Please upload an audio file' });
      return;
    }

    const formData = new FormData();
    formData.append('audio', audio);
    formData.append('title', title || 'Untitled Meeting');

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/meetings', formData);
      setResult(res.data);
      setToast({ type: 'success', message: 'Meeting uploaded successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <form onSubmit={handleUpload} className="space-y-6">
        <div className="flex flex-col gap-3">
          <label htmlFor="title" className="text-sm text-gray-300 font-medium">Meeting Title</label>
          <input
            id="title"
            type="text"
            placeholder="e.g., Weekly Sync"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white placeholder:text-gray-400"
          />
        </div>

        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative w-full border-2 border-dashed border-blue-600 hover:border-blue-400 transition rounded-lg p-6 text-center cursor-pointer bg-zinc-800 group"
        >
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <CloudArrowUpIcon className="w-10 h-10 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-gray-400 text-sm">
            {audio ? audio.name || 'Recorded audio ready for upload' : 'Drag and drop or click to upload audio'}
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition py-2 px-4 rounded text-white font-semibold"
        >
          {loading ? 'Uploading...' : 'Upload & Summarize'}
        </button>
      </form>

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-10 bg-zinc-900 p-4 rounded-lg shadow space-y-4"
        >
          <h3 className="text-xl font-bold text-blue-300">Summary</h3>
          <p className="text-sm text-gray-300 whitespace-pre-line">{result.summary}</p>

          <h4 className="text-md font-semibold text-blue-200 mt-4">Tasks</h4>
          <ul className="list-disc list-inside text-sm text-gray-300">
            {result.tasks.map((task, idx) => (
              <li key={idx}>{task}</li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
}