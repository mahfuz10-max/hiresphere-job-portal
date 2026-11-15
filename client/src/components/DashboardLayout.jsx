import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  FiGrid,
  FiUser,
  FiFileText,
  FiBookmark,
  FiBriefcase,
  FiPlusCircle,
  FiUsers,
  FiCheckCircle,
  FiLayers,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const ROLE_LINKS = {
  JOB_SEEKER: [
    { to: '/seeker/dashboard', label: 'Overview', icon: FiGrid },
    { to: '/seeker/profile', label: 'My Profile & Resume', icon: FiUser },
    { to: '/seeker/applications', label: 'Applied Jobs', icon: FiFileText },
    { to: '/seeker/saved', label: 'Saved Jobs', icon: FiBookmark },
  ],
  EMPLOYER: [
    { to: '/employer/dashboard', label: 'Analytics Dashboard', icon: FiGrid },
    { to: '/employer/company', label: 'Company Profile', icon: FiBriefcase },
    { to: '/employer/jobs', label: 'Manage Job Posts', icon: FiLayers },
    { to: '/employer/jobs/new', label: 'Post a New Job', icon: FiPlusCircle },
  ],
  ADMIN: [
    { to: '/admin/dashboard', label: 'Platform Overview', icon: FiGrid },
    { to: '/admin/users', label: 'Manage Users', icon: FiUsers },
    { to: '/admin/employers', label: 'Verify Employers', icon: FiCheckCircle },
    { to: '/admin/jobs', label: 'Moderate All Jobs', icon: FiBriefcase },
  ],
};

const DashboardLayout = () => {
  const { user } = useAuth();
  const links = ROLE_LINKS[user?.role] || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="mb-4 border-b border-slate-100 pb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {user?.role?.replace('_', ' ')} WORKSPACE
              </p>
              <p className="mt-1 truncate text-base font-bold text-slate-900">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>

            <nav className="space-y-1.5">
              {links.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="lg:col-span-9">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
