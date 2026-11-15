import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiClock, FiExternalLink } from 'react-icons/fi';
import api, { getFileUrl } from '../../services/api';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

const SeekerApplications = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApps = async () => {
      try {
        const { data } = await api.get('/applications/mine');
        if (data.success) setApplications(data.data);
      } catch {
        // Ignore
      } finally {
        setLoading(false);
      }
    };
    loadApps();
  }, []);

  if (loading) return <Loader text="Loading application history..." />;

  const filtered =
    statusFilter === 'ALL'
      ? applications
      : applications.filter((a) => a.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Applied Jobs & Status Tracker</h1>
          <p className="mt-1 text-xs text-slate-500">
            Track real-time updates as employers review, shortlist, or accept your applications.
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'Pending', 'Shortlisted', 'Accepted', 'Rejected'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No applications in this view"
          description="Explore open roles and submit your profile with a single click."
          action={
            <Link
              to="/jobs"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white"
            >
              Browse Jobs
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div
              key={app._id}
              className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    {app.job?.company?.name || 'Company'}
                  </span>
                  <StatusBadge status={app.status} />
                </div>
                <Link
                  to={`/jobs/${app.job?._id}`}
                  className="mt-1 block text-lg font-bold text-slate-900 hover:text-blue-600"
                >
                  {app.job?.title || 'Job Opportunity'}
                </Link>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <FiMapPin className="h-3.5 w-3.5" />
                    {app.job?.location || 'Dhaka'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <FiClock className="h-3.5 w-3.5" />
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>
                {app.coverNote && (
                  <p className="mt-2 rounded-lg bg-slate-50 p-2.5 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Cover Note:</span> {app.coverNote}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {app.resumePath && (
                  <a
                    href={getFileUrl(app.resumePath)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    CV Submitted <FiExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <Link
                  to={`/jobs/${app.job?._id}`}
                  className="rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                >
                  Job Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerApplications;
