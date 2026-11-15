import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiMapPin,
  FiBriefcase,
  FiUser,
  FiMonitor,
  FiGlobe,
  FiEdit3,
} from 'react-icons/fi';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  DEMO_JOBS_CATALOG,
  mergeWithDemoJobs,
  syncAdditionalJobsIfNeeded,
} from '../../utils/liveJobSync';
import JobCard from '../../components/JobCard';
import Loader from '../../components/Loader';

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

const CATEGORIES = [...STANDARD_CATEGORIES, 'Others'];

const Home = () => {
  const navigate = useNavigate();
  const { user, getDashboardPath } = useAuth();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All');
  const [customCategory, setCustomCategory] = useState('');
  const [tab, setTab] = useState('recent');
  const [allJobs, setAllJobs] = useState(() => mergeWithDemoJobs(DEMO_JOBS_CATALOG));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchLatest = async () => {
      try {
        const { data } = await api.get('/jobs?limit=100');
        if (mounted && data.success) {
          setAllJobs(mergeWithDemoJobs(data.data.jobs));
        }
        const added = await syncAdditionalJobsIfNeeded();
        if (added && mounted) {
          const refreshed = await api.get('/jobs?limit=100');
          if (refreshed.data?.success && mounted) {
            setAllJobs(mergeWithDemoJobs(refreshed.data.data.jobs));
          }
        }
      } catch {
        // Fallback to demo jobs already initialized
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchLatest();
    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (location.trim()) params.set('location', location.trim());
    if (category === 'Others') {
      params.set('category', customCategory.trim() || 'Others');
    } else if (category !== 'All') {
      params.set('category', category);
    }
    navigate(`/jobs?${params.toString()}`);
  };

  const displayedJobs = (
    tab === 'featured'
      ? allJobs.filter((j) => j.company?.isVerified)
      : allJobs
  ).slice(0, 12);

  const scrollToListings = (selectedTab) => {
    setTab(selectedTab);
    const el = document.getElementById('home-job-listings');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const getCategoryCount = (catName) => {
    if (catName === 'Others') {
      return allJobs.filter(
        (j) =>
          !STANDARD_CATEGORIES.some(
            (sc) => sc.toLowerCase() === (j.category || '').toLowerCase()
          )
      ).length;
    }
    return allJobs.filter((j) => j.category?.toLowerCase() === catName.toLowerCase()).length;
  };

  return (
    <div>
      {/* Dark Navy Hero Banner with Background Image */}
      <section className="relative overflow-hidden bg-[#162238] py-16 text-white sm:py-24">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#142138]/80" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Find Your Next Career on HireSphere.
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
            Connect with verified technology &amp; business companies across Bangladesh, explore{' '}
            {allJobs.length}+ open positions across all sectors, and apply with 1 click.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 max-w-4xl rounded-[6px] bg-white/15 p-2 backdrop-blur-xs"
          >
            <div className="grid grid-cols-1 overflow-hidden rounded-[4px] bg-white text-slate-700 sm:grid-cols-12">
              <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-3.5 sm:col-span-4 sm:border-b-0 sm:border-r">
                <FiSearch className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job Title or Keywords"
                  className="w-full bg-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-3.5 sm:col-span-3 sm:border-b-0 sm:border-r">
                <FiMapPin className="h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full bg-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5 border-b border-slate-200 px-4 py-3.5 sm:col-span-3 sm:border-b-0">
                <FiBriefcase className="h-4 w-4 shrink-0 text-slate-400" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-600 focus:outline-none"
                >
                  <option value="All">All Sectors ({allJobs.length})</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c === 'Others' ? 'Others (Custom Category)' : `${c} (${getCategoryCount(c)})`}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-[#1877F2] py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-[#1464cc] sm:col-span-2"
              >
                Find Jobs
              </button>
            </div>

            {category === 'Others' && (
              <div className="mt-2 flex items-center gap-2 rounded-[4px] bg-white px-4 py-2.5 text-slate-700">
                <FiEdit3 className="h-4 w-4 shrink-0 text-[#1877F2]" />
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Write your custom category name (e.g. Finance, HR, Civil Engineering, Healthcare...)"
                  className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            )}
          </form>

          {/* 3 Interactive Hero Stat Buttons */}
          <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-2 sm:mt-12 sm:gap-4">
            <Link
              to={user ? getDashboardPath() : '/register'}
              className="group flex flex-col items-center justify-center rounded-xl p-2 transition hover:bg-white/10 sm:flex-row sm:gap-3.5"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition group-hover:border-[#38bdf8] group-hover:bg-[#1877F2]/30">
                <FiUser className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] text-[9px] text-white">
                  ✓
                </span>
              </div>
              <div className="mt-2 text-center sm:mt-0 sm:text-left">
                <p className="text-base font-bold leading-none text-white sm:text-xl">500+</p>
                <p className="mt-1 text-[11px] text-slate-300 group-hover:text-white">
                  Active Candidates
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => scrollToListings('featured')}
              className="group flex flex-col items-center justify-center rounded-xl p-2 transition hover:bg-white/10 sm:flex-row sm:gap-3.5"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition group-hover:border-[#38bdf8] group-hover:bg-[#1877F2]/30">
                <FiMonitor className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] text-[9px] text-white">
                  ✓
                </span>
              </div>
              <div className="mt-2 text-center sm:mt-0 sm:text-left">
                <p className="text-base font-bold leading-none text-white sm:text-xl">35+</p>
                <p className="mt-1 text-[11px] text-slate-300 group-hover:text-white">
                  Verified Companies
                </p>
              </div>
            </button>

            <Link
              to="/jobs"
              className="group flex flex-col items-center justify-center rounded-xl p-2 transition hover:bg-white/10 sm:flex-row sm:gap-3.5"
            >
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition group-hover:border-[#38bdf8] group-hover:bg-[#1877F2]/30">
                <FiGlobe className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] text-[9px] text-white">
                  ✓
                </span>
              </div>
              <div className="mt-2 text-center sm:mt-0 sm:text-left">
                <p className="text-base font-bold leading-none text-white sm:text-xl">
                  {allJobs.length}+
                </p>
                <p className="mt-1 text-[11px] text-slate-300 group-hover:text-white">
                  Open Positions
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent / Featured Jobs 4-Column Portrait Cards */}
      <section id="home-job-listings" className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex justify-center">
            <div className="inline-flex rounded-[4px] border-2 border-[#1877F2] bg-[#1877F2] p-0.5">
              <button
                type="button"
                onClick={() => setTab('recent')}
                className={`rounded-[2px] px-7 py-2 text-xs font-semibold transition ${
                  tab === 'recent' ? 'bg-white text-[#1877F2]' : 'bg-[#1877F2] text-white'
                }`}
              >
                Recent Jobs
              </button>
              <button
                type="button"
                onClick={() => setTab('featured')}
                className={`rounded-[2px] px-7 py-2 text-xs font-semibold transition ${
                  tab === 'featured' ? 'bg-white text-[#1877F2]' : 'bg-[#1877F2] text-white'
                }`}
              >
                Featured Jobs
              </button>
            </div>
          </div>

          {loading ? (
            <Loader text="Fetching latest openings..." />
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {displayedJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <Link
              to="/jobs"
              className="rounded-[4px] bg-[#1877F2] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#1464cc]"
            >
              Browse All {allJobs.length}+ Open Positions
            </Link>
          </div>
        </div>
      </section>

      {/* Dark Navy Browse By Category Section Including Others */}
      <section className="relative overflow-hidden bg-[#162238] py-16 text-white">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#142138]/85" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Browse By Sector ({allJobs.length}+ Openings)
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-slate-300">
              Explore {allJobs.length}+ active demo positions across all engineering, security,
              data, design, business, and custom sectors.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/jobs?category=${encodeURIComponent(cat)}`}
                className="group flex flex-col items-center justify-center rounded-[6px] bg-white p-5 text-center shadow-md transition hover:-translate-y-1 sm:p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#1877F2] transition group-hover:bg-[#1877F2] group-hover:text-white">
                  <FiBriefcase className="h-6 w-6" />
                </div>
                <p className="mt-4 text-xs font-bold text-[#1e293b] group-hover:text-[#1877F2] sm:text-sm">
                  {cat === 'Others' ? 'Others (Custom)' : cat}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#1877F2]">
                  {getCategoryCount(cat)} Open Positions
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
