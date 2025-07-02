import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const mockMeetings = [
  {
    title: 'Product Strategy Call',
    summary:
      'Discussed roadmap for Q2. Agreed on launching Beta by May. Prioritized bug fixes before feature rollout.',
    tasks: ['Finalize roadmap', 'Coordinate with QA', 'Schedule design review'],
  },
  {
    title: 'Marketing Team Sync',
    summary:
      'Reviewed performance of last quarter campaigns. Brainstormed content for the upcoming launch.',
    tasks: ['Analyze Facebook ROI', 'Plan influencer outreach', 'Refine email funnel'],
  },
];

export default function ExportPDF() {
  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">Export Summaries</h1>
      <p className="text-gray-400 mb-6">
        Download meeting summaries and action items as PDF files for sharing or archiving.
      </p>

      {mockMeetings.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 text-center mt-12">
          <p className="text-gray-500 mb-4">No summaries available for export yet.</p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded">
            Download Sample PDF
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {mockMeetings.map((meeting, idx) => (
            <div
              key={idx}
              className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-blue-300">{meeting.title}</h2>
                <button className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
              <p className="text-gray-300 text-sm mb-3">{meeting.summary}</p>
              <ul className="list-disc list-inside text-gray-400 text-sm">
                {meeting.tasks.map((task, i) => (
                  <li key={i}>{task}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
