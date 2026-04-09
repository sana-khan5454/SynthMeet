import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HeaderFixed from './components/HeaderFixed';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import LogInPage from './pages/LogInPage';
import SignUpPage from './pages/SignUpPage';
import GuestPage from './pages/GuestPage';
import LandingPage from './pages/LandingPage';
import SearchPage from './pages/SearchPage';
import Settings from './pages/Settings';
import ExportPDFPage from './pages/ExportPDFPage';
import RecorderPage from './pages/RecorderPage';

export default function App() {
  return (
    <div className="flex min-h-screen bg-[#0D0D0D] text-white">
      <Sidebar />
      <div className="flex-1">
        <HeaderFixed />
        <main className="p-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LogInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/guest" element={<GuestPage />} />
            <Route path="/dashboard" element={<Dashboard />}/>
            <Route path="/history" element={<History />} />
            <Route path="/search" element={<SearchPage />} />
             <Route path="/record" element={<RecorderPage />} />
            <Route path="/export" element={<ExportPDFPage />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
  </div>
  );
}
