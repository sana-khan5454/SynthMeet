import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Guest from './pages/Guest';
import Landing from './pages/Landing';
import Search from './pages/Search';
import Settings from './pages/Settings';
import ExportPDF from './pages/ExportPDF';
import RecorderPage from './pages/RecorderPage';

export default function App() {
  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-white">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/guest" element={<Guest />} />
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/history" element={<History />} />
            <Route path="/search" element={<Search />} />
             <Route path="/record" element={<RecorderPage />} />
            <Route path="/export" element={<ExportPDF />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
  </div>
  );
}
