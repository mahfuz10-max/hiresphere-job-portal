import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSearch, FiTrash2, FiCheckCircle } from 'react-icons/fi';
import api from '../../services/api';
import Loader from '../../components/Loader';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAllJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/jobs', { params: { search } });
      if (data.success) setJobs(data.data);
    } catch {
      toast.error('Failed to load job listings.');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  const handleRemoveJob = async (jobId) => {
    try {
      const { data } = await api.delete(`/admin/jobs/${jobId}`);
      if (data.success) {
        setJobs((prev) => prev.filter((j) => j._id !== jobId));
        toast.success('Job listing removed.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">All Job Listings Moderation</h1>
          <p className="mt-1 text-xs text-slate-500">
            Inspect all published jobs across employers and remove inappropriate or fraudulent listings.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2">
          <FiSearch className="h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by title or category..."
            className="bg-transparent text-xs focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <Loader text="Loading all platform jobs..." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                <th className="pb-3 font-semibold">Job Title</th>
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 font-semibold">Category & Type</th>
                <th className="pb-3 font-semibold">Applicants</th>
                <th className="pb-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td className="py-3.5">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="font-bold text-slate-900 hover:text-blue-600"
                    >
                      {job.title}
                    </Link>
                    <p className="text-xs text-slate-500">{job.location}</p>
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-800">{job.company?.name}</span>
                      {job.company?.isVerified && (
                        <FiCheckCircle className="h-3.5 w-3.5 text-teal-600" title="Verified" />
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 text-xs text-slate-600">
                    {job.category} • {job.jobType}
                  </td>
                  <td className="py-3.5 font-semibold text-slate-800">
                    {job.applicantCount || 0}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemoveJob(job._id)}
                      className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminJobs;
