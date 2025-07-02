import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MeetingCard from './MeetingCard';
import Spinner from './Spinner';

function MeetingList() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/meetings');
        setMeetings(res.data);
      } catch (err) {
        console.error('Error fetching meetings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  if (loading) return <Spinner/>;

  if (!meetings.length)
    return <p className="text-gray-500 italic">No meetings found. Record one!</p>;

  return (
    <div className="max-w-3xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-blue-400 mb-4">Past Meetings</h2>
      {meetings.map((meeting) => (
        <MeetingCard key={meeting._id} meeting={meeting} />
      ))}
    </div>
  );
}

export default MeetingList;
