import { useEffect, useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import SpinnerFixed from '../components/SpinnerFixed';
import api from '../lib/api';

export default function ExportPDFPage() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await api.get('/meetings');
        setMeetings(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load meetings for export.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const handleDownload = async (meeting) => {
    try {
      setDownloadingId(meeting._id);
      const res = await api.get(`/meetings/${meeting._id}/export/pdf`, {
        responseType: 'blob',
      });
      const blobUrl = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${meeting.title}.pdf`;
      link.click();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      setError(err.response?.data?.error || 'PDF export failed.');
    } finally {
      setDownloadingId('');
    }
  };

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">Export Summaries</h1>
      <p className="text-gray-400 mb-6">
        Download meeting summaries and action items as PDF files for sharing or archiving.
      </p>

      {loading && <SpinnerFixed />}

      {!loading && error && <p className="mb-6 text-sm text-red-400">{error}</p>}

      {!loading && meetings.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 text-center mt-12">
          <p className="text-gray-500 mb-4">No summaries available for export yet.</p>
        </div>
      ) : !loading ? (
        <div className="grid gap-6">
          {meetings.map((meeting) => (
            <div
              key={meeting._id}
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-blue-300">{meeting.title}</h2>
                <button
                  type="button"
                  onClick={() => handleDownload(meeting)}
                  disabled={downloadingId === meeting._id}
                  className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  {downloadingId === meeting._id ? 'Preparing...' : 'Download PDF'}
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-3">{meeting.summary}</p>
              {meeting.tasks?.length > 0 && (
                <ul className="list-disc list-inside text-gray-400 text-sm">
                  {meeting.tasks.map((task, i) => (
                    <li key={i}>{task}</li>
                  ))}
                </ul>
              )}
              {meeting.sections?.length > 0 && (
                <p className="mt-3 text-xs text-gray-500">
                  Includes {meeting.sections.length} timestamped section{meeting.sections.length === 1 ? '' : 's'}.
                </p>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
