import React from 'react';
import AdminPanel from '../components/AdminPanel';
import { ShieldAlert } from 'lucide-react';

export default function Admin({ 
  anthropicApiKey, 
  setAnthropicApiKey, 
  addToast,
  activities
}) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="border-b border-navy-800/40 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <ShieldAlert className="text-cyan-400" size={24} />
          Administration & Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review pending project applications, configure external API dependencies, and manage sandbox state.
        </p>
      </div>

      {/* Admin Panel Component */}
      <AdminPanel
        anthropicApiKey={anthropicApiKey}
        setAnthropicApiKey={setAnthropicApiKey}
        addToast={addToast}
        activities={activities}
      />
    </div>
  );
}
