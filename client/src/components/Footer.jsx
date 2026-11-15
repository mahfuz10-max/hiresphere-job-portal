import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#162238] text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="grid grid-cols-2 gap-0.5">
                <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
                <span className="h-2 w-2 rounded-full bg-white" />
                <span className="h-2 w-2 rounded-full bg-white" />
                <span className="h-2 w-2 rounded-full bg-[#1877F2]" />
              </div>
              <span className="text-lg font-extrabold text-white">
                Hire<span className="text-[#38bdf8]">Sphere</span>
              </span>
            </div>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-slate-400">
              HireSphere – Online Job Portal Management System. Connecting talented job seekers,
              verified employers, and platform administrators on one unified recruitment platform.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Platform
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-[#38bdf8]">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#38bdf8]">
                  Job Seeker Registration
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[#38bdf8]">
                  Post a Job (Employers)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Role Portals
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/seeker/dashboard" className="hover:text-[#38bdf8]">
                  Job Seeker Portal
                </Link>
              </li>
              <li>
                <Link to="/employer/dashboard" className="hover:text-[#38bdf8]">
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-[#38bdf8]">
                  Admin Console
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-slate-400">
          HireSphere – Online Job Portal Management System • Developed By Mahfuz
        </div>
      </div>
    </footer>
  );
};

export default Footer;
