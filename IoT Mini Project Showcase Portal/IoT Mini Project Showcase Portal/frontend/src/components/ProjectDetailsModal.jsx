import { API_URL } from '../config';
import React, { useState } from 'react';
import { 
  X, 
  Cpu, 
  User, 
  Users, 
  Folder, 
  Tag, 
  Download, 
  ExternalLink, 
  FileText, 
  PlayCircle,
  AlertTriangle,
  CheckCircle,
  Copy,
  Terminal
} from 'lucide-react';

export default function ProjectDetailsModal({ project, onClose, user, onStatusUpdate, onWatchDemo }) {
  const [copied, setCopied] = useState(false);
  const [adminReason, setAdminReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [updating, setUpdating] = useState(false);

  const isAdmin = user?.role === 'Admin';

  const handleCopyCode = () => {
    if (!project.codeContent) return;
    navigator.clipboard.writeText(project.codeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (newStatus, reason = '') => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('sansah_token');
      const res = await fetch(`${API_URL}/api/admin/projects/${project.id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus, rejectionReason: reason })
      });
      if (!res.ok) throw new Error('Failed to update project status');
      
      const updatedProj = await res.json();
      if (onStatusUpdate) {
        onStatusUpdate(updatedProj);
      }
      setShowRejectInput(false);
      setAdminReason('');
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Helper for YouTube embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && (match[2].length === 12 || match[2].length === 11)) {
      return `https://www.youtube.com/embed/${match[2]}?rel=0`;
    }
    return url;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[140] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="w-full max-w-4xl bg-navy-950 border border-navy-800/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-navy-900 flex items-center justify-between bg-navy-900/40">
          <div className="flex items-center gap-2 overflow-hidden mr-4">
            <Cpu className="text-cyan-400 shrink-0 animate-pulse" size={20} />
            <h3 className="text-base font-extrabold text-slate-100 truncate">
              {project.title}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full bg-navy-900 hover:bg-navy-800 border border-navy-800 text-slate-400 hover:text-slate-100 transition-all shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-navy-950/20">
          
          {/* Banner Photo & Core Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 relative h-48 md:h-64 rounded-2xl overflow-hidden border border-navy-800 bg-navy-900">
              <img 
                src={project.photoUrl || 'https://images.unsplash.com/photo-1517055720413-63a2b4b4d8cc?auto=format&fit=crop&q=80&w=800'} 
                alt={project.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <span className="px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider bg-cyan-500 text-navy-950 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
                  {project.category}
                </span>
                <h4 className="text-lg font-black text-slate-100 mt-2 truncate drop-shadow-md">{project.title}</h4>
              </div>
            </div>

            {/* Side Metadata Card */}
            <div className="bg-navy-900/60 border border-navy-800/60 rounded-2xl p-4 flex flex-col justify-between text-xs space-y-3 font-semibold">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Student Team</span>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-200">
                    <User size={14} className="text-cyan-400" />
                    <span>Lead: {project.studentName}</span>
                  </div>
                  {project.teamMembers && project.teamMembers !== project.studentName && (
                    <div className="flex items-start gap-2 text-slate-400 pl-1">
                      <Users size={14} className="text-slate-500 mt-0.5" />
                      <span className="leading-tight font-medium">Team: {project.teamMembers}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-navy-850/80 pt-3">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Department</span>
                <span className="text-slate-300 font-bold block">{project.department}</span>
              </div>

              <div className="border-t border-navy-850/80 pt-3 flex gap-2 flex-wrap">
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 min-w-[80px] py-2 px-2.5 rounded-xl bg-navy-950 border border-navy-850 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/20 transition-all text-center flex items-center justify-center gap-1"
                  >
                    <span>GitHub</span>
                    <ExternalLink size={10} />
                  </a>
                )}
                {project.pdfUrl && (
                  <a 
                    href={project.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex-1 min-w-[80px] py-2 px-2.5 rounded-xl bg-navy-950 border border-navy-850 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/20 transition-all text-center flex items-center justify-center gap-1"
                  >
                    <span>PDF</span>
                    <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Abstract / Project Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <FileText size={14} className="text-cyan-500" />
              Project Abstract
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-navy-900/40 border border-navy-850/60 p-4 rounded-2xl whitespace-pre-wrap font-medium">
              {project.description}
            </p>
          </div>

          {/* Badges: Components & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Components Used */}
            <div className="p-4 bg-navy-900/30 border border-navy-800/40 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                <Cpu size={12} className="text-cyan-400" />
                Hardware Components
              </span>
              <div className="flex flex-wrap gap-1">
                {project.components && project.components.map((comp, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-[10px] font-semibold bg-navy-950 border border-navy-800 text-cyan-400 rounded-lg shadow-sm">
                    {comp}
                  </span>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="p-4 bg-navy-900/30 border border-navy-800/40 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
                <Tag size={12} className="text-cyan-400" />
                Project Tags
              </span>
              <div className="flex flex-wrap gap-1">
                {project.tags && project.tags.length > 0 ? (
                  project.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 text-[9px] font-bold uppercase bg-slate-800 border border-slate-700/30 text-slate-300 rounded-full">
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-600 text-xs italic pl-1">No tags.</span>
                )}
              </div>
            </div>
          </div>

          {/* Toggled / Optional Components Section */}
          <div className="border-t border-navy-900 pt-6 space-y-6">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest pl-1">Optional Project Assets</h4>

            <div className="space-y-4">
              
              {/* 1. Optional Additional File Download */}
              {project.includeFile && project.fileUrl && (
                <div className="p-4 bg-navy-900/30 border border-navy-800/50 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800/30 text-cyan-400">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Attached Resource File</h5>
                      <p className="text-[10px] text-slate-500">Download supplementary datasheet, schematic or archive.</p>
                    </div>
                  </div>
                  <a 
                    href={project.fileUrl} 
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 rounded-xl bg-cyan-500 text-navy-950 hover:bg-cyan-400 text-xs font-bold transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)] flex items-center gap-1.5"
                  >
                    <Download size={14} />
                    Download File
                  </a>
                </div>
              )}

              {/* 2. Optional Code File & Live Raw Text Viewer */}
              {project.includeCode && (project.codeFileUrl || project.codeContent) && (
                <div className="border border-navy-800 rounded-2xl overflow-hidden bg-navy-900/20">
                  <div className="p-4 border-b border-navy-800 bg-navy-900/50 flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Terminal className="text-cyan-400" size={16} />
                      <span className="text-xs font-bold text-slate-200 truncate">
                        Code Asset: {project.codeFileUrl ? project.codeFileUrl.split('/').pop() : 'source_code.txt'}
                      </span>
                    </div>
                    {project.codeContent && (
                      <button 
                        onClick={handleCopyCode}
                        className="py-1 px-3 rounded-lg border border-navy-800 hover:border-cyan-500/20 text-slate-400 hover:text-cyan-400 text-[10px] font-bold transition-colors flex items-center gap-1 focus:outline-none"
                      >
                        <Copy size={12} />
                        <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                      </button>
                    )}
                  </div>
                  {project.codeContent ? (
                    <div className="max-h-60 overflow-y-auto p-4 bg-navy-950 text-slate-300 font-mono text-[11px] leading-normal border-t border-navy-900/50 whitespace-pre">
                      {project.codeContent}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-500 italic">
                      Code file uploaded but content preview is empty.
                      {project.codeFileUrl && (
                        <a href={project.codeFileUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline ml-1 block mt-1">
                          Download raw code file
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* 3. Optional Simulator Block */}
              {project.includeSimulation && project.simulationUrl && (
                <div className="p-4 bg-navy-900/30 border border-navy-800/50 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800/30 text-cyan-400">
                        <Cpu size={18} />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-slate-200">Interactive Circuit Simulation</h5>
                        <p className="text-[10px] text-slate-500">Examine the micro-controller configuration and wiring setup.</p>
                      </div>
                    </div>
                    <a 
                      href={project.simulationUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="py-2 px-4 rounded-xl bg-navy-950 border border-navy-800 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <span>Open Simulation</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                  
                  {/* Optional: Embed Wokwi if it is a wokwi URL */}
                  {project.simulationUrl.includes('wokwi.com') && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-navy-800 bg-black">
                      <iframe 
                        src={`${project.simulationUrl}?embed=1`}
                        title="Simulation Embed"
                        className="w-full h-full border-0"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* 4. Optional YouTube Demonstration Video */}
              {project.includeVideo && project.videoUrl && (
                <div className="p-4 bg-navy-900/30 border border-navy-800/50 rounded-2xl space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800/30 text-cyan-400">
                      <PlayCircle size={18} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Video Demonstration</h5>
                      <p className="text-[10px] text-slate-500">Embedded YouTube project walk-through and explanation.</p>
                    </div>
                  </div>
                  
                  <div className="aspect-video w-full rounded-xl overflow-hidden border border-navy-800 bg-black">
                    {project.videoUrl.includes('youtube') || project.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={getYouTubeEmbedUrl(project.videoUrl)}
                        title={project.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-slate-500">
                        <p className="text-xs">Demo video link is external: <a href={project.videoUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-bold break-all mt-1">{project.videoUrl}</a></p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. Optional Google Drive Link */}
              {project.includeDrive && project.driveUrl && (
                <div className="p-4 bg-navy-900/30 border border-navy-800/50 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800/30 text-cyan-400">
                      <ExternalLink size={18} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Google Drive Workspace</h5>
                      <p className="text-[10px] text-slate-500">Access tutorials, reference uploads, source diagrams, or logs.</p>
                    </div>
                  </div>
                  <a 
                    href={project.driveUrl} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-4 rounded-xl bg-navy-950 border border-navy-800 text-cyan-400 hover:text-cyan-300 text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <span>View Drive Folder</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {/* 6. Optional Computing Spec (Line and Pic) */}
              {project.includeComputing && (project.computingLine || project.computingPicUrl) && (
                <div className="p-4 bg-navy-900/30 border border-navy-800/50 rounded-2xl space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-800/30 text-cyan-400 shrink-0">
                      <Cpu size={18} />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">Computing Configuration & Diagram</h5>
                      <p className="text-[10px] text-slate-500">Specifications of the edge controller, servers, MQTT brokers or database setups.</p>
                    </div>
                  </div>

                  {project.computingLine && (
                    <div className="p-3 bg-navy-950/80 border border-navy-900 rounded-xl">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block mb-1">Configuration Script / Info Line</span>
                      <p className="text-xs font-mono text-cyan-300 font-bold leading-relaxed">{project.computingLine}</p>
                    </div>
                  )}

                  {project.computingPicUrl && (
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block">Architecture / Compute Scheme Pic</span>
                      <div className="border border-navy-800 rounded-xl overflow-hidden max-h-64 bg-navy-950">
                        <img 
                          src={project.computingPicUrl} 
                          alt="Computing Diagram" 
                          className="w-full h-full object-contain max-h-60 mx-auto"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

          {/* Rejection notice if rejected */}
          {project.status === 'Rejected' && project.rejectionReason && (
            <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 text-rose-200">
              <span className="font-bold flex items-center gap-1.5 text-rose-400 mb-1 text-xs">
                <AlertTriangle size={14} className="shrink-0" />
                <span>Rejection Comments / Feedback:</span>
              </span>
              <p className="text-xs font-medium leading-relaxed">
                {project.rejectionReason}
              </p>
            </div>
          )}

        </div>

        {/* Footer with actions (Admin actions or close button) */}
        <div className="p-4 bg-navy-950 border-t border-navy-900 flex justify-between items-center flex-wrap gap-3">
          <div>
            {project.rejectedAt && (
              <span className="text-[10px] text-slate-500 font-bold uppercase">
                Rejected on: {new Date(project.rejectedAt).toLocaleDateString()}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={onClose} 
              className="px-4 py-2 rounded-xl bg-navy-900 border border-navy-800 text-slate-300 hover:text-slate-100 text-xs font-bold uppercase transition-colors"
            >
              Close Details
            </button>
            
            {/* Inline Admin approval/rejection action triggers */}
            {isAdmin && !updating && (
              <>
                {project.status !== 'Approved' && (
                  <button 
                    onClick={() => handleStatusChange('Approved')}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 text-xs font-bold uppercase transition-all shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                  >
                    Approve Project
                  </button>
                )}
                {project.status !== 'Rejected' && (
                  <>
                    {!showRejectInput ? (
                      <button 
                        onClick={() => setShowRejectInput(true)}
                        className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs font-bold uppercase transition-all"
                      >
                        Reject...
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <input 
                          type="text" 
                          placeholder="Rejection reason..." 
                          value={adminReason}
                          onChange={(e) => setAdminReason(e.target.value)}
                          className="bg-navy-900 border border-navy-800 text-slate-200 text-xs rounded-lg px-3 py-2 w-48 focus:outline-none"
                        />
                        <button 
                          onClick={() => handleStatusChange('Rejected', adminReason)}
                          className="px-3 py-2 rounded-lg bg-rose-500 text-navy-950 text-xs font-bold"
                        >
                          Submit Rejection
                        </button>
                        <button 
                          onClick={() => { setShowRejectInput(false); setAdminReason(''); }}
                          className="text-slate-500 hover:text-slate-300 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
