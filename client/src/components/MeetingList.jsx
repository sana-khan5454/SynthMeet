import { useEffect, useState } from 'react';
import MeetingCardFixed from './MeetingCardFixed';
import SpinnerFixed from './SpinnerFixed';
import api from '../lib/api';

function MeetingList() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await api.get('/meetings');
        setMeetings(res.data);
      } catch (err) {
        console.error('Error fetching meetings:', err);
        setError(err.response?.data?.error || 'Unable to load meetings right now.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  if (loading) return <SpinnerFixed />;

  if (error) {
    return <p className="text-red-400">{error}</p>;
  }

  if (!meetings.length)
    return <p className="text-gray-500 italic">No meetings found. Record one!</p>;

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-4">Past Meetings</h2>
      {meetings.map((meeting) => (
        <MeetingCardFixed key={meeting._id} meeting={meeting} />
      ))}
    </div>
  );
}

export default MeetingList;
