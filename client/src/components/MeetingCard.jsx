export default function MeetingCard({ meeting }) {
    return (
      <div className="bg-zinc-900 p-4 rounded-lg mb-4 shadow hover:shadow-lg transition">
        <h3 className="text-lg font-bold text-blue-400 mb-1">{meeting.title}</h3>
        <p className="text-sm text-gray-300 mb-2">{meeting.summary}</p>
        {meeting.tasks?.length>0&&(
        <ul className="text-sm list-disc list-inside text-gray-400">
          {meeting.tasks.map((task, idx) => (
            <li key={idx}>{task}</li>
          ))}
        </ul>
        )}
      </div>
    );
  }