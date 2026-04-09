import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from '../utils/date';

export default function MeetingCardFixed({ meeting }) {
  const handleDownload = () => {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
    window.open(`${baseUrl}/api/meetings/${meeting._id}/export/pdf`, '_blank');
  };

  return (
    <div className="bg-zinc-900 p-4 rounded-lg mb-4 shadow hover:shadow-lg transition">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-blue-400 mb-1">{meeting.title}</h3>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {formatDistanceToNow(meeting.createdAt)}
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          PDF
        </button>
      </div>

      <p className="text-sm text-gray-300 mb-2 whitespace-pre-line">{meeting.summary}</p>

      {meeting.tasks?.length > 0 && (
        <ul className="text-sm list-disc list-inside text-gray-400">
          {meeting.tasks.map((task, idx) => (
            <li key={idx}>{task}</li>
          ))}
        </ul>
      )}

      {meeting.segments?.length > 0 && (
        <p className="mt-3 text-xs text-gray-500">
          {meeting.segments.length} timestamped transcript segments available.
        </p>
      )}
    </div>
  );
}
