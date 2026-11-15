import React from 'react';

const COLOR_MAP = {
  blue: 'bg-blue-50 text-blue-600',
  teal: 'bg-teal-50 text-teal-600',
  amber: 'bg-amber-50 text-amber-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  rose: 'bg-rose-50 text-rose-600',
  indigo: 'bg-indigo-50 text-indigo-600',
};

const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${COLOR_MAP[color] || COLOR_MAP.blue}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
