import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      alert("Passwords don't match");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard'); // redirect to dashboard after fake signup
    }, 1000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-zinc-900 to-blue-900 text-white px-4">
      <div className="w-full max-w-md p-8 bg-white/10 rounded-xl shadow-lg backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Create Your Account</h2>

        <form onSubmit={handleSignup} className="space-y-5">
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

          <input
            type="password"
            placeholder="Confirm Password"
            required
            className="w-full px-4 py-2 rounded bg-zinc-800 border border-zinc-700 placeholder-gray-400"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded font-semibold"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-4 text-sm text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="hover:underline text-blue-300">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
