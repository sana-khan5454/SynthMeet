import { Link, useLocation } from 'react-router-dom';
import { useAvatar } from '../context/AvatarContext';
import defaultAvatar from '../assets/default-avatar.png';

const navItemClass = (path, current) =>
  `block px-4 py-3 rounded hover:bg-blue-600 transition ${
    current === path ? 'bg-blue-700 text-white font-semibold' : 'text-gray-300'
  }`;

export default function Sidebar() {
  const location = useLocation();
  const { avatar } = useAvatar(); // 👈 pull avatar from shared context

  return (
    <aside className="w-64 bg-[#111] border-r border-zinc-800 p-4 min-h-screen flex flex-col">
      {/* Profile Picture */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500 mb-2">
          <img
            src={avatar || defaultAvatar}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <h1 className="text-lg font-semibold text-blue-400">SynthMeet</h1>
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        <Link to="/dashboard" className={navItemClass('/dashboard', location.pathname)}>Dashboard</Link>
        <Link to="/history" className={navItemClass('/history', location.pathname)}>Meeting History</Link>
        <Link to="/search" className={navItemClass('/search', location.pathname)}>Search Transcript</Link>
        <Link to="/record" className={navItemClass('/record', location.pathname)}>Record Audio</Link>
        <Link to="/export" className={navItemClass('/export', location.pathname)}>Export to PDF</Link>
        <Link to="/settings" className={navItemClass('/settings', location.pathname)}>Settings</Link>
      </nav>
    </aside>
  );
}
