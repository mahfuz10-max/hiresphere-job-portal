import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiUpload, FiTrash2, FiFileText, FiSave } from 'react-icons/fi';
import api, { getFileUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader';

const SeekerProfile = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    location: '',
    headline: '',
    education: '',
    skills: '',
    experience: '',
    about: '',
    resumePath: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/profile');
        if (data.success) {
          const p = data.data;
          setForm({
            name: p.user?.name || user?.name || '',
            phone: p.phone || '',
            location: p.location || '',
            headline: p.headline || '',
            education: p.education || '',
            skills: Array.isArray(p.skills) ? p.skills.join(', ') : '',
            experience: p.experience || '',
            about: p.about || '',
            resumePath: p.resumePath || '',
          });
        }
      } catch {
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const skillsArray = form.skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const { data } = await api.put('/profile', {
        ...form,
        skills: skillsArray,
      });
      if (data.success) {
        toast.success('Profile updated successfully!');
        await refreshUser();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('resume', file);
    setUploading(true);
    try {
      const { data } = await api.post('/profile/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.success) {
        setForm((prev) => ({ ...prev, resumePath: data.data.resumePath }));
        toast.success('Resume uploaded successfully!');
        await refreshUser();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Resume upload failed.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteResume = async () => {
    try {
      const { data } = await api.delete('/profile/resume');
      if (data.success) {
        setForm((prev) => ({ ...prev, resumePath: '' }));
        toast.success('Resume deleted.');
        await refreshUser();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete resume.');
    }
  };

  if (loading) return <Loader text="Loading profile..." />;

  const skillTags = form.skills
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Resume Upload Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900">Resume / CV Management</h2>
        <p className="mt-1 text-xs text-slate-500">
          Upload your latest Resume/CV (PDF, DOC, DOCX — Max 5 MB) for one-click job applications.
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-slate-50 p-4">
          {form.resumePath ? (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <FiFileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Resume Uploaded & Ready</p>
                <a
                  href={getFileUrl(form.resumePath)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  View / Download Current Resume
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm font-medium text-slate-500">No resume uploaded yet.</p>
          )}

          <div className="flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-blue-700">
              <FiUpload className="h-4 w-4" />
              <span>{uploading ? 'Uploading...' : form.resumePath ? 'Replace Resume' : 'Upload Resume'}</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleResumeUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {form.resumePath && (
              <button
                type="button"
                onClick={handleDeleteResume}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100"
              >
                <FiTrash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Personal Profile Form */}
      <form
        onSubmit={handleSave}
        className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs"
      >
        <h2 className="text-lg font-bold text-slate-900">Personal & Academic Profile</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Phone Number</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+880 1711-000000"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Niketan, Dhaka, Bangladesh"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Professional Headline
            </label>
            <input
              type="text"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="Full-Stack MERN Developer"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Skills (comma-separated tags)
          </label>
          <input
            type="text"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            placeholder="React.js, Node.js, Express.js, MongoDB, Tailwind CSS"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
          />
          {skillTags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {skillTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Education</label>
          <input
            type="text"
            value={form.education}
            onChange={(e) => setForm({ ...form, education: e.target.value })}
            placeholder="B.Sc. in Computer Science & Engineering, Southeast University"
            className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Experience</label>
          <textarea
            rows={3}
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            placeholder="Describe your internships, freelance projects, or work experience..."
            className="w-full rounded-xl border border-slate-200 p-3.5 text-sm focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">About Me</label>
          <textarea
            rows={3}
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            placeholder="Write a concise bio highlighting your strengths and career interests..."
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
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeekerProfile;
