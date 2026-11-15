import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  FiUser,
  FiMail,
  FiLock,
  FiBriefcase,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiArrowRight,
  FiCompass,
  FiAward,
  FiShield,
  FiEdit3,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CAREER_CATEGORIES = [
  'Software Engineering',
  'Cybersecurity',
  'Data & AI',
  'UI/UX Design',
  'DevOps & Cloud',
  'Quality Assurance',
  'Marketing',
  'Management',
  'Customer Support',
  'Others',
];

const SUGGESTED_SKILL_TAGS = {
  'Software Engineering': ['React.js', 'Node.js', 'JavaScript', 'MongoDB', 'TypeScript', 'Python'],
  Cybersecurity: ['Penetration Testing', 'OWASP', 'Network Security', 'Linux', 'SIEM'],
  'Data & AI': ['Python', 'SQL', 'Machine Learning', 'Power BI', 'Pandas'],
  'UI/UX Design': ['Figma', 'UI/UX', 'Prototyping', 'Design Systems', 'Tailwind CSS'],
  'DevOps & Cloud': ['Docker', 'AWS', 'Kubernetes', 'CI/CD', 'Linux'],
  'Quality Assurance': ['Postman', 'Playwright', 'API Testing', 'Bug Tracking', 'Automation'],
  Marketing: ['SEO', 'Digital Marketing', 'Google Analytics', 'Content Strategy'],
  Management: ['Agile', 'Scrum', 'Jira', 'Project Management', 'Product Roadmap'],
  'Customer Support': ['Client Onboarding', 'Technical Support', 'CRM', 'Communication'],
  Others: ['Communication', 'Problem Solving', 'Project Coordination', 'Research', 'MS Office'],
};

