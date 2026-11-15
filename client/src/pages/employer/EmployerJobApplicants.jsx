import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiDownload,
  FiMail,
  FiPhone,
  FiMapPin,
} from 'react-icons/fi';
import api, { getFileUrl } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

const EmployerJobApplicants = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}/applications`);
        if (data.success) {
          setJob(data.data.job);
          setApplications(data.data.applications);
        }
      } catch {
        toast.error('Failed to load applicants for this job.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [id]);

  const handleStatusChange = async (appId, status) => {
    try {
      const { data } = await api.patch(`/applications/${appId}/status`, { status });
      if (data.success) {
        setApplications((prev) =>
          prev.map((a) => (a._id === appId ? { ...a, status } : a))
        );
        toast.success(`Candidate marked as ${status}.`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status.');
    }
  };

  if (loading) return <Loader text="Loading candidate applications..." />;

  return (
    <div className="space-y-6">
      <Link
        to="/employer/jobs"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to My Job Listings
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">
          Applicants for: {job?.title || 'Job Post'}
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Total received applications: {applications.length}
        </p>
      </div>

      {applications.length === 0 ? (
        <EmptyState
          title="No candidates have applied yet"
          description="Applications will appear here with candidate profiles and downloadable resumes."
        />
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const p = app.seekerProfile || {};
            return (
              <div
                key={app._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-lg font-bold text-slate-900">
                        {app.applicant?.name || 'Candidate'}
                      </h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="mt-0.5 text-xs font-medium text-blue-600">
                      {p.headline || 'Job Seeker'}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <FiMail className="h-3.5 w-3.5" />
                        {app.applicant?.email}
                      </span>
                      {p.phone && (
                        <span className="inline-flex items-center gap-1">
                          <FiPhone className="h-3.5 w-3.5" />
                          {p.phone}
                        </span>
                      )}
                      {p.location && (
                        <span className="inline-flex items-center gap-1">
                          <FiMapPin className="h-3.5 w-3.5" />
                          {p.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {app.resumePath && (
                    <a
                      href={getFileUrl(app.resumePath)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                    >
                      <FiDownload className="h-4 w-4" />
                      Download Resume/CV
                    </a>
                  )}
                </div>

                {/* Profile Details */}
                <div className="mt-4 grid grid-cols-1 gap-4 text-xs text-slate-600 md:grid-cols-2">
                  <div>
                    <p className="font-bold text-slate-800">Education:</p>
                    <p className="mt-0.5">{p.education || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Experience:</p>
                    <p className="mt-0.5">{p.experience || 'Not specified'}</p>
                  </div>
                </div>

                {p.skills?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {app.coverNote && (
                  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
                    <span className="font-bold">Cover Note: </span>
                    {app.coverNote}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-400">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </span>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleStatusChange(app._id, 'Shortlisted')}
                      className="rounded-xl bg-blue-50 px-3.5 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                    >
                      Shortlist
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(app._id, 'Accepted')}
                      className="rounded-xl bg-emerald-50 px-3.5 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStatusChange(app._id, 'Rejected')}
                      className="rounded-xl bg-rose-50 px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployerJobApplicants;
