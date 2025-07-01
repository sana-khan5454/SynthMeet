import { useState } from 'react';
import { useAvatar } from '../context/AvatarContext';

export default function Settings() {
  const { setAvatar } = useAvatar();

  const [preview, setPreview] = useState(localStorage.getItem('avatar') || '');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setAvatar(url);                 // update context
      localStorage.setItem('avatar', url); // persist on reload
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      name,
      email,
      currentPassword,
      newPassword,
      confirmPassword,
    });
  };

  return (
    <div className="p-6 text-white max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">Settings</h1>
      <p className="text-gray-400 mb-6">Update your profile, photo, and password here.</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Profile Picture</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">N/A</div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileChange}
              className="text-sm text-gray-300"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm text-gray-300 mb-1">Your Name</label>
          <input
            type="text"
            id="name"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm text-gray-300 mb-1">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Password Section */}
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-300">Change Password</h3>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white placeholder:text-gray-500"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white placeholder:text-gray-500"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white placeholder:text-gray-500"
          />
        </div>

        {/* Submit */}
        <div className="text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
