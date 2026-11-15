import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import Jobs from './pages/public/Jobs';
import JobDetails from './pages/public/JobDetails';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import NotFound from './pages/public/NotFound';

// Job Seeker Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard';
import SeekerProfile from './pages/seeker/SeekerProfile';
import SeekerApplications from './pages/seeker/SeekerApplications';
import SeekerSaved from './pages/seeker/SeekerSaved';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerCompany from './pages/employer/EmployerCompany';
import EmployerJobs from './pages/employer/EmployerJobs';
import EmployerJobForm from './pages/employer/EmployerJobForm';
import EmployerJobApplicants from './pages/employer/EmployerJobApplicants';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEmployers from './pages/admin/AdminEmployers';
import AdminJobs from './pages/admin/AdminJobs';

const App = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Job Seeker Protected Routes */}
          <Route
            path="/seeker"
            element={
              <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<SeekerDashboard />} />
            <Route path="profile" element={<SeekerProfile />} />
            <Route path="applications" element={<SeekerApplications />} />
            <Route path="saved" element={<SeekerSaved />} />
          </Route>

          {/* Employer Protected Routes */}
          <Route
            path="/employer"
            element={
              <ProtectedRoute allowedRoles={['EMPLOYER']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<EmployerDashboard />} />
            <Route path="company" element={<EmployerCompany />} />
            <Route path="jobs" element={<EmployerJobs />} />
            <Route path="jobs/new" element={<EmployerJobForm />} />
            <Route path="jobs/:id/edit" element={<EmployerJobForm />} />
            <Route path="jobs/:id/applicants" element={<EmployerJobApplicants />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="employers" element={<AdminEmployers />} />
            <Route path="jobs" element={<AdminJobs />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
