import { useState } from 'react';␊
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';␊
import axios from 'axios';
import Spinner from '../components/Spinner';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/meetings/search', {
        params: { q: query },
      });
      setResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
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
      {loading && <Spinner />}

      {!loading && results.length === 0 && (
        <div className="text-gray-500 text-sm italic text-center">
          No matches found.
        </div>
      )}

      {!loading && results.length > 0 && (
        <motion.div
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
              <p className="text-sm text-gray-300 line-clamp-3">{meeting.summary}</p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

server/controllers/
