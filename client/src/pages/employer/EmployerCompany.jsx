import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUpload, FiCheckCircle, FiSave } from 'react-icons/fi';
import api, { getFileUrl } from '../../services/api';
import Loader from '../../components/Loader';

const EmployerCompany = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [company, setCompany] = useState({
    name: '',
    logoPath: '',
    description: '',
    website: '',
    industry: '',
    location: '',
    size: '11-50 employees',
    isVerified: false,
  });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const { data } = await api.get('/company');
        if (data.success) setCompany(data.data);
      } catch {
        toast.error('Failed to load company profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchCompany();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put('/company', company);
      if (data.success) {
        setCompany(data.data);
        toast.success('Company profile updated!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update company profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('logo', file);
    setUploading(true);
    try {
      const { data } = await api.post('/company/logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setCompany((prev) => ({ ...prev, logoPath: data.data.logoPath }));
        toast.success('Company logo updated!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logo upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) return <Loader text="Loading company profile..." />;

  const logoUrl = getFileUrl(company.logoPath);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={company.name}
                className="h-16 w-16 rounded-2xl border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold text-white">
                {company.name?.charAt(0) || 'C'}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">{company.name}</h1>
                {company.isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-700">
                    <FiCheckCircle className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Upload your brand logo and keep company details up to date for applicants.
              </p>
            </div>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100">
            <FiUpload className="h-4 w-4 text-blue-600" />
            <span>{uploading ? 'Uploading...' : 'Upload Logo'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <form
        onSubmit={handleSave}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Company Name</label>
            <input
              type="text"
              required
              value={company.name}
              onChange={(e) => setCompany({ ...company, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Industry</label>
            <input
              type="text"
              value={company.industry}
              onChange={(e) => setCompany({ ...company, industry: e.target.value })}
              placeholder="Software & IT Services"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Website URL</label>
            <input
              type="url"
              value={company.website}
              onChange={(e) => setCompany({ ...company, website: e.target.value })}
              placeholder="https://example.com"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Headquarters Location</label>
            <input
              type="text"
              value={company.location}
              onChange={(e) => setCompany({ ...company, location: e.target.value })}
              placeholder="Gulshan-2, Dhaka"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Company Size</label>
            <select
              value={company.size}
              onChange={(e) => setCompany({ ...company, size: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            >
              <option value="1-10 employees">1-10 employees</option>
              <option value="11-50 employees">11-50 employees</option>
              <option value="51-200 employees">51-200 employees</option>
              <option value="201-500 employees">201-500 employees</option>
              <option value="500+ employees">500+ employees</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Company Description
          </label>
          <textarea
            rows={4}
            value={company.description}
            onChange={(e) => setCompany({ ...company, description: e.target.value })}
            placeholder="Describe your company mission, engineering culture, and products..."
            className="w-full rounded-xl border border-slate-200 p-3.5 text-sm focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-xs hover:bg-blue-700 disabled:opacity-50"
          >
            <FiSave className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Company Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployerCompany;
