import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Dashboa from './Dashboard' 

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard'); // go to dashboard after fake login
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-900 text-white px-4">
      <div className="w-full max-w-md p-8 bg-white/10 rounded-xl shadow-lg backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Login to SynthMeet</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded font-semibold"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 flex justify-between text-sm text-gray-400">
          <Link to="/signup" className="hover:underline">
            Don’t have an account? Sign Up
          </Link>
          <Link to="/guest" className="hover:underline">
            Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}
