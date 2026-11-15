import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText,
  FiBookmark,
  FiCheckCircle,
  FiClock,
  FiUserCheck,
} from 'react-icons/fi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appRes, savedRes, profRes] = await Promise.all([
          api.get('/applications/mine'),
          api.get('/saved'),
          api.get('/profile'),
        ]);
        if (appRes.data.success) setApplications(appRes.data.data);
        if (savedRes.data.success) setSavedJobs(savedRes.data.data);
        if (profRes.data.success) setProfile(profRes.data.data);
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <Loader text="Loading your dashboard..." />;

  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const accepted = applications.filter((a) => a.status === 'Accepted').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Welcome, {user?.name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {profile?.headline || 'Complete your profile and upload your resume for 1-click applications.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/seeker/profile"
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Edit Profile & CV
          </Link>
          <Link
            to="/jobs"
            className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Find Jobs
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Applied"
          value={applications.length}
          icon={FiFileText}
          color="blue"
        />
        <StatCard
          title="Shortlisted"
          value={shortlisted}
          icon={FiUserCheck}
          color="teal"
        />
        <StatCard
          title="Accepted Offers"
          value={accepted}
          icon={FiCheckCircle}
          color="emerald"
        />
        <StatCard
          title="Saved Jobs"
          value={savedJobs.length}
          icon={FiBookmark}
          color="amber"
        />
      </div>

      {/* Resume Alert if missing */}
      {!profile?.resumePath && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <span>
            Note: You have not uploaded a Resume/CV yet. Upload a PDF/DOCX resume to enable 1-click job applications!
          </span>
          <Link
            to="/seeker/profile"
            className="rounded-xl bg-amber-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-amber-700"
          >
            Upload CV
          </Link>
        </div>
      )}

      {/* Recent Applications */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
          <Link to="/seeker/applications" className="text-xs font-semibold text-blue-600 hover:underline">
            View All History
          </Link>
        </div>

        {applications.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500">
            You haven&apos;t applied to any jobs yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                  <th className="pb-3 font-semibold">Role</th>
                  <th className="pb-3 font-semibold">Company</th>
                  <th className="pb-3 font-semibold">Applied Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.slice(0, 5).map((app) => (
                  <tr key={app._id}>
                    <td className="py-3.5 font-semibold text-slate-900">
                      <Link to={`/jobs/${app.job?._id}`} className="hover:text-blue-600">
                        {app.job?.title || 'Job Listing'}
                      </Link>
                    </td>
                    <td className="py-3.5 text-slate-600">{app.job?.company?.name || 'Company'}</td>
                    <td className="py-3.5 text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <FiClock className="h-3.5 w-3.5" />
                        {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <StatusBadge status={app.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerDashboard;
