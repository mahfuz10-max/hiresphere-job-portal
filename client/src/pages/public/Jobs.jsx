import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSearch, FiRefreshCw, FiEdit3 } from 'react-icons/fi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  DEMO_JOBS_CATALOG,
  mergeWithDemoJobs,
  syncAdditionalJobsIfNeeded,
} from '../../utils/liveJobSync';
import JobCard from '../../components/JobCard';
import Pagination from '../../components/Pagination';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

const STANDARD_CATEGORIES = [
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

const CATEGORIES = ['All', ...STANDARD_CATEGORIES, 'Others'];

const LOCATIONS = ['All', 'Dhaka', 'Remote', 'Chattogram', 'Sylhet', 'Rajshahi'];
const JOB_TYPES = ['All', 'Full-time', 'Part-time', 'Internship', 'Remote', 'Contract'];
const PAGE_SIZE = 15;

const Jobs = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCatParam = searchParams.get('category') || 'All';
  const isInitialCustom =
    initialCatParam !== 'All' &&
    initialCatParam !== 'Others' &&
    !STANDARD_CATEGORIES.some((c) => c.toLowerCase() === initialCatParam.toLowerCase());

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [category, setCategory] = useState(isInitialCustom ? 'Others' : initialCatParam);
  const [customCategory, setCustomCategory] = useState(isInitialCustom ? initialCatParam : '');
  const [location, setLocation] = useState(searchParams.get('location') || 'All');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || 'All');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  const [allJobs, setAllJobs] = useState(() => mergeWithDemoJobs(DEMO_JOBS_CATALOG));
  const [savedIds, setSavedIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAllJobs = useCallback(async () => {
    try {
      const { data } = await api.get('/jobs?limit=100');
      if (data.success) {
        setAllJobs(mergeWithDemoJobs(data.data.jobs));
      }

      const added = await syncAdditionalJobsIfNeeded();
      if (added) {
        const refreshed = await api.get('/jobs?limit=100');
        if (refreshed.data?.success) {
          setAllJobs(mergeWithDemoJobs(refreshed.data.data.jobs));
        }
      }
    } catch {
      // Keep demo jobs initialized
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSaved = useCallback(async () => {
    if (!user || user.role !== 'JOB_SEEKER') return;
    try {
      const { data } = await api.get('/saved');
      if (data.success) {
        setSavedIds(data.data.map((item) => item.job?._id || item.job));
      }
    } catch {
      // Ignore
    }
  }, [user]);

  useEffect(() => {
    fetchAllJobs();
  }, [fetchAllJobs]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase();
        const hay = `${job.title} ${job.description} ${job.requirements} ${job.category} ${job.company?.name || ''}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }

      if (category === 'Others') {
        if (customCategory.trim()) {
          const customKw = customCategory.trim().toLowerCase();
          const catMatch =
            job.category?.toLowerCase().includes(customKw) ||
            job.title?.toLowerCase().includes(customKw) ||
            job.description?.toLowerCase().includes(customKw);
          if (!catMatch) return false;
        } else {
          const isStandard = STANDARD_CATEGORIES.some(
            (c) => c.toLowerCase() === (job.category || '').toLowerCase()
          );
          if (isStandard) return false;
        }
      } else if (category !== 'All') {
        if (job.category?.toLowerCase() !== category.toLowerCase()) {
          return false;
        }
      }

      if (location !== 'All' && !job.location?.toLowerCase().includes(location.toLowerCase())) {
        return false;
      }
      if (jobType !== 'All' && job.jobType !== jobType) {
        return false;
      }
      return true;
    });
  }, [allJobs, keyword, category, customCategory, location, jobType]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    const nextParams = {};
    if (keyword.trim()) nextParams.keyword = keyword.trim();
    if (category === 'Others') {
      nextParams.category = customCategory.trim() || 'Others';
    } else if (category !== 'All') {
      nextParams.category = category;
    }
    if (location !== 'All') nextParams.location = location;
    if (jobType !== 'All') nextParams.jobType = jobType;
    setSearchParams(nextParams);
  };

  const handleReset = () => {
    setKeyword('');
    setCategory('All');
    setCustomCategory('');
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

    if (savedIds.includes(jobId)) {
      setSavedIds((prev) => prev.filter((id) => id !== jobId));
      toast.success('Removed from saved jobs.');
      try {
        await api.delete(`/saved/${jobId}`);
      } catch {
        // Local demo bookmark removed
      }
    } else {
      setSavedIds((prev) => [...prev, jobId]);
      toast.success('Saved to your favorites!');
      try {
        await api.post(`/saved/${jobId}`);
      } catch {
        // Local demo bookmark saved
      }
    }
  };

  const getPillCount = (cat) => {
    if (cat === 'All') return allJobs.length;
    if (cat === 'Others') {
      return allJobs.filter(
        (j) =>
          !STANDARD_CATEGORIES.some(
            (sc) => sc.toLowerCase() === (j.category || '').toLowerCase()
          )
      ).length;
    }
    return allJobs.filter((j) => j.category?.toLowerCase() === cat.toLowerCase()).length;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Browse Open Positions ({filteredJobs.length} Jobs)
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Showing {filteredJobs.length} of {allJobs.length}+ active opportunities across all
            sectors in Bangladesh and remote teams
          </p>
        </div>
      </div>

      {/* Quick Sector Filter Pills including Others */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          const count = getPillCount(cat);
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                if (cat !== 'Others') setCustomCategory('');
                setPage(1);
              }}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                active
                  ? 'bg-[#1877F2] text-white shadow-xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300'
              }`}
            >
              {cat} ({count})
            </button>
          );
        })}
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
                onChange={(e) => {
                  setKeyword(e.target.value);
                  setPage(1);
                }}
                placeholder="Title, skill, or technology..."
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="mb-1 block text-xs font-semibold text-slate-600">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value !== 'Others') setCustomCategory('');
                setPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c === 'Others' ? 'Others (Write Custom Category)' : c}
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

        {/* Custom Category Input Box when "Others" is selected */}
        {category === 'Others' && (
          <div className="mt-4 flex flex-col gap-2 rounded-xl border border-blue-200 bg-blue-50/50 p-3.5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1877F2]">
              <FiEdit3 className="h-4 w-4 shrink-0" />
              <span>Write Your Custom Category:</span>
            </div>
            <input
              type="text"
              value={customCategory}
              onChange={(e) => {
                setCustomCategory(e.target.value);
                setPage(1);
              }}
              placeholder="Type your category (e.g. Finance, HR, Civil Engineering, Healthcare, Education...)"
              className="flex-1 rounded-lg border border-blue-200 bg-white px-3.5 py-2 text-xs text-slate-800 focus:border-[#1877F2] focus:outline-none"
            />
          </div>
        )}
      </form>

      {loading ? (
        <Loader text="Searching matching jobs..." />
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          title="No matching jobs found"
          description="Try clearing some filters or typing a broader custom category keyword."
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                isSaved={savedIds.includes(job._id)}
                onToggleSave={user?.role === 'JOB_SEEKER' ? handleToggleSave : undefined}
              />
            ))}
          </div>

          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onPageChange={(nextPage) => setPage(nextPage)}
          />
        </>
      )}
    </div>
  );
};

export default Jobs;