const Register = () => {
  const { register, refreshUser, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('JOB_SEEKER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [preferredCategory, setPreferredCategory] = useState('Software Engineering');
  const [customCategory, setCustomCategory] = useState('');
  const [selectedSkills, setSelectedSkills] = useState(['React.js', 'Node.js', 'JavaScript']);
  const [customSkillsInput, setCustomSkillsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleCategoryChange = (newCat) => {
    setPreferredCategory(newCat);
    const defaultSkills = SUGGESTED_SKILL_TAGS[newCat] || [];
    setSelectedSkills(defaultSkills.slice(0, 3));
  };

  const toggleSkillTag = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalCategory =
      preferredCategory === 'Others'
        ? customCategory.trim() || 'General & Others'
        : preferredCategory;

    if (role === 'JOB_SEEKER' && preferredCategory === 'Others' && !customCategory.trim()) {
      toast.error('Please write your custom category name.');
      return;
    }

    const extraCustomSkills = customSkillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const finalSkills = [...new Set([...selectedSkills, ...extraCustomSkills])];

    setSubmitting(true);
    try {
      const headline =
        role === 'JOB_SEEKER' ? `${finalCategory} Professional` : undefined;

      if (role === 'JOB_SEEKER') {
        localStorage.setItem(
          'hiresphere_seeker_prefs',
          JSON.stringify({
            preferredCategory: finalCategory,
            skills: finalSkills,
            headline,
          })
        );
      }

      const user = await register({
        name,
        email,
        password,
        role,
        companyName: role === 'EMPLOYER' ? companyName : undefined,
        preferredCategory: role === 'JOB_SEEKER' ? finalCategory : undefined,
        skills: role === 'JOB_SEEKER' ? finalSkills : undefined,
        headline,
      });

      if (role === 'JOB_SEEKER') {
        try {
          await api.put('/profile', {
            name,
            headline,
            skills: finalSkills,
            location: 'Dhaka, Bangladesh',
          });
          await refreshUser();
        } catch {
          // Ignore if profile update is already handled
        }
      }

      navigate(getDashboardPath(user.role));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const availableSkillChips = SUGGESTED_SKILL_TAGS[preferredCategory] || [];

  return (
    <div className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-gradient-to-b from-[#162238] via-[#1c2e4a] to-slate-100 px-4 py-10 sm:px-6 sm:py-14">
      {/* Subtle Blue Decorative Glows */}
      <div className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-[#1877F2]/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-[#38bdf8]/20 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="grid grid-cols-1 overflow-hidden rounded-3xl border border-white/15 bg-white shadow-[0_25px_70px_rgba(15,23,42,0.35)] lg:grid-cols-12">
          {/* Left Blue Theme Info Panel */}
          <div className="relative flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#162238] via-[#1b3158] to-[#1877F2] p-8 text-white sm:p-10 lg:col-span-5">
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />

            <div>
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 backdrop-blur-xs">
                <div className="grid grid-cols-2 gap-0.5">
                  <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
                  <span className="h-2 w-2 rounded-full bg-white" />
                  <span className="h-2 w-2 rounded-full bg-white" />
                  <span className="h-2 w-2 rounded-full bg-[#38bdf8]" />
                </div>
                <span className="text-xs font-extrabold tracking-wide text-white">
                  Join Hire<span className="text-[#38bdf8]">Sphere</span>
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
                {role === 'JOB_SEEKER'
                  ? 'Get Instant Job Recommendations in Any Sector.'
                  : role === 'EMPLOYER'
                  ? 'Hire Verified Talent Across All Sectors.'
                  : 'System Administration & Platform Governance.'}
              </h2>
              <p className="mt-3 text-xs leading-relaxed text-blue-100/90 sm:text-sm">
                {role === 'JOB_SEEKER'
                  ? 'Pick a category from the list or select "Others" to write your own custom career field. Right after registration, your dashboard curates matching jobs!'
                  : role === 'EMPLOYER'
                  ? 'Create your employer workspace to publish openings in any category, review resumes, and manage shortlists.'
                  : 'Register or sign in to the Admin Console to verify employers, moderate job posts, and oversee users.'}
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-[#38bdf8]">
                    <FiCompass className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white sm:text-sm">
                      Custom Category Support (&quot;Others&quot;)
                    </p>
                    <p className="text-[11px] text-blue-100/80">
                      Not in tech? Choose &quot;Others&quot; and type your own sector name freely.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-[#38bdf8]">
                    <FiAward className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white sm:text-sm">
                      3 Role Portals Included
                    </p>
                    <p className="text-[11px] text-blue-100/80">
                      Dedicated workspaces for Job Seekers, Employers, and Administrators.
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

          {/* Right Registration Form Panel */}
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:col-span-7">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-5">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#1877F2]">
                  New Account Registration
                </span>
                <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                  Create Your Account
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  Select your portal type below to get started.
                </p>
              </div>

              {/* 3-Portal Role Selector (Job Seeker | Employer | Admin Portal) */}
              <div className="mb-5 grid grid-cols-3 gap-2 rounded-2xl bg-slate-100 p-1.5">
                <button
                  type="button"
                  onClick={() => setRole('JOB_SEEKER')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
                    role === 'JOB_SEEKER'
                      ? 'bg-[#1877F2] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FiUser className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Job Seeker</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('EMPLOYER')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
                    role === 'EMPLOYER'
                      ? 'bg-[#1877F2] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FiBriefcase className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Employer</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition ${
                    role === 'ADMIN'
                      ? 'bg-[#1877F2] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FiShield className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">Admin Portal</span>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Full Name
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 transition focus-within:border-[#1877F2] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#1877F2]/15">
                    <FiUser className="h-4 w-4 shrink-0 text-[#1877F2]" />
                    <input
                      type="text"
                      name="hiresphere_reg_name"
                      autoComplete="off"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                {role === 'EMPLOYER' && (
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Company Name
                    </label>
                    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 transition focus-within:border-[#1877F2] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#1877F2]/15">
                      <FiBriefcase className="h-4 w-4 shrink-0 text-[#1877F2]" />
                      <input
                        type="text"
                        name="hiresphere_reg_company"
                        autoComplete="off"
                        required
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter your company or organization name"
                        className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 transition focus-within:border-[#1877F2] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#1877F2]/15">
                    <FiMail className="h-4 w-4 shrink-0 text-[#1877F2]" />
                    <input
                      type="email"
                      name="hiresphere_reg_email"
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
                  <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password (min 6 characters)
                  </label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 transition focus-within:border-[#1877F2] focus-within:bg-white focus-within:ring-3 focus-within:ring-[#1877F2]/15">
                    <FiLock className="h-4 w-4 shrink-0 text-[#1877F2]" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="hiresphere_reg_password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
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

                {/* Job Seeker Career Interest & Custom "Others" Category Input */}
                {role === 'JOB_SEEKER' && (
                  <div className="space-y-3 rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#162238]">
                        Preferred Job Category (For Instant Recommendations)
                      </label>
                      <select
                        value={preferredCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className="w-full rounded-xl border border-blue-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 focus:border-[#1877F2] focus:outline-none"
                      >
                        {CAREER_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat === 'Others' ? 'Others (Write Your Own Category)' : cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {preferredCategory === 'Others' && (
                      <div>
                        <label className="mb-1 block text-xs font-bold text-[#1877F2]">
                          Write Your Custom Category / Sector *
                        </label>
                        <div className="flex items-center gap-2 rounded-xl border border-blue-300 bg-white px-3.5 py-2">
                          <FiEdit3 className="h-4 w-4 shrink-0 text-[#1877F2]" />
                          <input
                            type="text"
                            required
                            value={customCategory}
                            onChange={(e) => setCustomCategory(e.target.value)}
                            placeholder="e.g. Finance & Accounting, HR, Civil Engineering, Healthcare..."
                            className="w-full bg-transparent text-xs font-medium text-slate-800 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="mb-1.5 text-[11px] font-semibold text-slate-600">
                        Select or Add Your Skills:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {availableSkillChips.map((skill) => {
                          const active = selectedSkills.includes(skill);
                          return (
                            <button
                              key={skill}
                              type="button"
                              onClick={() => toggleSkillTag(skill)}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition ${
                                active
                                  ? 'bg-[#1877F2] text-white shadow-xs'
                                  : 'border border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                              }`}
                            >
                              {active ? `✓ ${skill}` : `+ ${skill}`}
                            </button>
                          );
                        })}
                      </div>
                      <input
                        type="text"
                        value={customSkillsInput}
                        onChange={(e) => setCustomSkillsInput(e.target.value)}
                        placeholder="Or type custom skills (comma-separated, e.g. Tally, AutoCAD, Canva)"
                        className="mt-2 w-full rounded-xl border border-blue-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:border-[#1877F2] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#1877F2] to-[#1464cc] py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:from-[#1464cc] hover:to-[#1052ab] disabled:opacity-50"
                >
                  <span>{submitting ? 'Creating Account...' : 'Create Account & Continue'}</span>
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </form>

              <div className="mt-6 border-t border-slate-100 pt-5 text-center">
                <p className="text-xs text-slate-500 sm:text-sm">
                  Already have a HireSphere account?{' '}
                  <Link
                    to="/login"
                    className="font-bold text-[#1877F2] transition hover:text-[#1464cc] hover:underline"
                  >
                    Sign in here
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

export default Register;
