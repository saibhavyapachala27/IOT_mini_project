import { API_URL } from '../config';
import React, { useState } from 'react';
import { Cpu, ShieldAlert, User, LogIn, AlertTriangle, Eye, EyeOff, Key, CheckCircle, ArrowLeft } from 'lucide-react';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password flow: 'none' | 'email' | 'reset'
  const [forgotStep, setForgotStep] = useState('none');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const emailLower = email.toLowerCase().trim();
    if (!emailLower || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower, password })
      });
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      
      localStorage.setItem('sansah_token', data.token);
      onLogin(data.user);
    } catch (err) {
      setError('Network error. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const emailLower = email.toLowerCase().trim();
    if (!emailLower) {
      setError('Please enter your email address first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL + '/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to send reset code');
        return;
      }
      setSuccessMsg('Reset code generated successfully! Check your email or console.');
      setForgotStep('reset');
    } catch (err) {
      setError('Network error. Check server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const emailLower = email.toLowerCase().trim();
    if (!resetCode || !newPassword) {
      setError('Please fill in the code and new password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(API_URL + '/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower, code: resetCode, newPassword })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Failed to reset password');
        return;
      }
      setSuccessMsg('Password has been reset successfully! You can now log in.');
      setForgotStep('none');
      setResetCode('');
      setNewPassword('');
    } catch (err) {
      setError('Network error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-navy-900/60 backdrop-blur-md border border-navy-800 rounded-3xl p-8 shadow-2xl relative z-10 animate-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-cyan-950/50 border border-cyan-800/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-4">
            <Cpu size={32} className="animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            {forgotStep === 'email' && 'Forgot Password'}
            {forgotStep === 'reset' && 'Reset Password'}
            {forgotStep === 'none' && 'Sansah Portal Sign In'}
          </h1>
          <p className="text-xs text-slate-400 mt-2 font-medium">
            {forgotStep === 'email' && 'Enter your email to request a reset code.'}
            {forgotStep === 'reset' && 'Enter the reset code sent to your email.'}
            {forgotStep === 'none' && 'Access your personalized dashboard.'}
          </p>
        </div>

        {error && (
          <div className="bg-rose-950/30 border border-rose-500/30 text-rose-400 text-xs p-3 rounded-xl mb-6 flex items-start gap-2">
            <AlertTriangle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 text-xs p-3 rounded-xl mb-6 flex items-start gap-2">
            <CheckCircle size={16} className="shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {forgotStep === 'email' ? (
          /* Forgot Password: Request code */
          <form onSubmit={handleForgotPasswordRequest} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full bg-navy-950/50 border border-navy-800 text-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2"
            >
              <Key size={18} />
              Request Reset Code
            </button>

            <button
              type="button"
              onClick={() => {
                setForgotStep('none');
                setError('');
              }}
              className="w-full flex items-center justify-center gap-1 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all mt-2"
            >
              <ArrowLeft size={12} />
              <span>Back to Sign In</span>
            </button>
          </form>
        ) : forgotStep === 'reset' ? (
          /* Forgot Password: Reset password */
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/30 text-xs text-cyan-300 space-y-2 mb-2">
              <p className="font-bold flex items-center gap-1">
                <CheckCircle size={14} className="shrink-0" />
                <span>Reset Code Sent!</span>
              </p>
              <p className="leading-relaxed">
                Check the **server terminal console** or your email where the reset code has been sent.
              </p>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Reset Code</label>
              <input
                type="text"
                maxLength={6}
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full text-center tracking-widest font-mono bg-navy-950/50 border border-navy-800 text-slate-200 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2"
            >
              Reset Password & Save
            </button>

            <button
              type="button"
              onClick={() => {
                setForgotStep('none');
                setError('');
                setSuccessMsg('');
              }}
              className="w-full flex items-center justify-center gap-1 text-slate-400 hover:text-slate-200 text-xs font-bold transition-all mt-2"
            >
              <ArrowLeft size={12} />
              <span>Back to Sign In</span>
            </button>
          </form>
        ) : (
          /* Normal Sign In Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sansah.com"
                  className="w-full bg-navy-950/50 border border-navy-800 text-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
                />
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setSuccessMsg('');
                    setForgotStep('email');
                  }}
                  className="text-[10px] font-bold text-cyan-400 hover:underline focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              {loading ? 'Signing In...' : 'Sign In Securely'}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-navy-800/50 text-center">
          <p className="text-xs text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={() => {
                window.location.hash = '#signup';
                setForgotStep('none');
                setError('');
                setSuccessMsg('');
              }}
              className="text-cyan-400 hover:underline font-bold"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
