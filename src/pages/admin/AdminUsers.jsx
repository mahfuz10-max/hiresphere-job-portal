import React, { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiSlash, FiUnlock, FiTrash2 } from 'react-icons/fi';
import api from '../../services/api';
import Loader from '../../components/Loader';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', {
        params: { search, role: roleFilter },
      });
      if (data.success) setUsers(data.data);
    } catch {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleToggleBlock = async (userId) => {
    try {
      const { data } = await api.patch(`/admin/users/${userId}/block`);
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isBlocked: data.data.isBlocked } : u))
        );
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed.');
    }
  };

  const handleDelete = async (userId) => {
    try {
      const { data } = await api.delete(`/admin/users/${userId}`);
      if (data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        toast.success('User deleted.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not delete user.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Manage Registered Users</h1>
          <p className="mt-1 text-xs text-slate-500">
            Search accounts, block/unblock access, or remove fraudulent users.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
            <FiSearch className="h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name or email..."
              className="bg-transparent text-xs focus:outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold"
          >
            <option value="ALL">All Roles</option>
            <option value="JOB_SEEKER">Job Seekers</option>
            <option value="EMPLOYER">Employers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading users..." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase text-slate-400">
                <th className="pb-3 font-semibold">Name & Email</th>
                <th className="pb-3 font-semibold">Role</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Joined</th>
                <th className="pb-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="py-3.5">
                    <p className="font-bold text-slate-900">{u.name}</p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </td>
                  <td className="py-3.5">
                    <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5">
                    {u.isBlocked ? (
                      <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                        Blocked
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 text-xs text-slate-500">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 text-right">
                    {u.role !== 'ADMIN' && (
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(u._id)}
                          className={`inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold ${
                            u.isBlocked
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                          }`}
                        >
                          {u.isBlocked ? (
                            <>
                              <FiUnlock className="h-3.5 w-3.5" /> Unblock
                            </>
                          ) : (
                            <>
                              <FiSlash className="h-3.5 w-3.5" /> Block
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(u._id)}
                          className="inline-flex items-center gap-1 rounded-xl bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100"
                        >
                          <FiTrash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
