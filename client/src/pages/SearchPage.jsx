import { useMemo, useRef, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import SpinnerFixed from '../components/SpinnerFixed';
import api from '../lib/api';

const MotionDiv = motion.div;

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const audioRefs = useRef({});

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setHasSearched(true);
      setError('');
      const res = await api.get('/meetings/search', {
        params: { q: query },
      });
      setResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
      setError(err.response?.data?.error || 'Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const normalizedQuery = useMemo(() => query.trim(), [query]);

  const jumpToTimestamp = (meetingId, seconds) => {
    const audio = audioRefs.current[meetingId];
    if (!audio) {
      return;
    }

    audio.currentTime = seconds;
    audio.play().catch(() => null);
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">Search Transcript</h1>
      <p className="text-gray-400 mb-6">Search for any phrase spoken during a meeting and jump directly to that timestamp.</p>

      <form onSubmit={handleSearch} className="relative max-w-xl mb-10">
        <input
          type="text"
          placeholder="Search for a keyword or phrase..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 pr-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </form>

      {loading && <SpinnerFixed />}

      {!loading && error && (
        <div className="mb-6 text-sm text-red-400">{error}</div>
      )}

      {!loading && hasSearched && !error && results.length === 0 && normalizedQuery && (
        <div className="text-gray-500 text-sm italic text-center">
          No matches found.
        </div>
      )}

      {!loading && results.length > 0 && (
        <MotionDiv
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {results.map((meeting) => (
            <div
              key={meeting._id}
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 hover:bg-zinc-800 transition"
            >
              <h3 className="text-lg font-semibold text-blue-300 mb-1">{meeting.title}</h3>
              <p className="mb-3 text-sm text-gray-300 whitespace-pre-line">{meeting.summary}</p>

              {meeting.audioUrl && (
                <audio
                  controls
                  className="mb-4 w-full"
                  src={meeting.audioUrl}
                  ref={(node) => {
                    if (node) {
                      audioRefs.current[meeting._id] = node;
                    }
                  }}
                />
              )}

              {meeting.matches?.length > 0 ? (
                <div className="space-y-3">
                  {meeting.matches.map((match, index) => (
                    <button
                      key={`${meeting._id}-${index}`}
                      type="button"
                      onClick={() => jumpToTimestamp(meeting._id, match.start)}
                      className="block w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-left transition hover:border-blue-500"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-300">
                        {match.timestamp}
                      </p>
                      <p className="mt-1 text-sm text-gray-300">{match.text}</p>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Transcript text matched, but no timestamped segment was available.</p>
              )}
            </div>
          ))}
        </MotionDiv>
      )}
    </div>
  );
}
