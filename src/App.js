import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import StreamrInterface from './Components/StreamrInterface';
import VideoUploadPage from './Components/VideoUploadPage';
import ProfilePage from './Components/ProfilePage';
import AuthPage from './Components/AuthPage';
import Navbar from './Components/Navbar';
import { ThemeProvider } from './Components/ThemeContext';
import VideoPlayerScroller from './Components/VideoPlayerScroller';

function AppContent() {
  const location = useLocation();
  // Show minimal Navbar on /auth
  const minimalNavbar = location.pathname.startsWith('/auth');
  return (
    <>
      <Navbar minimal={minimalNavbar} />
      <Routes>
        <Route path="/" element={<StreamrInterface />} />
        <Route path="/upload" element={<VideoUploadPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/video/:id" element={<VideoPlayerScroller />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
