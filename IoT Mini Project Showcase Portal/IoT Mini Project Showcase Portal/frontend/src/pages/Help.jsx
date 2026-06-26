import { API_URL } from '../config';
import React, { useState } from 'react';
import { HelpCircle, Send, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Help() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) return;
    setStatus({ type: '', msg: '' });
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('sansah_token');
      const response = await fetch(API_URL + '/api/help', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ subject, message })
      });
      
      if (!response.ok) throw new Error('Failed to submit request');
      
      setStatus({ type: 'success', msg: 'Help request submitted successfully. Admins will review it soon.' });
      setSubject('');
      setMessage('');
    } catch (err) {
      setStatus({ type: 'error', msg: 'Network error. Please try again later.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    { q: "How do I edit a submitted project?", a: "Go to 'My Projects' and click the Edit button overlaid on your project card. Note that editing will reset its status to Pending Review." },
    { q: "Why was my project rejected?", a: "If your project is rejected, hover over the card in 'My Projects' to view the specific reason provided by the administrator." },
    { q: "How long do rejected projects stay?", a: "Rejected projects are automatically deleted from the system 30 days after the rejection date." },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-navy-800/40 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <HelpCircle className="text-cyan-400" size={24} />
          Help & Support
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Find answers to common questions or reach out to the administration for support.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* FAQs */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold text-slate-200">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-navy-900/40 border border-navy-800/60 rounded-xl p-4 backdrop-blur-md">
                <h3 className="text-sm font-bold text-cyan-400 mb-2">{faq.q}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div>
          <h2 className="text-lg font-bold text-slate-200 mb-6">Submit a Support Ticket</h2>
          <form onSubmit={handleSubmit} className="bg-navy-900/40 border border-navy-800/60 rounded-2xl p-6 backdrop-blur-md space-y-4">
            {status.msg && (
              <div className={`p-3 rounded-xl flex items-start gap-2 border text-xs mb-4 ${status.type === 'error' ? 'bg-rose-950/30 border-rose-500/30 text-rose-400' : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-400'}`}>
                {status.type === 'error' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                <span>{status.msg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
                <MessageSquare size={12} className="text-cyan-400" />
                Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of your issue"
                className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
                <MessageSquare size={12} className="text-cyan-400" />
                Message
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue in detail..."
                className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send size={16} />
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
