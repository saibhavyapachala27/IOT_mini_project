import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { Users, Search, ArrowUpDown, ChevronDown, Plus, Edit2, Trash2, X, Save, AlertTriangle } from 'lucide-react';

export default function Members({ departments, addToast }) {
  const [membersData, setMembersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Added');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' or 'edit'
  const [selectedMember, setSelectedMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: departments[0] || 'Computer Science',
    role: 'Member'
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('sansah_token');
      const res = await fetch(API_URL + '/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to fetch members');
      const data = await res.json();
      setMembersData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      department: departments[0] || 'Computer Science',
      role: 'Member'
    });
    setFormError('');
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      password: '', // Password is not editable here
      department: member.department || departments[0] || 'Computer Science',
      role: member.role || 'Member'
    });
    setFormError('');
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleDeleteMember = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) return;

    try {
      const token = localStorage.getItem('sansah_token');
      const res = await fetch(`${API_URL}/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete member');
      }

      addToast(`Member "${name}" deleted successfully.`, 'success');
      fetchUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    const { name, email, password, department, role } = formData;
    if (!name.trim() || !email.trim() || !department) {
      setFormError('Please fill out all required fields.');
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem('sansah_token');
      let res;
      let payload = { name: name.trim(), email: email.toLowerCase().trim(), department, role };

      if (modalType === 'add') {
        payload.password = password || 'Password123';
        res = await fetch(API_URL + '/api/admin/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${API_URL}/api/admin/users/${selectedMember.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save member details.');
      }

      addToast(
        modalType === 'add' ? `Member "${name}" registered successfully.` : `Member details updated successfully.`,
        'success'
      );
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Filter members based on search and selected department tab
  const filteredMembers = membersData.filter(m => {
    const matchDept = selectedDept === 'All' || 
      (m.department && m.department.toLowerCase().trim() === selectedDept.toLowerCase().trim());
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      (m.name || '').toLowerCase().includes(query) ||
      (m.department || '').toLowerCase().includes(query) ||
      (m.email || '').toLowerCase().includes(query);

    return matchDept && matchSearch;
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortBy === 'Alphabetical') {
      return (a.name || '').localeCompare(b.name || '');
    } else if (sortBy === 'Department Wise') {
      return (a.department || '').localeCompare(b.department || '');
    } else {
      // Recently Added
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  if (loading) return <div className="py-20 text-center text-slate-400 font-bold">Loading members...</div>;
  if (error) return <div className="py-20 text-center text-rose-500 font-bold">Error: {error}</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-navy-800/40 pb-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Users className="text-cyan-400" size={24} />
            Student Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse and manage all registered students. Add new members or reassign their departments.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      {/* Department Tabs Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin border-b border-navy-850">
        <button
          onClick={() => setSelectedDept('All')}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
            selectedDept === 'All'
              ? 'bg-cyan-500 text-navy-950 border-cyan-500 shadow-md'
              : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          All Departments ({membersData.length})
        </button>
        {departments.map(dept => {
          const count = membersData.filter(m => m.department && m.department.toLowerCase().trim() === dept.toLowerCase().trim()).length;
          return (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                selectedDept === dept
                  ? 'bg-cyan-500 text-navy-950 border-cyan-500 shadow-md'
                  : 'bg-navy-900 border-navy-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {dept} ({count})
            </button>
          );
        })}
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-navy-900/40 border border-navy-800/60 rounded-2xl p-4 backdrop-blur-md">
        <div className="relative w-full md:w-96">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder={`Search members in ${selectedDept === 'All' ? 'All Departments' : selectedDept}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500/50 transition-all"
          />
        </div>

        <div className="flex w-full md:w-auto gap-3 justify-end">
          <div className="relative w-48 shrink-0">
            <ArrowUpDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-xs focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer"
            >
              <option value="Recently Added">Recently Added</option>
              <option value="Alphabetical">Alphabetical (A-Z)</option>
              <option value="Department Wise">Department Wise</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      {sortedMembers.length === 0 ? (
        <div className="py-20 text-center text-slate-500 border border-dashed border-navy-800 rounded-2xl bg-navy-900/10">
          <Users size={48} className="mx-auto mb-3 text-slate-600" />
          <h3 className="font-extrabold text-base text-slate-400">No Members Found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting filters or matching different search queries.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMembers.map(member => (
            <div key={member.id} className="bg-navy-900/40 border border-navy-800/60 rounded-2xl p-5 backdrop-blur-md hover:border-cyan-500/30 transition-all group flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-4 justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-950 flex items-center justify-center text-cyan-400 font-extrabold text-lg border border-cyan-800/50 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:scale-110 transition-transform">
                      {(member.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-100">{member.name}</h3>
                      <p className="text-[10px] text-cyan-400 font-medium uppercase tracking-wider mt-0.5">{member.department || 'Unknown Dept'}</p>
                    </div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEditModal(member)}
                      className="p-1 rounded bg-navy-800 border border-navy-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                      title="Edit Member"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id, member.name)}
                      className="p-1 rounded bg-navy-800 border border-navy-700 text-slate-400 hover:text-rose-400 hover:border-rose-500/30 transition-all"
                      title="Delete Member"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-navy-800/50 space-y-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Email Address</span>
                    <span className="text-xs text-slate-300 font-medium">{member.email}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Role</span>
                      <span className="text-xs text-slate-300">{member.role}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Joined</span>
                      <span className="text-xs text-slate-300">{new Date(member.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-md bg-navy-950 border border-navy-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-navy-900 flex items-center justify-between bg-navy-900/50">
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Users size={18} className="text-cyan-400" />
                {modalType === 'add' ? 'Register New Member' : 'Edit Member Details'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full bg-navy-900 hover:bg-navy-800 border border-navy-800 text-slate-400 hover:text-slate-100 transition-all">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-rose-950/30 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Kumar Swamy"
                  className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="kumar@example.com"
                  className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {modalType === 'add' && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password (Optional - defaults to Password123)</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Department *</label>
                  <div className="relative">
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full appearance-none bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl pl-4 pr-8 py-2.5 text-xs focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">Role *</label>
                  <div className="relative">
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full appearance-none bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl pl-4 pr-8 py-2.5 text-xs focus:outline-none focus:border-cyan-500/50 cursor-pointer"
                    >
                      <option value="Member">Member</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-navy-900 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-200 bg-navy-900 border border-navy-800 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50"
                >
                  <Save size={14} />
                  {isSubmitting ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
