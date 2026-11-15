import React from 'react';
import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ title = 'No records found', description = '', action = null }) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        <FiInbox className="h-7 w-7" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;
