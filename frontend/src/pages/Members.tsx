import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { User } from '../types';
import { Plus, Search, Filter, Edit2, Trash2, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Members: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'member', status: 'active' });

  const queryClient = useQueryClient();

  const { data: members, isLoading } = useQuery<User[]>({
    queryKey: ['members'],
    queryFn: () => api.get('/members').then(res => res.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/members/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
    },
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
      setFormData({ name: member.name, email: member.email, password: '', role: member.role || 'member', status: 'active' });
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

  const filteredMembers = members?.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Members Management</h1>
        <button
          type="button"
          onClick={() => openModal()}
          className="bg-brand-medium text-white px-5 py-2.5 rounded-2xl flex items-center space-x-2 hover:bg-brand-light transition-all shadow-lg shadow-brand-medium/20 font-bold"
        >
          <Plus size={20} />
          <span>Add Member</span>
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between gap-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-medium/50" size={20} />
            <input
              type="text"
              placeholder="Search members by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 border-2 border-gray-50 bg-gray-50 rounded-2xl focus:border-brand-medium focus:ring-0 transition-all font-medium"
            />
          </div>
          <button type="button" className="flex items-center space-x-2 px-6 py-3.5 border-2 border-gray-50 rounded-2xl hover:bg-brand-pale/10 hover:text-brand-medium transition-all font-bold text-gray-500">
            <Filter size={20} />
            <span>Filter</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-brand-deep text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                {user?.role === 'SuperAdmin' && <th className="px-8 py-4">Organization</th>}
                <th className="px-8 py-4">Member</th>
                <th className="px-8 py-4">Role</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Join Date</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={user?.role === 'SuperAdmin' ? 6 : 5} className="px-8 py-10 text-center text-gray-400 font-medium">Loading members...</td>
                </tr>
              ) : filteredMembers?.length === 0 ? (
                <tr>
                  <td colSpan={user?.role === 'SuperAdmin' ? 6 : 5} className="px-8 py-10 text-center text-gray-400 font-medium">No members found</td>
                </tr>
              ) : (
                filteredMembers?.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                    {user?.role === 'SuperAdmin' && (
                      <td className="px-8 py-5 text-sm text-brand-dark font-bold">
                        {member.organization_name}
                      </td>
                    )}
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <img
                          src={member.profile_photo_path || `https://ui-avatars.com/api/?name=${member.name}&background=ecf39e&color=132a13`}
                          alt=""
                          className="w-11 h-11 rounded-2xl border-2 border-white shadow-sm ring-1 ring-gray-100"
                        />
                        <div>
                          <p className="text-sm font-bold text-brand-dark">{member.name}</p>
                          <p className="text-xs text-brand-deep font-medium">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-brand-deep font-medium uppercase tracking-wider">{member.role}</td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1 text-[10px] font-black rounded-lg bg-brand-pale/40 text-brand-medium uppercase tracking-widest">
                        Active
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-brand-deep font-medium">
                      {member.join_date ? new Date(member.join_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button title="Edit member" type="button" onClick={() => openModal(member)} className="p-2 bg-white shadow-sm border border-gray-100 rounded-xl hover:text-brand-medium transition-colors"><Edit2 size={16} /></button>
                        <button title="Delete member" type="button" onClick={() => deleteMutation.mutate(member.id)} className="p-2 bg-white shadow-sm border border-gray-100 rounded-xl hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black text-brand-dark tracking-tight">{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
              <button title="Close modal" type="button" onClick={closeModal} className="p-2 hover:bg-white rounded-xl transition-colors text-gray-400 hover:text-brand-dark"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-brand-deep uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl px-6 py-3.5 focus:border-brand-medium focus:ring-0 transition-all font-medium"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-brand-deep uppercase tracking-widest ml-1">Email address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl px-6 py-3.5 focus:border-brand-medium focus:ring-0 transition-all font-medium"
                  placeholder="john@example.com"
                />
              </div>
              {!editingMember && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-brand-deep uppercase tracking-widest ml-1">Password</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl px-6 py-3.5 focus:border-brand-medium focus:ring-0 transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-brand-deep uppercase tracking-widest ml-1">Role / Position</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl px-6 py-3.5 focus:border-brand-medium focus:ring-0 transition-all font-medium"
                  placeholder="e.g. Developer, Member"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-black text-brand-deep uppercase tracking-widest ml-1">Account Status</label>
                <select
                  title="Select account status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border-2 border-gray-50 bg-gray-50 rounded-2xl px-6 py-3.5 focus:border-brand-medium focus:ring-0 transition-all font-medium appearance-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="pt-6 flex space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-4 border-2 border-gray-50 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 hover:text-brand-dark transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-brand-medium text-white rounded-2xl font-black hover:bg-brand-light transition-all shadow-xl shadow-brand-medium/20"
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
