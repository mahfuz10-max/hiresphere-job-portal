import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiSearch,
  FiMapPin,
  FiBriefcase,
  FiUser,
  FiMonitor,
  FiGlobe,
} from 'react-icons/fi';
import api from '../../services/api';
import JobCard from '../../components/JobCard';
import Loader from '../../components/Loader';

const CATEGORIES = [
  'Software Engineering',
  'Cybersecurity',
  'Data & AI',
  'UI/UX Design',
  'DevOps & Cloud',
  'Quality Assurance',
  'Marketing',
  'Management',
];

const Home = () => {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('All');
  const [tab, setTab] = useState('recent');
  const [latestJobs, setLatestJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const { data } = await api.get('/jobs?limit=8');
        if (data.success) {
          setLatestJobs(data.data.jobs);
        }
      } catch {
        // Ignore on initial public load
      } finally {
        setLoading(false);
      }
    };
    fetchLatest();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (location.trim()) params.set('location', location.trim());
    if (category !== 'All') params.set('category', category);
    navigate(`/jobs?${params.toString()}`);
  };

  const displayedJobs =
    tab === 'featured'
      ? latestJobs.filter((j) => j.company?.isVerified)
      : latestJobs;

  return (
    <div>
      {/* Dark Navy Hero Banner with Background Image */}
      <section className="relative overflow-hidden bg-[#162238] py-24 text-white">
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
            Connect with verified technology companies across Bangladesh, manage your resume in one
            place, and track every application in real time.
          </p>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 max-w-4xl rounded-[4px] bg-white/15 p-2 backdrop-blur-xs"
          >
            <div className="grid grid-cols-1 overflow-hidden rounded-[3px] bg-white text-slate-700 sm:grid-cols-12">
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
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
          </form>

          {/* 3 Hero Stat Counters */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center sm:flex-row sm:gap-3.5">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white">
                <FiUser className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] text-[9px] text-white">
                  ✓
                </span>
              </div>
              <div className="mt-2 text-center sm:mt-0 sm:text-left">
                <p className="text-lg font-bold leading-none text-white sm:text-xl">500+</p>
                <p className="mt-1 text-[11px] text-slate-300">Active Candidates</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center sm:flex-row sm:gap-3.5">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white">
                <FiMonitor className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] text-[9px] text-white">
                  ✓
                </span>
              </div>
              <div className="mt-2 text-center sm:mt-0 sm:text-left">
                <p className="text-lg font-bold leading-none text-white sm:text-xl">35+</p>
                <p className="mt-1 text-[11px] text-slate-300">Verified Companies</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center sm:flex-row sm:gap-3.5">
              <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white">
                <FiGlobe className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1877F2] text-[9px] text-white">
                  ✓
                </span>
              </div>
              <div className="mt-2 text-center sm:mt-0 sm:text-left">
                <p className="text-lg font-bold leading-none text-white sm:text-xl">
                  {latestJobs.length || 20}
                </p>
                <p className="mt-1 text-[11px] text-slate-300">Open Positions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent / Featured Jobs 4-Column Portrait Cards */}
      <section className="bg-white py-14">
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
              Browse More Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Dark Navy Browse By Category Section with Background Image */}
      <section className="relative overflow-hidden bg-[#162238] py-16 text-white">
        <img
          src="/hero-bg.jpg"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-[#142138]/85" />
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">Browse By Category</h2>
            <p className="mx-auto mt-2 max-w-xl text-xs text-slate-300">
              Explore open positions across specialized engineering, security, design, and business
              categories.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/jobs?category=${encodeURIComponent(cat)}`}
                className="group flex flex-col items-center justify-center rounded-[4px] bg-white p-6 text-center shadow-md transition hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#1877F2] transition group-hover:bg-[#1877F2] group-hover:text-white">
                  <FiBriefcase className="h-6 w-6" />
                </div>
                <p className="mt-4 text-sm font-bold text-[#1e293b] group-hover:text-[#1877F2]">
                  {cat}
                </p>
                <p className="mt-1 text-xs text-slate-400">Browse Openings</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
