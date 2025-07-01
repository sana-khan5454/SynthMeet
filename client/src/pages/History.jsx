export default function History() {
  const meetings = []; // Replace with real data from backend later

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold text-blue-400 mb-2">Meeting History</h1>
      <p className="text-gray-400 mb-6">Review summaries of past meetings and their key takeaways.</p>

      {meetings.length === 0 ? (
        <div className="text-center mt-16">
          <img src="https://cdn-icons-png.flaticon.com/512/4725/4725577.png" alt="No meetings" className="w-24 h-24 mx-auto opacity-50 mb-4" />
          <p className="text-gray-500 text-sm">No meetings found. Start by uploading or recording one.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {meetings.map((m) => (
            <div key={m._id} className="bg-zinc-900 p-4 rounded-lg border border-zinc-700 shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-blue-300">{m.title}</h3>
              <p className="text-sm text-gray-400 mt-2 line-clamp-3">{m.summary}</p>
              <button className="mt-4 text-sm text-blue-400 hover:underline">View Details</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}