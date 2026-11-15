import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiFileText,
  FiBookmark,
  FiCheckCircle,
  FiClock,
  FiUserCheck,
  FiZap,
  FiArrowRight,
} from 'react-icons/fi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  DEMO_JOBS_CATALOG,
  mergeWithDemoJobs,
  syncAdditionalJobsIfNeeded,
  computeJobRecommendations,
} from '../../utils/liveJobSync';
import StatCard from '../../components/StatCard';
import StatusBadge from '../../components/StatusBadge';
import JobCard from '../../components/JobCard';
import Loader from '../../components/Loader';

const REC_FILTER_TABS = [
  'Recommended For You',
  'Software Engineering',
  'Cybersecurity',
  'Data & AI',
  'UI/UX Design',
  'DevOps & Cloud',
  'Quality Assurance',
  'Marketing',
  'Management',
  'Customer Support',
];

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [allJobs, setAllJobs] = useState(() => mergeWithDemoJobs(DEMO_JOBS_CATALOG));
  const [recCategoryTab, setRecCategoryTab] = useState('Recommended For You');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      try {
        const [appRes, savedRes, profRes, jobsRes] = await Promise.all([
          api.get('/applications/mine').catch(() => ({ data: { success: false } })),
          api.get('/saved').catch(() => ({ data: { success: false } })),
          api.get('/profile').catch(() => ({ data: { success: false } })),
          api.get('/jobs?limit=100').catch(() => ({ data: { success: false } })),
        ]);

        const appsData = appRes.data?.success ? appRes.data.data : [];
        const savedData = savedRes.data?.success ? savedRes.data.data : [];
        const profData = profRes.data?.success ? profRes.data.data : null;
        const apiJobs = jobsRes.data?.success ? jobsRes.data.data.jobs : [];
        const mergedJobs = mergeWithDemoJobs(apiJobs);

        if (!mounted) return;

        setApplications(appsData);
        setSavedJobs(savedData);
        setProfile(profData);
        setAllJobs(mergedJobs);

        syncAdditionalJobsIfNeeded();
      } catch {
        // Fallback to 60 demo jobs
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <Loader text="Loading your personalized dashboard..." />;

  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const accepted = applications.filter((a) => a.status === 'Accepted').length;
  const savedJobIds = savedJobs.map((s) => s.job?._id || s.job);

  const handleToggleSave = async (jobId) => {
    if (savedJobIds.includes(jobId)) {
      setSavedJobs((prev) =>
        prev.filter((item) => (item.job?._id || item.job) !== jobId)
      );
      toast.success('Removed from saved jobs.');
      try {
        if (!String(jobId).startsWith('demo-')) {
          await api.delete(`/saved/${jobId}`);
        }
      } catch {
        // Ignore on demo item
      }
    } else {
      const targetJob = allJobs.find((j) => j._id === jobId);
      setSavedJobs((prev) => [
        ...prev,
        { _id: Date.now(), job: targetJob || { _id: jobId } },
      ]);
      toast.success('Saved to your favorites!');
      try {
        if (!String(jobId).startsWith('demo-')) {
          await api.post(`/saved/${jobId}`);
        }
      } catch {
        // Ignore on demo item
      }
    }
  };

  const fullRecommendations = computeJobRecommendations(allJobs, profile, applications);
  const displayedRecommendations =
    recCategoryTab === 'Recommended For You'
      ? fullRecommendations.slice(0, 9)
      : fullRecommendations
          .filter((j) => j.category === recCategoryTab)
          .slice(0, 9);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-gradient-to-r from-[#162238] via-[#1c3156] to-[#1877F2] p-6 text-white shadow-sm">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#38bdf8]">
            <FiZap className="h-3.5 w-3.5" />
            Candidate Workspace
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-white">
            Welcome, {user?.name}
          </h1>
          <p className="mt-1 text-xs text-blue-100 sm:text-sm">
            {profile?.headline && profile.headline !== 'Aspiring Professional'
              ? `${profile.headline} • Explore personalized job recommendations from ${allJobs.length}+ active openings below.`
              : `Explore personalized job recommendations from ${allJobs.length}+ active openings across all 9 sectors below.`}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/seeker/profile"
            className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
          >
            Edit Profile & CV
          </Link>
          <Link
            to="/jobs"
            className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-[#162238] shadow-xs transition hover:bg-blue-50"
          >
            Browse All {allJobs.length}+ Jobs
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
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
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 sm:text-sm">
          <span>
            <strong>Tip for New Candidates:</strong> Upload your PDF/DOCX Resume once in your
            profile to enable instant 1-click applications on all recommended jobs!
          </span>
          <Link
            to="/seeker/profile"
            className="rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-amber-700"
          >
            Upload CV Now
          </Link>
        </div>
      )}

      {/* Personalized Job Recommendations Section Across All 9 Sectors */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-[#1877F2]">
                <FiZap className="h-4 w-4" />
              </span>
              <h2 className="text-lg font-extrabold text-slate-900">
                Recommended Jobs For You ({allJobs.length}+ Active Across 9 Sectors)
              </h2>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Curated open positions matching your profile, skills, and career interests
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1877F2] hover:underline"
          >
            <span>Explore All {allJobs.length}+ Jobs</span>
            <FiArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* All 9 Sector Filter Pills for Recommendations */}
        <div className="mt-4 flex flex-wrap gap-2">
          {REC_FILTER_TABS.map((tabName) => {
            const active = recCategoryTab === tabName;
            return (
              <button
                key={tabName}
                type="button"
                onClick={() => setRecCategoryTab(tabName)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                  active
                    ? 'bg-[#1877F2] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tabName}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {displayedRecommendations.map((job) => (
            <div key={job._id} className="flex flex-col">
              <div className="mb-1.5 flex items-center justify-between rounded-t-lg bg-blue-50/80 px-3 py-1 text-[11px] font-semibold text-[#1877F2]">
                <span className="truncate">
                  ★ {job.matchReason || `Recommended in ${job.category}`}
                </span>
              </div>
              <div className="flex-1">
                <JobCard
                  job={job}
                  isSaved={savedJobIds.includes(job._id)}
                  onToggleSave={handleToggleSave}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Applications</h2>
          <Link
            to="/seeker/applications"
            className="text-xs font-semibold text-[#1877F2] hover:underline"
          >
            View All History
          </Link>
        </div>

        {applications.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500">
            You haven&apos;t applied to any jobs yet. Click any recommended job above to apply with
            1 click!
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
                      <Link to={`/jobs/${app.job?._id}`} className="hover:text-[#1877F2]">
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
