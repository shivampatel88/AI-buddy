import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NoteDetailPage from './pages/NoteDetailPage';

function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={true} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/note/:noteId" element={<NoteDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;