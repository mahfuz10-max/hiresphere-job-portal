import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, getDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#162238] text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5">
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

        <nav className="hidden items-center gap-7 md:flex">
          <NavLink
            to="/"
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

        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded p-2 text-slate-200 hover:bg-white/10 md:hidden"
        >
          {mobileOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
