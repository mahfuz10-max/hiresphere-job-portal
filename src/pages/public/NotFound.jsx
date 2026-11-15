import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-extrabold text-blue-600">404</p>
      <h1 className="mt-3 text-2xl font-bold text-slate-900">Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-500">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
