import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './ScrollToTop';
import MainLayout from './client/layouts/MainLayout';

// Client Module Components
import Home from './client/pages/Home';
import About from './client/pages/About';
import Contact from './client/pages/Contact';
import Mission from './client/pages/Mission';
import Vision from './client/pages/Vision';
import Certificates from './client/pages/Certificates';
import Gallery from './client/pages/Gallery';
import Donate from './client/pages/Donate';

// Admin Module Components
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminCertificates from './admin/pages/AdminCertificates';
import AdminGallery from './admin/pages/AdminGallery';
import AdminLogin from './admin/pages/AdminLogin';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Client Routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="mission" element={<Mission />} />
            <Route path="vision" element={<Vision />} />
            <Route path="certificates" element={<Certificates />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="contact" element={<Contact />} />
            <Route path="donate" element={<Donate />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<RedirectToDashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/certificates"
            element={
              <ProtectedRoute>
                <AdminCertificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <ProtectedRoute>
                <AdminGallery />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

const RedirectToDashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/admin/dashboard');
  }, [navigate]);

  return null;
};

export default App;
