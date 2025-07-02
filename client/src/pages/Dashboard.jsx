import UploadMeeting from '../components/UploadMeeting';
import Recorder from '../components/Recorder';
import { MicrophoneIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const handleRecordingComplete = (blob) => {
    console.log("Audio recorded:", blob);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-400">Welcome to SynthMeet</h1>
          <p className="text-gray-400 mt-3 text-lg">Upload or record your meetings and get instant summaries with action items.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg min-h-[500px] flex flex-col justify-start">
            <div className="flex items-center gap-3 mb-6">
              <ArrowUpTrayIcon className="w-7 h-7 text-blue-500" />
              <h2 className="text-2xl font-semibold text-white">Upload a Meeting</h2>
            </div>
            <UploadMeeting />
          </div>

          {/* Recorder Section */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-lg min-h-[500px] flex flex-col justify-start">
            <div className="flex items-center gap-3 mb-6">
              <MicrophoneIcon className="w-7 h-7 text-blue-500" />
              <h2 className="text-2xl font-semibold text-white">Record a Meeting</h2>
            </div>
            <Recorder onRecordingComplete={handleRecordingComplete} />
          </div>
        </div>
      </div>
    </div>
  );
}
