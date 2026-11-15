import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  FiBriefcase,
  FiUsers,
  FiUserCheck,
  FiCheckCircle,
  FiPlusCircle,
} from 'react-icons/fi';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';

const EmployerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/employer/stats');
        if (data.success) setStats(data.data);
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Loader text="Loading employer analytics..." />;

  const cards = stats?.cards || {
    totalJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
    accepted: 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900">
              {stats?.company?.name || 'Employer Dashboard'}
            </h1>
            {stats?.company?.isVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                <FiCheckCircle className="h-3.5 w-3.5" />
                Verified Company
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                Pending Admin Verification
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Monitor applicant flow across your active job listings and manage candidate pipelines.
          </p>
        </div>

        <Link
          to="/employer/jobs/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
        >
          <FiPlusCircle className="h-4 w-4" />
          Post New Job
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Jobs Posted" value={cards.totalJobs} icon={FiBriefcase} color="blue" />
        <StatCard title="Total Applicants" value={cards.totalApplicants} icon={FiUsers} color="indigo" />
        <StatCard title="Shortlisted" value={cards.shortlisted} icon={FiUserCheck} color="teal" />
        <StatCard title="Accepted" value={cards.accepted} icon={FiCheckCircle} color="emerald" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Applicants per Job Post</h2>
          <p className="mb-4 text-xs text-slate-500">Comparison across your recent job openings</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.applicantsPerJob || []}>
                <XAxis dataKey="title" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="applicants" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Applications by Status</h2>
          <p className="mb-4 text-xs text-slate-500">Breakdown of candidate pipeline stages</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.applicationsByStatus || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  label
                >
                  {(stats?.applicationsByStatus || []).map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
