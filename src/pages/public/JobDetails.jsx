import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiMapPin,
  FiBriefcase,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiGlobe,
  FiBookmark,
  FiSend,
  FiArrowLeft,
} from 'react-icons/fi';
import api, { getFileUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';
import Modal from '../../components/Modal';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, profileOrCompany } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/jobs/${id}`);
        if (data.success) {
          setJob(data.data);
        }

        if (user && user.role === 'JOB_SEEKER') {
          const [appsRes, savedRes] = await Promise.all([
            api.get('/applications/mine'),
            api.get('/saved'),
          ]);
          if (appsRes.data.success) {
            const exists = appsRes.data.data.some((a) => a.job?._id === id);
            setHasApplied(exists);
          }
          if (savedRes.data.success) {
            const saved = savedRes.data.data.some((s) => s.job?._id === id);
            setIsSaved(saved);
          }
        }
      } catch {
        toast.error('Could not load job details.');
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id, user]);

  if (loading) return <Loader text="Loading job details..." />;
  if (!job) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900">Job Not Found</h2>
        <Link to="/jobs" className="mt-4 inline-block text-blue-600 hover:underline">
          Return to job listings
        </Link>
      </div>
    );
  }

  const isExpired = new Date(job.deadline) < new Date();
  const logoUrl = getFileUrl(job.company?.logoPath);

  const handleToggleSave = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      if (isSaved) {
        await api.delete(`/saved/${job._id}`);
        setIsSaved(false);
        toast.success('Removed from saved jobs.');
      } else {
        await api.post(`/saved/${job._id}`);
        setIsSaved(true);
        toast.success('Job saved to your favorites!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update saved jobs.');
    }
  };

  const handleApplyConfirm = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post(`/jobs/${job._id}/apply`, { coverNote });
      if (data.success) {
        toast.success('Application submitted with your saved profile & resume!');
        setHasApplied(true);
        setApplyModalOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/jobs"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to all jobs
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Main Job Info */}
        <div className="lg:col-span-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-6">
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={job.company?.name}
                    className="h-16 w-16 rounded-2xl border border-slate-100 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-500 text-2xl font-bold text-white">
                    {job.company?.name?.charAt(0) || 'H'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-600">
                      {job.company?.name}
                    </span>
                    {job.company?.isVerified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                        <FiCheckCircle className="h-3.5 w-3.5 text-teal-600" />
                        Verified Employer
                      </span>
                    )}
                  </div>
                  <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                    {job.title}
                  </h1>
                </div>
              </div>

              {user?.role === 'JOB_SEEKER' && (
                <button
                  type="button"
                  onClick={handleToggleSave}
                  className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                    isSaved
                      ? 'border-blue-200 bg-blue-50 text-blue-600'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <FiBookmark className={`h-4 w-4 ${isSaved ? 'fill-blue-600' : ''}`} />
                  {isSaved ? 'Saved' : 'Save Job'}
                </button>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl bg-slate-50 p-3.5">
                <p className="text-xs text-slate-400">Location</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                  <FiMapPin className="h-4 w-4 text-blue-600" />
                  {job.location}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5">
                <p className="text-xs text-slate-400">Job Type</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                  <FiBriefcase className="h-4 w-4 text-teal-600" />
                  {job.jobType}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5">
                <p className="text-xs text-slate-400">Vacancies</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                  <FiUsers className="h-4 w-4 text-indigo-600" />
                  {job.vacancies} {job.vacancies > 1 ? 'Positions' : 'Position'}
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5">
                <p className="text-xs text-slate-400">Deadline</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-bold text-slate-800">
                  <FiClock className="h-4 w-4 text-amber-600" />
                  {new Date(job.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Job Description</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {job.description}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">Requirements & Qualifications</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {job.requirements}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Apply + Company Info */}
        <div className="space-y-6 lg:col-span-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Offered Monthly Salary
            </p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">
              ৳{Number(job.salaryMin).toLocaleString()} – ৳{Number(job.salaryMax).toLocaleString()}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Category: <span className="font-semibold text-slate-700">{job.category}</span>
            </p>

            <div className="mt-6">
              {!user ? (
                <Link
                  to="/login"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700"
                >
                  <FiSend className="h-4 w-4" />
                  Sign In to Apply
                </Link>
              ) : user.role === 'JOB_SEEKER' ? (
                hasApplied ? (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-emerald-100 py-3 text-sm font-bold text-emerald-800"
                  >
                    ✓ Already Applied
                  </button>
                ) : isExpired ? (
                  <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-rose-100 py-3 text-sm font-bold text-rose-700"
                  >
                    Deadline Expired
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setApplyModalOpen(true)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
                  >
                    <FiSend className="h-4 w-4" />
                    Apply with 1-Click
                  </button>
                )
              ) : (
                <p className="rounded-xl bg-slate-50 p-3 text-center text-xs font-medium text-slate-500">
                  Logged in as {user.role.replace('_', ' ')}. Only Job Seekers can submit applications.
                </p>
              )}
            </div>
          </div>

          {/* Company Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-bold text-slate-900">About the Company</h3>
            <p className="mt-2 text-sm font-semibold text-slate-800">{job.company?.name}</p>
            <p className="mt-2 text-sm text-slate-600">
              {job.company?.description || 'Verified employer partner on HireSphere.'}
            </p>
            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Industry:</span>{' '}
                {job.company?.industry || 'Technology'}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Company Size:</span>{' '}
                {job.company?.size || '11-50 employees'}
              </p>
              <p>
                <span className="font-semibold text-slate-800">Location:</span>{' '}
                {job.company?.location || job.location}
              </p>
              {job.company?.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                >
                  <FiGlobe className="h-3.5 w-3.5" />
                  Visit Company Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Apply Modal */}
      <Modal
        isOpen={applyModalOpen}
        onClose={() => setApplyModalOpen(false)}
        title={`Apply to ${job.title}`}
      >
        <form onSubmit={handleApplyConfirm} className="space-y-4">
          <div className="rounded-xl bg-blue-50 p-4 text-xs text-blue-900">
            <p className="font-bold">One-Click Profile & Resume Submission</p>
            <p className="mt-1">
              Your saved Job Seeker profile and uploaded CV will be shared automatically with{' '}
              <span className="font-semibold">{job.company?.name}</span>.
            </p>
            {!profileOrCompany?.resumePath && (
              <p className="mt-2 font-semibold text-rose-600">
                Note: You have not uploaded a resume yet. Please upload your CV in your Profile first!
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Cover Note (Optional)
            </label>
            <textarea
              rows={4}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Briefly highlight why you are a great fit for this role..."
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setApplyModalOpen(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Confirm & Submit Application'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default JobDetails;
