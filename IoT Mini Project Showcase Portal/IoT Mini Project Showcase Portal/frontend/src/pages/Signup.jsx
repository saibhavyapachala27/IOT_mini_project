import { API_URL } from '../config';
import React, { useState } from 'react';
import { Cpu, ShieldAlert, User, LogIn, AlertTriangle, Building, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { DEPARTMENTS } from '../App';

export default function Signup({ onSignup }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { name, email, password, department } = formData;
    if (!name || !email || !password || !department) {
      setError('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch(API_URL + '/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }
      
      localStorage.setItem('sansah_token', data.token);
      onSignup(data.user);
    } catch (err) {
      setError('Network error. Ensure backend is running.');
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-navy-900/60 backdrop-blur-md border border-navy-800 rounded-3xl p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-950/50 border border-cyan-800/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-4">
            <Cpu size={32} className="animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            Join the IoT Showcase Portal.
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/30 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl mb-6 flex items-start gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-navy-950/50 border border-navy-800 text-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full bg-navy-950/50 border border-navy-800 text-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            </div>
          </div>

          <div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-navy-950/50 border border-navy-800 text-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
              />
              <ShieldAlert size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-all focus:outline-none"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <div className="relative">
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full bg-navy-950/50 border border-navy-800 text-slate-200 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select Department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2"
          >
            Create Account
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-navy-800/50 text-center">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <button onClick={() => { window.location.hash = '#'; setError(''); }} className="text-cyan-400 hover:underline font-bold">
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
