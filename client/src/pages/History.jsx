import MeetingList from '../components/MeetingList';

export default function History() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">Meeting History</h1>
      <p className="text-gray-400 mb-6">Review summaries of past meetings and their key takeaways.</p>
      <MeetingList />
    </div>
  );
}
