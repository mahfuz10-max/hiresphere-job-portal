import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSearch, FiRefreshCw } from 'react-icons/fi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/JobCard';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

const CATEGORIES = [
  'All',
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

const LOCATIONS = ['All', 'Dhaka', 'Remote', 'Chattogram', 'Sylhet', 'Rajshahi'];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Internship', 'Remote', 'Contract'];

const Jobs = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || 'All');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
      };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (category !== 'All') params.category = category;
      if (location !== 'All') params.location = location;
      if (jobType !== 'All') params.jobType = jobType;

      const { data } = await api.get('/jobs', { params });
      if (data.success) {
        setJobs(data.data.jobs);
        setPagination(data.data.pagination);
      }
    } catch {
      toast.error('Failed to load job listings.');
    } finally {
      setLoading(false);
    }
  }, [keyword, category, location, jobType, page]);

  const fetchSaved = useCallback(async () => {
    if (!user || user.role !== 'JOB_SEEKER') return;
    try {
      const { data } = await api.get('/saved');
      if (data.success) {
        setSavedIds(data.data.map((item) => item.job?._id));
      }
    } catch {
      // Ignore
    }
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const nextParams = {};
    if (keyword.trim()) nextParams.keyword = keyword.trim();
    if (category !== 'All') nextParams.category = category;
    if (location !== 'All') nextParams.location = location;
    if (jobType !== 'All') nextParams.jobType = jobType;
    setSearchParams(nextParams);
  };

  const handleReset = () => {
    setKeyword('');
    setCategory('All');
    setLocation('All');
    setJobType('All');
    setPage(1);
    setSearchParams({});
  };

  const handleToggleSave = async (jobId) => {
    if (!user) {
      toast.error('Please sign in as a Job Seeker to save jobs.');
      return;
    }
    if (user.role !== 'JOB_SEEKER') {
      toast.error('Only Job Seekers can bookmark jobs.');
      return;
    }

    try {
      if (savedIds.includes(jobId)) {
        await api.delete(`/saved/${jobId}`);
        setSavedIds((prev) => prev.filter((id) => id !== jobId));
        toast.success('Removed from saved jobs.');
      } else {
        await api.post(`/saved/${jobId}`);
        setSavedIds((prev) => [...prev, jobId]);
        toast.success('Saved to your favorites!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update saved job.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Browse Open Positions</h1>
        <p className="mt-1 text-sm text-slate-500">
          Showing {pagination.total} active opportunities across Bangladesh and remote teams
        </p>
      </div>

      {/* Search & Filters */}
      <form
        onSubmit={handleFilterSubmit}
        className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-4">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Keyword</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <FiSearch className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Title, skill, or technology..."
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Category</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Location</label>
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="mb-1 block text-xs font-semibold text-slate-600">Job Type</label>
            <div className="flex gap-2">
              <select
                value={jobType}
                onChange={(e) => {
                  setJobType(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
              >
                {JOB_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleReset}
                title="Reset Filters"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-100 px-3 text-slate-600 hover:bg-slate-200"
              >
                <FiRefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </form>

      {loading ? (
        <Loader text="Searching matching jobs..." />
      ) : jobs.length === 0 ? (
        <EmptyState
          title="No matching jobs found"
          description="Try clearing some filters or searching for a broader skill keyword."
          action={
            <button
              type="button"
              onClick={handleReset}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Reset All Filters
            </button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSaved={savedIds.includes(job._id)}
                onToggleSave={user?.role === 'JOB_SEEKER' ? handleToggleSave : undefined}
              />
            ))}
          </div>

          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        </>
      )}
    </div>
  );
};

export default Jobs;
