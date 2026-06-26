import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { LayoutGrid, Edit, Trash2, PlusCircle, AlertTriangle } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import ReviewModal from '../components/ReviewModal';

export default function MyProjects({ setActiveTab, setEditProjectData, user }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeReviewProject, setActiveReviewProject] = useState(null);

  useEffect(() => {
    fetchMyProjects();
  }, []);

  const fetchMyProjects = async () => {
    try {
      const token = localStorage.getItem('sansah_token');
      const response = await fetch(API_URL + '/api/projects/my-projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const token = localStorage.getItem('sansah_token');
      const response = await fetch(`${API_URL}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Delete failed');
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (project) => {
    setEditProjectData(project);
    setActiveTab('submit');
  };

  const getCounts = () => {
    const total = projects.length;
    const approved = projects.filter(p => p.status === 'Approved').length;
    const pending = projects.filter(p => p.status === 'Pending').length;
    const review = projects.filter(p => p.status === 'Under Review').length;
    const rejected = projects.filter(p => p.status === 'Rejected').length;
    return { total, approved, pending, review, rejected };
  };

  const counts = getCounts();

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-navy-800/40 pb-4 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <LayoutGrid className="text-cyan-400" size={24} />
            My Projects
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your submitted projects and track their approval status.
          </p>
        </div>
        <button
          onClick={() => { setEditProjectData(null); setActiveTab('submit'); }}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold rounded-xl text-xs transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        >
          <PlusCircle size={16} /> Submit New
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total" count={counts.total} color="text-cyan-400" />
        <StatCard label="Approved" count={counts.approved} color="text-emerald-400" />
        <StatCard label="Pending" count={counts.pending} color="text-amber-400" />
        <StatCard label="Reviewing" count={counts.review} color="text-blue-400" />
        <StatCard label="Rejected" count={counts.rejected} color="text-rose-400" />
      </div>

      {loading ? (
        <div className="text-center text-slate-500 py-10">Loading projects...</div>
      ) : error ? (
        <div className="text-center text-rose-400 py-10">{error}</div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center text-slate-500 border border-dashed border-navy-800 rounded-2xl bg-navy-900/10">
          <LayoutGrid size={48} className="mx-auto mb-3 text-slate-600" />
          <h3 className="font-extrabold text-base text-slate-400">No Projects Found</h3>
          <p className="text-xs mt-2">You haven't submitted any projects yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="relative group flex flex-col h-full bg-navy-900/40 border border-navy-800/60 rounded-2xl overflow-hidden hover:border-cyan-500/20 transition-all duration-300">
              
              {/* Status Badge */}
              <span className={`
                absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md z-10
                ${project.status === 'Approved' ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400' : ''}
                ${project.status === 'Pending' ? 'bg-amber-950/80 border-amber-500/30 text-amber-400' : ''}
                ${project.status === 'Under Review' ? 'bg-blue-950/80 border-blue-500/30 text-blue-400' : ''}
                ${project.status === 'Rejected' ? 'bg-rose-950/80 border-rose-500/30 text-rose-400' : ''}
              `}>
                {project.status}
              </span>

              <div className="flex-1">
                <ProjectCard 
                  project={project} 
                  onWatchDemo={() => window.open(project.videoUrl, '_blank')}
                  onReviewClick={setActiveReviewProject}
                  user={user}
                />
              </div>

              {/* Actions Footer Bar */}
              <div className="p-4 bg-navy-950/60 border-t border-navy-800/40 flex justify-between gap-3">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 py-2 px-3 bg-navy-900 hover:bg-navy-800 text-cyan-400 hover:text-cyan-300 font-bold text-xs rounded-xl border border-navy-800 hover:border-cyan-500/30 transition-all flex items-center justify-center gap-1.5"
                >
                  <Edit size={14} />
                  <span>{project.status === 'Rejected' ? 'Edit & Resubmit' : 'Edit Project'}</span>
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="py-2 px-3 bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 hover:text-rose-350 font-bold text-xs rounded-xl border border-rose-900/30 hover:border-rose-500/30 transition-all flex items-center justify-center gap-1.5"
                  title="Delete"
                >
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {activeReviewProject && (
        <ReviewModal
          project={activeReviewProject}
          user={user}
          onClose={() => setActiveReviewProject(null)}
        />
      )}
    </div>
  );
}

function StatCard({ label, count, color }) {
  return (
    <div className="bg-navy-900/40 border border-navy-800/60 rounded-xl p-4 flex flex-col items-center justify-center">
      <span className={`text-2xl font-extrabold ${color}`}>{count}</span>
      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">{label}</span>
    </div>
  );
}
