import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiBriefcase } from 'react-icons/fi';
import { getFileUrl } from '../services/api';

const JOB_TYPE_PILL = {
  'Full-time': 'bg-rose-50 text-rose-500',
  Internship: 'bg-emerald-50 text-emerald-600',
  'Part-time': 'bg-amber-50 text-amber-600',
  Contract: 'bg-slate-100 text-slate-600',
  Remote: 'bg-sky-50 text-sky-600',
};

const JobCard = ({ job, isSaved = false, onToggleSave }) => {
  const companyName = job.company?.name || 'HireSphere Partner';
  const logoUrl = getFileUrl(job.company?.logoPath);
  const pillClass = JOB_TYPE_PILL[job.jobType] || 'bg-slate-100 text-slate-600';

  return (
    <div className="group flex flex-col items-center justify-between rounded-[4px] border border-slate-100 bg-white p-5 text-center shadow-[0_2px_15px_rgba(0,0,0,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(24,119,242,0.12)]">
      <div className="flex w-full items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${pillClass}`}
        >
          {job.jobType}
        </span>

        {onToggleSave ? (
          <button
            type="button"
            onClick={() => onToggleSave(job._id)}
            title={isSaved ? 'Remove from Saved Jobs' : 'Save Job'}
            className={`rounded-full p-1 transition ${
              isSaved ? 'text-rose-500' : 'text-slate-300 hover:text-rose-400'
            }`}
          >
            <FiHeart className={`h-4 w-4 ${isSaved ? 'fill-rose-500' : ''}`} />
          </button>
        ) : (
          <span className="text-slate-200">
            <FiHeart className="h-4 w-4" />
          </span>
        )}
      </div>

      <div className="my-5">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={companyName}
            className="h-14 w-14 rounded-full border border-slate-100 object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-sky-100 bg-sky-50 text-[#1877F2]">
            <FiBriefcase className="h-6 w-6" />
          </div>
        )}
      </div>

      <div className="w-full">
        <Link
          to={`/jobs/${job._id}`}
          className="line-clamp-1 block text-[15px] font-bold text-[#1e293b] transition group-hover:text-[#1877F2]"
        >
          {job.title}
        </Link>
        <p className="mt-1 line-clamp-1 text-xs text-slate-400">
          {job.location} • {companyName}
        </p>
        <p className="mt-1 text-[11px] font-semibold text-[#1877F2]">
          ৳{Number(job.salaryMin).toLocaleString()} – ৳{Number(job.salaryMax).toLocaleString()}
        </p>
      </div>

      <Link
        to={`/jobs/${job._id}`}
        className="mt-5 inline-block rounded-full border border-slate-200 bg-white px-5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-600 transition hover:border-[#1877F2] hover:bg-[#1877F2] hover:text-white"
      >
        Browse Job
      </Link>
    </div>
  );
};

export default JobCard;
