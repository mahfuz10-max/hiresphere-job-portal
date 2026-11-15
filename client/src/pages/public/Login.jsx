import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowRight,
  FiShield,
  FiZap,
  FiBriefcase,
  FiUser,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const PORTAL_MODES = [
  {
    id: 'JOB_SEEKER',
    label: 'Job Seeker',
    icon: FiUser,
    email: 'sajid@hiresphere.com',
    password: 'Seeker@123',
    desc: 'Access Candidate Dashboard, Resume Manager & Job Recommendations',
  },
  {
    id: 'EMPLOYER',
    label: 'Employer',
    icon: FiBriefcase,
    email: 'careers@finpulseltd.com',
    password: 'Employer@123',
    desc: 'Access Employer Analytics, Post Vacancies & Review Applicants',
  },
  {
    id: 'ADMIN',
    label: 'Admin Portal',
    icon: FiShield,
    email: 'admin@hiresphere.com',
    password: 'Admin@123',
    desc: 'Access System Administrator Console, Verify Employers & Moderate Users',
  },
];

const Login = () => {
  const { login, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const [selectedPortal, setSelectedPortal] = useState('JOB_SEEKER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSelectPortal = (portal) => {
    setSelectedPortal(portal.id);
    if (portal.id === 'ADMIN') {
      setEmail(portal.email);
      setPassword(portal.password);
      toast.success('Admin Portal selected — click Sign In to open Admin Console.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const loggedInUser = await login(email, password);
      navigate(getDashboardPath(loggedInUser.role));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Invalid credentials');
    } finally {
      setSubmitting(false);
    }
  };

  const activePortalObj =
    PORTAL_MODES.find((p) => p.id === selectedPortal) || PORTAL_MODES[0];

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-[#162238] via-[#1c2e4a] to-slate-100 px-4 py-10 sm:px-6 sm:py-16">
      {/* Subtle Blue Decorative Glows */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#1877F2]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-[#38bdf8]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-white/15 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.35)] lg:grid-cols-12">
          {/* Left Blue Theme Brand Showcase Panel */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#162238] via-[#1b3158] to-[#1877F2] p-8 text-white sm:p-10 lg:col-span-5">
            <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

            <div>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 backdrop-blur-xs">
                <div className="grid grid-cols-2 gap-0.5">
                  <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
                  <span className="h-2 w-2 rounded-full bg-white" />
                  <span className="h-2 w-2 rounded-full bg-white" />
                  <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
                </div>
                <span className="text-xs font-extrabold tracking-wide text-white">
                  Hire<span className="text-[#38bdf8]">Sphere</span> • 3 Role Portals
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
                Unified Recruitment Across 3 Dedicated Portals.
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-blue-100/90 sm:text-sm">
                Switch seamlessly between the Job Seeker Portal, Employer Portal, and System
                Admin Console.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-[#38bdf8]">
                    <FiZap className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white sm:text-sm">
                      1. Job Seeker Portal
                    </p>
                    <p className="text-[11px] text-blue-100/80">
                      Smart job recommendations, 1-click resume applications, and status tracking.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-[#38bdf8]">
                    <FiBriefcase className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white sm:text-sm">
                      2. Employer Portal
                    </p>
                    <p className="text-[11px] text-blue-100/80">
                      Post vacancies in any category, review CVs, and manage applicant shortlists.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-[#38bdf8]">
                    <FiShield className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white sm:text-sm">
                      3. Admin Moderation Portal
                    </p>
                    <p className="text-[11px] text-blue-100/80">
                      Verify employer badges, manage platform users, and moderate all 60+ job posts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-white/15 pt-5 text-[11px] text-blue-100/80">
              <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                <FiCheckCircle className="h-3.5 w-3.5 text-[#38bdf8]" />
                60+ Active Openings Across All Sectors
              </span>
            </div>
          </div>

          {/* Right Sign-In Form Panel with 3-Portal Selector */}
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-7">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-5">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1877F2]">
                  Welcome Back
                </span>
                <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Sign in to HireSphere
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  {activePortalObj.desc}
                </p>
              </div>

              {/* 3-Portal Selector Tabs (Job Seeker | Employer | Admin Portal) */}
              <div className="mb-6">
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Select Portal (3 Portals Available)
                </label>
                <div className="grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5">
                  {PORTAL_MODES.map((portal) => {
                    const Icon = portal.icon;
                    const active = selectedPortal === portal.id;
                    return (
                      <button
                        key={portal.id}
                        type="button"
                        onClick={() => handleSelectPortal(portal)}
                        className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
                          active
                            ? 'bg-[#1877F2] text-white shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{portal.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 transition focus-within:border-[#1877F2] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#1877F2]/15">
                    <FiMail className="h-4 w-4 shrink-0 text-[#1877F2]" />
                    <input
                      type="email"
                      name="hiresphere_login_email"
                      autoComplete="off"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Password
                    </label>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 transition focus-within:border-[#1877F2] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#1877F2]/15">
                    <FiLock className="h-4 w-4 shrink-0 text-[#1877F2]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="hiresphere_login_password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-slate-400 transition hover:text-slate-600"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <FiEyeOff className="h-4 w-4" />
                      ) : (
                        <FiEye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1877F2] to-[#1464cc] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:from-[#1464cc] hover:to-[#1052ab] disabled:opacity-50"
                >
                  <span>
                    {submitting
                      ? 'Signing in...'
                      : `Sign In to ${activePortalObj.label}`}
                  </span>
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-7 border-t border-slate-100 pt-5 text-center">
                <p className="text-xs text-slate-500 sm:text-sm">
                  Don&apos;t have a HireSphere account yet?{' '}
                  <Link
                    to="/register"
                    className="font-bold text-[#1877F2] transition hover:text-[#1464cc] hover:underline"
                  >
                    Create a free account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
