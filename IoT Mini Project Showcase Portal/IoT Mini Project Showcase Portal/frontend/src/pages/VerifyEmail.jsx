import { API_URL } from '../config';
import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, Loader2, Cpu, LogIn } from 'lucide-react';

export default function VerifyEmail() {
  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');

        if (!token) {
          setStatus('error');
          setMessage('No verification token was found in your URL. Please verify your link.');
          return;
        }

        const res = await fetch(`${API_URL}/api/auth/verify-email?token=${token}`);
        const data = await res.json();

        if (res.ok && data.success) {
          setStatus('success');
          setMessage(data.message || 'Your email has been verified successfully!');
        } else {
          setStatus('error');
          setMessage(data.message || 'The verification link has expired or is invalid.');
        }
      } catch (err) {
        setStatus('error');
        setMessage('A network error occurred. Unable to connect to verification server.');
      }
    };

    verifyToken();
  }, []);

  const handleGoToLogin = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-100">
      {/* Background Decor */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-navy-900/60 backdrop-blur-md border border-navy-800 rounded-3xl p-8 shadow-2xl relative z-10 text-center animate-in zoom-in-95 duration-500">
        <div className="inline-flex p-3 rounded-2xl bg-cyan-950/50 border border-cyan-800/30 text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.15)] mb-6">
          <Cpu size={32} className={status === 'verifying' ? 'animate-spin' : 'animate-pulse'} />
        </div>

        {status === 'verifying' && (
          <div className="space-y-4">
            <h1 className="text-xl font-extrabold tracking-tight text-slate-200">Verifying Email...</h1>
            <div className="flex justify-center py-4">
              <Loader2 className="animate-spin text-cyan-400" size={36} />
            </div>
            <p className="text-xs text-slate-400">
              Please wait while we connect with Sansah Innovations servers to verify your account.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-center text-emerald-400">
              <CheckCircle2 size={56} className="animate-bounce" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-emerald-400">Email Verified!</h1>
              <p className="text-sm text-slate-200 font-medium px-2">{message}</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account is now active and ready. You can log in to start showcasing your IoT innovations.
            </p>
            <button
              onClick={handleGoToLogin}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] flex items-center justify-center gap-2"
            >
              <LogIn size={18} />
              Sign In Securely
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-center text-rose-500">
              <XCircle size={56} />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold tracking-tight text-rose-400">Verification Failed</h1>
              <p className="text-sm text-slate-200 font-medium px-2">{message}</p>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The verification link might have expired or is invalid. Please request a new verification email from the login page or contact support if the issue persists.
            </p>
            <button
              onClick={handleGoToLogin}
              className="w-full py-3 bg-navy-850 hover:bg-navy-800 text-slate-200 border border-navy-700 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
