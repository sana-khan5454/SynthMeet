import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Guest() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const enterAsGuest = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem('user', 'guest');
      navigate('/');
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-900 text-white px-4">
      <div className="w-full max-w-md p-8 bg-white/10 rounded-xl shadow-lg backdrop-blur-md text-center">
        <h2 className="text-3xl font-bold mb-4 text-blue-400">Continue as Guest</h2>
        <p className="mb-6 text-gray-300 text-sm">You won’t need an account — just explore the features!</p>

        <button
          onClick={enterAsGuest}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded font-semibold"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Enter as Guest'}
        </button>
      </div>
    </div>
  );
}
