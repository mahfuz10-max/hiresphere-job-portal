import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import Loader from '../../components/Loader';

const CATEGORIES = [
  'Software Engineering',
  'Cybersecurity',
  'Data & AI',
  'UI/UX Design',
  'DevOps & Cloud',
  'Quality Assurance',
  'Marketing',
  'Management',
  'Customer Support',
];

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Remote', 'Contract'];

const formatDateForInput = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const EmployerJobForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Software Engineering',
    location: 'Dhaka',
    jobType: 'Full-time',
    salaryMin: 40000,
    salaryMax: 70000,
    vacancies: 2,
    deadline: formatDateForInput(new Date(Date.now() + 21 * 86400000)),
    description: '',
    requirements: '',
  });

  useEffect(() => {
    if (!isEditing) return;
    const loadJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        if (data.success) {
          const j = data.data;
          setForm({
            title: j.title || '',
            category: j.category || 'Software Engineering',
            location: j.location || 'Dhaka',
            jobType: j.jobType || 'Full-time',
            salaryMin: j.salaryMin || 0,
            salaryMax: j.salaryMax || 0,
            vacancies: j.vacancies || 1,
            deadline: formatDateForInput(j.deadline),
            description: j.description || '',
            requirements: j.requirements || '',
          });
        }
      } catch {
        toast.error('Could not load job post for editing.');
      } finally {
        setLoading(false);
      }
    };
    loadJob();
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(form.salaryMax) < Number(form.salaryMin)) {
      toast.error('Maximum salary must be greater than or equal to minimum salary.');
      return;
    }

    setSubmitting(true);
    try {
      if (isEditing) {
        const { data } = await api.put(`/jobs/${id}`, form);
        if (data.success) {
          toast.success('Job post updated!');
          navigate('/employer/jobs');
        }
      } else {
        const { data } = await api.post('/jobs', form);
        if (data.success) {
          toast.success('New job posted!');
          navigate('/employer/jobs');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save job post.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader text="Loading job details..." />;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate('/employer/jobs')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-blue-600"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to Manage Jobs
      </button>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-xs"
      >
        <h1 className="text-xl font-bold text-slate-900">
          {isEditing ? 'Edit Job Listing' : 'Post a New Job Vacancy'}
        </h1>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Job Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Full-Stack MERN Developer"
              className="w-full rounded-md border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Location</label>
            <input
              type="text"
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Dhaka / Remote"
              className="w-full rounded-md border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Job Type</label>
            <select
              value={form.jobType}
              onChange={(e) => setForm({ ...form, jobType: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
            >
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">Vacancies</label>
            <input
              type="number"
              min={1}
              required
              value={form.vacancies}
              onChange={(e) => setForm({ ...form, vacancies: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Minimum Salary (BDT)
            </label>
            <input
              type="number"
              min={0}
              required
              value={form.salaryMin}
              onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Maximum Salary (BDT)
            </label>
            <input
              type="number"
              min={0}
              required
              value={form.salaryMax}
              onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Application Deadline
            </label>
            <input
              type="date"
              required
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full rounded-md border border-slate-300 px-3.5 py-2 text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">Job Description</label>
          <textarea
            rows={4}
            required
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe day-to-day responsibilities, team structure, and impact..."
            className="w-full rounded-md border border-slate-300 p-3 text-sm focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-slate-700">
            Requirements & Qualifications
          </label>
          <textarea
            rows={4}
            required
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            placeholder="List required technical skills, frameworks, education, and experience..."
            className="w-full rounded-md border border-slate-300 p-3 text-sm focus:border-blue-600 focus:outline-none"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <FiSave className="h-4 w-4" />
            {submitting ? 'Saving...' : isEditing ? 'Update Job Post' : 'Publish Job Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployerJobForm;
