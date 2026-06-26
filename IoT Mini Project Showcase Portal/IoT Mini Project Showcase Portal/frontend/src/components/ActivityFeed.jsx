import React from 'react';
import { Clock, CheckCircle, XCircle, Trash2, PlusCircle, RotateCcw } from 'lucide-react';

export default function ActivityFeed({ activities }) {
  const getIcon = (action) => {
    switch (action) {
      case 'Project Approved': return <CheckCircle size={16} className="text-emerald-400" />;
      case 'Project Rejected': return <XCircle size={16} className="text-rose-400" />;
      case 'Project Deleted': return <Trash2 size={16} className="text-slate-400" />;
      case 'Project Submitted': return <PlusCircle size={16} className="text-cyan-400" />;
      case 'System Reset': return <RotateCcw size={16} className="text-amber-400" />;
      default: return <Clock size={16} className="text-slate-400" />;
    }
  };

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' on ' + d.toLocaleDateString();
  };

  return (
    <div className="bg-navy-900/40 border border-navy-800/60 rounded-2xl p-6 backdrop-blur-md h-[400px] flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-navy-800/50">
        <Clock size={18} className="text-cyan-400" />
        <h3 className="text-sm font-bold text-slate-100">Live Activity Feed</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
        {activities.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-500">
            <Clock size={32} className="mb-2 opacity-50" />
            <p className="text-xs font-medium">No recent activities.</p>
          </div>
        ) : (
          activities.map((act) => (
            <div key={act.id} className="flex gap-3 items-start animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mt-0.5 p-1.5 rounded-lg bg-navy-950 border border-navy-800/50">
                {getIcon(act.action)}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">{act.action}</p>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">{act.details}</p>
                <p className="text-[9px] text-slate-500 font-medium tracking-wide mt-1 uppercase">
                  {formatTime(act.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
