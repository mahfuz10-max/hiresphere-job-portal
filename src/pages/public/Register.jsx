import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiBriefcase } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const { register, getDashboardPath } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('JOB_SEEKER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const user = await register({
        name,
        email,
        password,
        role,
        companyName: role === 'EMPLOYER' ? companyName : undefined,
      });
      navigate(getDashboardPath(user.role));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[82vh] max-w-lg flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-extrabold text-slate-900">Create Your HireSphere Account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Choose your account type to get started
          </p>
        </div>

        {/* Role Selector */}
        <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl bg-slate-100 p-1.5">
          <button
            type="button"
            onClick={() => setRole('JOB_SEEKER')}
            className={`rounded-lg py-2.5 text-xs font-bold transition ${
              role === 'JOB_SEEKER'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole('EMPLOYER')}
            className={`rounded-lg py-2.5 text-xs font-bold transition ${
              role === 'EMPLOYER'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Employer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Full Name</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <FiUser className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Mustafizur Rahman Mahfuz"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

          {role === 'EMPLOYER' && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">Company Name</label>
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                <FiBriefcase className="h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="TechNova Solutions BD"
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Email Address</label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <FiMail className="h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Password (min 6 characters)
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
              <FiLock className="h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-blue-600 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
