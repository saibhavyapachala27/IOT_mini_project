import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Layers, 
  Key, 
  Eye, 
  EyeOff, 
  Search,
  Activity,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import ActivityFeed from './ActivityFeed';
import ProjectDetailsModal from './ProjectDetailsModal';

export default function AdminPanel({ 
  anthropicApiKey, 
  setAnthropicApiKey, 
  addToast,
  activities
}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('All');
  const [showKey, setShowKey] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState(null);
  
  // Reject Modal
  const [rejectModalProj, setRejectModalProj] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('sansah_token');
      const res = await fetch(API_URL + '/api/admin/projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch projects');
      const data = await res.json();
      setProjects(data);
    } catch(err) {
      addToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (id, status, reason = '') => {
    try {
      const token = localStorage.getItem('sansah_token');
      const res = await fetch(`${API_URL}/api/admin/projects/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status, rejectionReason: reason })
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      const updatedProj = await res.json();
      setProjects(prev => prev.map(p => p.id === id ? updatedProj : p));
      addToast(`Project marked as ${status}`, 'success');
      
      if (selectedDetails && selectedDetails.id === id) {
        setSelectedDetails(updatedProj);
      }
    } catch(err) {
      addToast(err.message, 'error');
    }
  };

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) return;
    updateProjectStatus(rejectModalProj.id, 'Rejected', rejectionReason);
    setRejectModalProj(null);
    setRejectionReason('');
  };

  const formatDate = (dateStr) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return 'N/A';
    }
  };

  const pending = projects.filter(p => p.status === 'Pending').length;
  const underReview = projects.filter(p => p.status === 'Under Review').length;
  const approved = projects.filter(p => p.status === 'Approved').length;
  const rejected = projects.filter(p => p.status === 'Rejected').length;
  const total = projects.length;

  const filteredProjects = projects.filter(p => filter === 'All' || p.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Submissions" count={total} icon={<Layers size={20}/>} color="text-slate-200" bg="bg-navy-800" />
        <StatCard label="Pending" count={pending} icon={<Clock size={20}/>} color={pending > 0 ? "text-amber-400 animate-pulse" : "text-slate-200"} bg={pending > 0 ? "bg-amber-950/80 text-amber-400" : "bg-navy-800"} />
        <StatCard label="Under Review" count={underReview} icon={<Search size={20}/>} color="text-blue-400" bg="bg-blue-950/40 text-blue-400" />
        <StatCard label="Approved" count={approved} icon={<CheckCircle size={20}/>} color="text-emerald-400" bg="bg-emerald-950/40 text-emerald-400" />
        <StatCard label="Rejected" count={rejected} icon={<XCircle size={20}/>} color="text-rose-400" bg="bg-rose-950/40 text-rose-400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 bg-navy-900/40 border border-navy-800/60 rounded-2xl p-6 backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Project Review Hub</h2>
              <p className="text-xs text-slate-400">Manage, review, approve, or reject student project submissions.</p>
            </div>
            <div className="flex bg-navy-950 p-1 rounded-xl border border-navy-800 flex-wrap">
              {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all
                    ${filter === status
                      ? 'bg-navy-800 text-cyan-400 border border-navy-700/50 shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                    }
                  `}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className="py-12 text-center text-slate-500 border border-dashed border-navy-800 rounded-xl">
              <Layers size={36} className="mx-auto mb-2 text-slate-600" />
              <p className="font-semibold text-sm">No submissions found</p>
              <p className="text-xs text-slate-600">Currently no projects exist in the "{filter}" category.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-navy-800/60 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    <th className="pb-3 pl-2">Project</th>
                    <th className="pb-3">Lead Student</th>
                    <th className="pb-3 hidden sm:table-cell">Department</th>
                    <th className="pb-3 hidden md:table-cell">Category</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800/30 text-xs font-medium">
                  {filteredProjects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-navy-900/30 group transition-colors">
                      <td 
                        onClick={() => setSelectedDetails(proj)}
                        className="py-3.5 pl-2 font-bold text-slate-200 group-hover:text-cyan-400 cursor-pointer transition-colors max-w-[160px] truncate"
                      >
                        {proj.title}
                      </td>
                      <td className="py-3.5 text-slate-400">{proj.studentName}</td>
                      <td className="py-3.5 text-slate-500 hidden sm:table-cell">{proj.department}</td>
                      <td className="py-3.5 text-slate-500 hidden md:table-cell">{proj.category}</td>
                      <td className="py-3.5 text-slate-500">{formatDate(proj.createdAt)}</td>
                      <td className="py-3.5">
                        <span className={`
                          px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border
                          ${proj.status === 'Approved' ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400' : ''}
                          ${proj.status === 'Under Review' ? 'bg-blue-950/40 border-blue-500/20 text-blue-400' : ''}
                          ${proj.status === 'Pending' ? 'bg-amber-950/40 border-amber-500/20 text-amber-400 animate-pulse' : ''}
                          ${proj.status === 'Rejected' ? 'bg-rose-950/40 border-rose-500/20 text-rose-400' : ''}
                        `}>
                          {proj.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => setSelectedDetails(proj)} className="p-1.5 rounded-lg bg-navy-900 border border-navy-800 text-slate-400 hover:text-slate-100 transition-colors" title="Inspect Details">
                            <Eye size={14} />
                          </button>
                          
                          {proj.status !== 'Under Review' && proj.status !== 'Approved' && proj.status !== 'Rejected' && (
                            <button onClick={() => updateProjectStatus(proj.id, 'Under Review')} className="p-1.5 rounded-lg bg-blue-950/60 border border-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-navy-950 transition-all" title="Review Submission">
                              <Search size={14} />
                            </button>
                          )}

                          {proj.status !== 'Approved' && (
                            <button onClick={() => updateProjectStatus(proj.id, 'Approved')} className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-navy-950 transition-all" title="Approve Submission">
                              <CheckCircle size={14} />
                            </button>
                          )}
                          
                          {proj.status !== 'Rejected' && (
                            <button onClick={() => setRejectModalProj(proj)} className="p-1.5 rounded-lg bg-rose-950/60 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-navy-950 hover:shadow-[0_0_15px_rgba(244,63,94,0.6)] transition-all relative group/reject" title="Reject Submission">
                              <XCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <ActivityFeed activities={activities} />

          <div className="bg-navy-900/40 border border-navy-800/60 rounded-2xl p-6 backdrop-blur-md">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-4">
              <Key size={16} className="text-cyan-400" />
              Anthropic API Config
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Supply an API key to allow students to generate descriptions using Claude 3.5 Sonnet directly in their forms.
            </p>
            <div className="space-y-3">
              <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider">Anthropic API Key</label>
              <div className="relative">
                <input type={showKey ? "text" : "password"} value={anthropicApiKey} onChange={(e) => setAnthropicApiKey(e.target.value)} placeholder="sk-ant-..." className="w-full bg-navy-950 border border-navy-800 text-slate-200 rounded-xl pl-3 pr-10 py-2.5 text-xs focus:outline-none" />
                <button type="button" onClick={() => setShowKey(!showKey)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-350 transition-colors">
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {rejectModalProj && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-navy-800 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 p-6">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <AlertTriangle size={24} />
              <h3 className="text-lg font-bold">Reject Project</h3>
            </div>
            <p className="text-sm text-slate-300 mb-4">
              Please provide a reason for rejecting <strong>{rejectModalProj.title}</strong>. This reason will be visible to the student.
            </p>
            <form onSubmit={handleRejectSubmit}>
              <textarea
                required
                rows={4}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-rose-500/50 mb-4"
              />
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => {setRejectModalProj(null); setRejectionReason('');}} className="px-4 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-slate-100 text-sm font-bold transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-rose-500 text-navy-950 hover:bg-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] text-sm font-bold transition-all">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedDetails && (
        <ProjectDetailsModal
          project={selectedDetails}
          user={{ role: 'Admin' }}
          onClose={() => setSelectedDetails(null)}
          onStatusUpdate={(updatedProject) => {
            setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
            setSelectedDetails(null);
            addToast(`Project status updated to ${updatedProject.status}`, 'success');
          }}
        />
      )}
    </div>
  );
}

function StatCard({ label, count, icon, color, bg }) {
  return (
    <div className="bg-navy-900/40 border border-navy-800/60 p-4 rounded-2xl flex items-center justify-between backdrop-blur-sm">
      <div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">{label}</span>
        <span className={`text-2xl font-extrabold mt-1 block ${color}`}>{count}</span>
      </div>
      <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
    </div>
  );
}
