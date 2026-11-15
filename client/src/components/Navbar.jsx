import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  FiMenu,
  FiX,
  FiLogOut,
  FiUser,
  FiHome,
  FiBriefcase,
  FiGrid,
  FiUserPlus,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile menu automatically whenever route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#162238] text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand Logo */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2.5"
        >
          <div className="grid grid-cols-2 gap-0.5">
            <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="h-2 w-2 rounded-full bg-white" />
            <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            Hire<span className="text-[#38bdf8]">Sphere</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-7 md:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-[11px] font-semibold uppercase tracking-wider transition ${
                isActive ? 'text-[#38bdf8]' : 'text-slate-200 hover:text-white'
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `text-[11px] font-semibold uppercase tracking-wider transition ${
                isActive ? 'text-[#38bdf8]' : 'text-slate-200 hover:text-white'
              }`
            }
          >
            Jobs
          </NavLink>
          {user && (
            <NavLink
              to={getDashboardPath()}
              className={({ isActive }) =>
                `text-[11px] font-semibold uppercase tracking-wider transition ${
                  isActive ? 'text-[#38bdf8]' : 'text-slate-200 hover:text-white'
                }`
              }
            >
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Desktop Auth Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <>
              <Link
                to={getDashboardPath()}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-200 hover:text-white"
              >
                <FiUser className="h-3.5 w-3.5 text-[#38bdf8]" />
                <span>{user.name}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 rounded-[4px] bg-[#1877F2] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#1464cc]"
              >
                <FiLogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-200 hover:text-white"
              >
                <FiUser className="h-3.5 w-3.5" />
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-[4px] bg-[#1877F2] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#1464cc]"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Quick Action + Hamburger Toggle Button */}
        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg bg-[#1877F2] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white"
            >
              Login
            </Link>
          )}
          <button
            type="button"
            aria-label="Toggle Mobile Navigation Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/10 p-2 text-white transition hover:bg-white/20 active:scale-95"
          >
            {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#121c2e] px-4 pb-5 pt-3 shadow-2xl md:hidden">
          <nav className="flex flex-col space-y-1.5">
            <NavLink
              to="/"
              end
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#1877F2] text-white'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <FiHome className="h-4 w-4 shrink-0" />
              <span>Home</span>
            </NavLink>

            <NavLink
              to="/jobs"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-[#1877F2] text-white'
                    : 'text-slate-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <FiBriefcase className="h-4 w-4 shrink-0" />
              <span>Browse Jobs</span>
            </NavLink>

            {user && (
              <NavLink
                to={getDashboardPath()}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-[#1877F2] text-white'
                      : 'text-slate-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <FiGrid className="h-4 w-4 shrink-0" />
                <span>My Dashboard</span>
              </NavLink>
            )}
          </nav>

          <div className="mt-4 border-t border-white/10 pt-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3.5 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1877F2] text-xs font-bold text-white">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-white">{user.name}</p>
                    <p className="truncate text-[11px] text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-rose-700"
                >
                  <FiLogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white/10"
                >
                  <FiUser className="h-4 w-4 text-[#38bdf8]" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-[#1877F2] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#1464cc]"
                >
                  <FiUserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
