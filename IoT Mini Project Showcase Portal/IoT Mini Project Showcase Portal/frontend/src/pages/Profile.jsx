import { API_URL } from '../config';
import React, { useState } from 'react';
import { User, Mail, Building, Hash, Save, AlertTriangle, CheckCircle, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { DEPARTMENTS } from '../App';

export default function Profile({ user, setUser }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    profilePicture: user?.profilePicture || ''
  });
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setStatus({ type: 'error', msg: 'Image size must be less than 2MB' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePicture: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });
    setIsSaving(true);

    try {
      const token = localStorage.getItem('sansah_token');
      const response = await fetch(API_URL + '/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (!response.ok) {
        setStatus({ type: 'error', msg: data.error || 'Failed to update profile' });
        return;
      }
      
      setUser({ ...user, ...data });
      setStatus({ type: 'success', msg: 'Profile updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', msg: 'Network error. Ensure backend is running.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-navy-800/40 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <User className="text-cyan-400" size={24} />
          My Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your personal information and student details.
        </p>
      </div>

      {status.msg && (
        <div className={`p-4 rounded-xl flex items-start gap-3 border ${status.type === 'error' ? 'bg-rose-950/30 border-rose-500/30 text-rose-400' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'}`}>
          {status.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          <span className="text-sm">{status.msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-navy-900/40 border border-navy-800/60 rounded-2xl p-6 md:p-8 backdrop-blur-md space-y-6">
        
        <div className="flex flex-col md:flex-row gap-6 items-center border-b border-navy-800/40 pb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-navy-800 flex items-center justify-center shrink-0 border-2 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            {formData.profilePicture ? (
              <img src={formData.profilePicture} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-slate-500" />
            )}
          </div>
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
              <ImageIcon size={12} className="text-cyan-400" />
              Upload Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-navy-950 hover:file:bg-cyan-400 cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
              <User size={12} className="text-cyan-400" />
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
              <Mail size={12} className="text-cyan-400" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
              <Building size={12} className="text-cyan-400" />
              Department
            </label>
            <div className="relative">
              <select
                name="department"
                required
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm appearance-none cursor-pointer focus:outline-none focus:border-cyan-500/50"
              >
                <option value="" disabled>Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
