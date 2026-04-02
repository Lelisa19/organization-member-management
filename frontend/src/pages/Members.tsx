import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { User } from '../types';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Download,
  Upload,
  List,
  MoreVertical,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import OrgAdminPageHeader from '../components/org-admin/OrgAdminPageHeader';
import { relativeTime } from '../lib/relativeTime';

const PAGE_SIZE = 7;

const Members: React.FC = () => {
  const { user } = useAuth();
  const isOrgAdmin = user?.role === 'orgAdmin';
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'member',
    status: 'active',
  });

  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery<User[]>({
    queryKey: ['members'],
    queryFn: () => api.get('/members').then((res) => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/members/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['members'] }),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/members', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: number; member: any }) => api.put(`/members/${data.id}`, data.member),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      closeModal();
    },
  });

  const filteredMembers = useMemo(() => {
    const list = members ?? [];
    const q = searchTerm.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (m) =>
        m.name?.toLowerCase().includes(q) ||
        (m.email && m.email.toLowerCase().includes(q))
    );
  }, [members, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / PAGE_SIZE));
  const pageSafe = Math.min(page, totalPages);
  const paged = useMemo(() => {
    const start = (pageSafe - 1) * PAGE_SIZE;
    return filteredMembers.slice(start, start + PAGE_SIZE);
  }, [filteredMembers, pageSafe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, member: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const openModal = (member?: User) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        password: '',
        role: member.role || 'member',
        status: 'active',
      });
    } else {
      setEditingMember(null);
      setFormData({ name: '', email: '', password: '', role: 'member', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
    setFormData({ name: '', email: '', password: '', role: 'member', status: 'active' });
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === paged.length) setSelected(new Set());
    else setSelected(new Set(paged.map((m) => m.id)));
  };

  const colCount =
    user?.role === 'SuperAdmin'
      ? 6
      : isOrgAdmin
        ? 8
        : 6;

  const lastActive = (m: User & { updatedAt?: string }) =>
    relativeTime(m.updatedAt || m.join_date || undefined);

  const joinFull = (m: User) =>
    m.join_date
      ? new Date(m.join_date).toLocaleString()
      : '—';

  const tableSection = (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {isOrgAdmin && (
        <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
          <div className="relative flex-1 min-w-0 max-w-xl">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="search"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              <Download size={16} />
              Export
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              <Upload size={16} />
              Import
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              <List size={16} />
              Bulk Actions
            </button>
          </div>
        </div>
      )}

      {!isOrgAdmin && (
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="search"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm"
            />
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50/80 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
            <tr>
              {isOrgAdmin && (
                <th className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={paged.length > 0 && selected.size === paged.length}
                    onChange={toggleSelectAll}
                    title="Select all on page"
                  />
                </th>
              )}
              {user?.role === 'SuperAdmin' && <th className="px-4 py-3">Organization</th>}
              <th className="px-4 py-3">Member</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 whitespace-nowrap">Join Date</th>
              {isOrgAdmin && <th className="px-4 py-3 whitespace-nowrap">Last Active</th>}
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={colCount} className="px-4 py-12 text-center text-gray-400">
                  Loading members...
                </td>
              </tr>
            ) : paged.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-4 py-12 text-center text-gray-400">
                  No members found
                </td>
              </tr>
            ) : (
              paged.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/80">
                  {isOrgAdmin && (
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                        checked={selected.has(member.id)}
                        onChange={() => toggleSelect(member.id)}
                        title="Select row"
                      />
                    </td>
                  )}
                  {user?.role === 'SuperAdmin' && (
                    <td className="px-4 py-4 text-gray-800 font-medium">
                      {(member as User & { organization_name?: string }).organization_name}
                    </td>
                  )}
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          member.profile_photo_path ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=e0e7ff&color=3730a3`
                        }
                        alt=""
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-100"
                      />
                      <div>
                        <p className="font-bold text-gray-900">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-indigo-600 font-semibold lowercase">{member.role || 'member'}</span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400 ring-2 ring-sky-100" title="Active" />
                  </td>
                  <td className="px-4 py-4 text-gray-600 whitespace-nowrap font-mono text-xs">
                    {joinFull(member)}
                  </td>
                  {isOrgAdmin && (
                    <td className="px-4 py-4 text-gray-600">{lastActive(member as User & { updatedAt?: string })}</td>
                  )}
                  <td className="px-4 py-4 text-right">
                    <div className="inline-flex items-center gap-1 justify-end">
                      <button
                        type="button"
                        title="Edit"
                        onClick={() => openModal(member)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        type="button"
                        title="Delete"
                        onClick={() => deleteMutation.mutate(member.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-red-500"
                      >
                        <Trash2 size={16} />
                      </button>
                      {isOrgAdmin && (
                        <button type="button" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                          <MoreVertical size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isOrgAdmin && filteredMembers.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-gray-600">
          <p>
            Showing {(pageSafe - 1) * PAGE_SIZE + 1} to{' '}
            {Math.min(pageSafe * PAGE_SIZE, filteredMembers.length)} of {filteredMembers.length} members
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={pageSafe <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - pageSafe) <= 1)
              .map((n, i, arr) => (
                <React.Fragment key={n}>
                  {i > 0 && arr[i - 1] !== n - 1 && <span className="px-1">…</span>}
                  <button
                    type="button"
                    onClick={() => setPage(n)}
                    className={`min-w-[36px] py-1.5 rounded-lg border text-sm font-bold ${
                      pageSafe === n
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    {n}
                  </button>
                </React.Fragment>
              ))}
            <button
              type="button"
              disabled={pageSafe >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-0 font-poppins">
      {isOrgAdmin ? (
        <>
          <OrgAdminPageHeader
            title="Member Management"
            subtitle="Manage your organization members"
            actions={
              <button
                type="button"
                onClick={() => openModal()}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-500"
              >
                <Plus size={18} />
                Add Member
              </button>
            }
          />
          {tableSection}
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-brand-dark tracking-tight">Members</h1>
            <button
              type="button"
              onClick={() => openModal()}
              className="bg-brand-medium text-white px-5 py-2.5 rounded-2xl flex items-center space-x-2 hover:bg-brand-light font-bold"
            >
              <Plus size={20} />
              <span>Add Member</span>
            </button>
          </div>
          {tableSection}
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col border border-gray-100">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
              <h3 className="text-lg font-black text-gray-900">
                {editingMember ? 'Edit Member' : 'Add New Member'}
              </h3>
              <button type="button" onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
              {!editingMember && (
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Role</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-gray-200 py-3 font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-500"
                >
                  {editingMember ? 'Update' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
