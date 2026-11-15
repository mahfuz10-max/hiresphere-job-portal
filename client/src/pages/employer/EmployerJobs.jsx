import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiPlusCircle,
  FiEdit2,
  FiTrash2,
  FiUsers,
  FiMapPin,
  FiClock,
} from 'react-icons/fi';
import api from '../../services/api';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

const EmployerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyJobs = async () => {
    try {
      const { data } = await api.get('/jobs/mine/list');
      if (data.success) setJobs(data.data);
    } catch {
      toast.error('Failed to load your job posts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const handleDelete = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
      toast.success('Job listing deleted.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed.');
    }
  };

  if (loading) return <Loader text="Loading your job listings..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Manage My Job Listings</h1>
          <p className="mt-1 text-xs text-slate-500">
            Edit job details, view applicant pipelines, or remove closed positions.
          </p>
        </div>

        <Link
          to="/employer/jobs/new"
          className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
        >
          <FiPlusCircle className="h-4 w-4" />
          Post New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          title="No job listings posted yet"
          description="Publish your first vacancy to start receiving applications from candidates."
          action={
            <Link
              to="/employer/jobs/new"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white"
            >
              Post a Job
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-lg bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {job.jobType}
                  </span>
                  <span className="rounded-lg bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                    {job.category}
                  </span>
                </div>
                <Link
                  to={`/jobs/${job._id}`}
                  className="mt-1.5 block text-lg font-bold text-slate-900 hover:text-blue-600"
                >
                  {job.title}
                </Link>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <FiMapPin className="h-3.5 w-3.5" />
                    {job.location}
                  </span>
                  <span>
                    ৳{Number(job.salaryMin).toLocaleString()} – ৳{Number(job.salaryMax).toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiClock className="h-3.5 w-3.5" />
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={`/employer/jobs/${job._id}/applicants`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                  <FiUsers className="h-4 w-4" />
                  Applicants ({job.applicantCount || 0})
                </Link>
                <Link
                  to={`/employer/jobs/${job._id}/edit`}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <FiEdit2 className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(job._id)}
                  className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100"
                >
                  <FiTrash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmployerJobs;
