import React from 'react';

const Loader = ({ text = 'Loading HireSphere...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-11 w-11 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      <p className="mt-3 text-sm font-medium text-slate-600">{text}</p>
    </div>
  );
};

export default Loader;
