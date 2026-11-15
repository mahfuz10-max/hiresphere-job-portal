import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';
import JobCard from '../../components/JobCard';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';

const SeekerSaved = () => {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const { data } = await api.get('/saved');
        if (data.success) setSavedItems(data.data);
      } catch {
        toast.error('Failed to load saved jobs.');
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const handleUnsave = async (jobId) => {
    try {
      await api.delete(`/saved/${jobId}`);
      setSavedItems((prev) => prev.filter((item) => item.job?._id !== jobId));
      toast.success('Job removed from saved list.');
    } catch {
      toast.error('Could not remove saved job.');
    }
  };

  if (loading) return <Loader text="Loading saved jobs..." />;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Saved Favorite Jobs</h1>
        <p className="mt-1 text-xs text-slate-500">
          Bookmark interesting openings and apply before their deadline.
        </p>
      </div>

      {savedItems.length === 0 ? (
        <EmptyState
          title="No saved jobs yet"
          description="Click the bookmark icon on any job card to save it here for quick access."
          action={
            <Link
              to="/jobs"
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white"
            >
              Explore Jobs
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {savedItems.map((item) => (
            <JobCard
              key={item._id}
              job={item.job}
              isSaved
              onToggleSave={handleUnsave}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SeekerSaved;
