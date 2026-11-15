import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  FiUsers,
  FiBriefcase,
  FiFileText,
  FiCheckCircle,
  FiUserCheck,
} from 'react-icons/fi';
import api from '../../services/api';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        if (data.success) setStats(data.data);
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) return <Loader text="Loading platform statistics..." />;

  const c = stats?.cards || {};

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900">
          System Administration Overview
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Real-time metrics across registered job seekers, employers, job postings, and applications.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Users" value={c.totalUsers || 0} icon={FiUsers} color="blue" />
        <StatCard title="Job Seekers" value={c.jobSeekers || 0} icon={FiUserCheck} color="teal" />
        <StatCard title="Employers" value={c.employers || 0} icon={FiCheckCircle} color="indigo" />
        <StatCard title="Total Jobs" value={c.totalJobs || 0} icon={FiBriefcase} color="amber" />
        <StatCard title="Applications" value={c.totalApplications || 0} icon={FiFileText} color="emerald" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">New Users & Jobs Over Time</h2>
          <p className="mb-4 text-xs text-slate-500">Monthly platform activity (Last 6 Months)</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.growthOverTime || []}>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" name="New Users" stroke="#2563EB" strokeWidth={3} />
                <Line type="monotone" dataKey="jobs" name="New Jobs" stroke="#14B8A6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <h2 className="text-base font-bold text-slate-900">Jobs by Category</h2>
          <p className="mb-4 text-xs text-slate-500">Distribution across industry domains</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.jobsByCategory || []}>
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" name="Active Jobs" fill="#14B8A6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
