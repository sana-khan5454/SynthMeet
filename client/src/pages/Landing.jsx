import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-blue-900 text-white px-4">
      <h1 className="text-4xl font-extrabold text-blue-400 mb-4">Welcome to SynthMeet</h1>
      <p className="text-gray-300 mb-8 text-center max-w-md">
        AI-powered meeting assistant. Upload your recordings, get instant summaries and action items — all automatically.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Link
          to="/login"
          className="w-full text-center py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="w-full text-center py-2 rounded bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 font-semibold transition"
        >
          Sign Up
        </Link>
        <Link
          to="/guest"
          className="w-full text-center py-2 rounded text-blue-300 hover:text-blue-400 text-sm underline"
        >
          Continue as Guest
        </Link>
      </div>
    </div>
  );
}