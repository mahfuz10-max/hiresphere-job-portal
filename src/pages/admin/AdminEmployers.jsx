import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiShield } from 'react-icons/fi';
import api from '../../services/api';
import Loader from '../../components/Loader';

const AdminEmployers = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await api.get('/admin/stats');
        if (data.success) setCompanies(data.data.companies || []);
      } catch {
        toast.error('Failed to load employers.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleToggleVerify = async (companyId) => {
    try {
      const { data } = await api.patch(`/admin/employers/${companyId}/verify`);
      if (data.success) {
        setCompanies((prev) =>
          prev.map((c) => (c._id === companyId ? { ...c, isVerified: data.data.isVerified } : c))
        );
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification toggle failed.');
    }
  };

  if (loading) return <Loader text="Loading employer accounts..." />;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h1 className="text-xl font-bold text-slate-900">Employer Verification Management</h1>
        <p className="mt-1 text-xs text-slate-500">
          Grant or revoke the Verified Employer badge displayed on company profiles and job cards.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {companies.map((c) => (
          <div
            key={c._id}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">{c.name}</h3>
                {c.isVerified ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-700">
                    <FiCheckCircle className="h-3.5 w-3.5" />
                    Verified
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                    Unverified
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Owner: {c.owner?.name} ({c.owner?.email})
              </p>
              <p className="mt-2 text-xs text-slate-600">{c.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-500">
                <span>Industry: {c.industry || 'Technology'}</span>
                <span>•</span>
                <span>Location: {c.location || 'Dhaka'}</span>
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => handleToggleVerify(c._id)}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
                  c.isVerified
                    ? 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
                }`}
              >
                <FiShield className="h-4 w-4" />
                {c.isVerified ? 'Revoke Verified Badge' : 'Approve & Verify Employer'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEmployers;
