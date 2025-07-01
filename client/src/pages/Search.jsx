import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function Search() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // TEMP: Static matches (for UI demo)
    setResult({
      matches: [
        {
          text: "Let's finalize the Q2 marketing roadmap by Friday.",
          timestamp: '00:03:12',
        },
        {
          text: 'Can someone schedule a follow-up with the design team?',
          timestamp: '00:12:48',
        },
      ],
    });
  };

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">Search Transcript</h1>
      <p className="text-gray-400 mb-6">Search for any phrase spoken during a meeting and jump directly to that timestamp.</p>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative max-w-xl mb-10">
        <input
          type="text"
          placeholder="Search for a keyword or phrase..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 pr-10 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2">
          <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </form>

      {/* Search Results */}
      {!result && (
        <div className="text-gray-500 text-sm italic text-center">
          (This will be enabled once timestamped transcription is implemented.)
        </div>
      )}

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-blue-300">
            Found {result.matches.length} matching lines
          </h3>

          {result.matches.map((item, index) => (
            <div
              key={index}
              className="flex items-start justify-between bg-zinc-900 border border-zinc-700 rounded-lg p-4 hover:bg-zinc-800 transition"
            >
              <p className="text-sm text-gray-200 max-w-lg">{item.text}</p>
              <span className="text-blue-400 text-xs font-mono">{item.timestamp}</span>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
