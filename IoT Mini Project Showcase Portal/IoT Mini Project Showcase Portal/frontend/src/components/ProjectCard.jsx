import React, { useState } from 'react';
import { Github, PlayCircle, Users, Cpu, FileText, ChevronDown, ChevronUp, AlertTriangle, Info } from 'lucide-react';

export default function ProjectCard({ project, onWatchDemo, onReviewClick, onDetailsClick, user }) {
  const [imgSrc, setImgSrc] = useState(project.photoUrl || '');
  const [showFullDesc, setShowFullDesc] = useState(false);

  const isOwnProject = user && project.studentId === user.id;

  const fallbackImage = 'https://images.unsplash.com/photo-1517055720413-63a2b4b4d8cc?auto=format&fit=crop&q=80&w=800';

  const handleImgError = () => {
    setImgSrc(fallbackImage);
  };

  const truncateText = (text, maxLength = 130) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getCategoryStyles = (category) => {
    switch (category?.toLowerCase()) {
      case 'smart home':
        return 'bg-amber-950/40 border-amber-500/30 text-amber-400';
      case 'agriculture':
        return 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400';
      case 'health':
        return 'bg-rose-950/40 border-rose-500/30 text-rose-400';
      case 'industrial':
        return 'bg-violet-950/40 border-violet-500/30 text-violet-400';
      default:
        return 'bg-cyan-950/40 border-cyan-500/30 text-cyan-400';
    }
  };

  return (
    <article className="glassmorphism-card flex flex-col rounded-2xl overflow-hidden h-full group">
      {/* Photo Banner */}
      <div 
        onClick={() => onDetailsClick && onDetailsClick(project)}
        className="relative h-48 w-full overflow-hidden bg-navy-950/80 cursor-pointer"
      >
        <img
          src={imgSrc || fallbackImage}
          alt={project.title}
          onError={handleImgError}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent opacity-80" />

        {/* Category Badge */}
        <span className={`
          absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase border backdrop-blur-md
          ${getCategoryStyles(project.category)}
        `}>
          {project.category || 'Other'}
        </span>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Project Title */}
          <h3 
            onClick={() => onDetailsClick && onDetailsClick(project)}
            className="text-lg font-bold text-slate-100 leading-snug group-hover:text-cyan-400 cursor-pointer transition-colors mb-2 line-clamp-1"
          >
            {project.title}
          </h3>

          {/* Student details */}
          <div className="flex flex-col gap-1 text-xs text-slate-400 mb-4 bg-navy-900/40 p-2.5 rounded-lg border border-navy-800/30">
            <div className="flex items-center gap-1.5 font-medium text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>Lead: {project.studentName}</span>
            </div>
            {project.teamMembers && project.teamMembers !== project.studentName && (
              <div className="flex items-center gap-1.5 text-slate-500 pl-3">
                <Users size={12} />
                <span className="truncate">Team: {project.teamMembers}</span>
              </div>
            )}
            {project.department && (
              <div className="flex items-center gap-1.5 text-slate-500 pl-3 pt-1 border-t border-navy-800/30 mt-1">
                <span className="truncate text-[10px] uppercase font-bold tracking-wider">{project.department}</span>
              </div>
            )}
          </div>

          {/* Components tags */}
          <div className="mb-4">
            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1.5">
              <Cpu size={10} className="text-cyan-500" />
              <span>Components</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {project.components && project.components.map((comp, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-[10px] font-semibold bg-navy-900 text-cyan-400 border border-navy-800 rounded-md shadow-sm"
                >
                  {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1">
                {project.tags.map((tag, idx) => (
                  <span
                    key={`tag-${idx}`}
                    className="px-2 py-0.5 text-[9px] font-bold uppercase bg-slate-800 text-slate-300 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reviewer Comments (rejection reason) */}
          {project.status === 'Rejected' && project.rejectionReason && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/20 text-rose-200 text-xs animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="font-bold flex items-center gap-1.5 text-rose-400 mb-1">
                <AlertTriangle size={14} className="shrink-0" />
                <span>Reviewer Comments:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                {project.rejectionReason}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="mb-5">
            <div className="flex items-center gap-1 text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
              <FileText size={10} className="text-cyan-500" />
              <span>Project Abstract</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-medium">
              {showFullDesc ? project.description : truncateText(project.description)}
            </p>
            {project.description && project.description.length > 130 && (
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="mt-1 flex items-center gap-0.5 text-[11px] font-bold text-cyan-500 hover:text-cyan-400 transition-colors"
              >
                {showFullDesc ? (
                  <>Show Less <ChevronUp size={12} /></>
                ) : (
                  <>Read More <ChevronDown size={12} /></>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="flex items-center gap-2 border-t border-navy-800/40 pt-4 mt-auto">
          {onDetailsClick ? (
            <button
              onClick={() => onDetailsClick(project)}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-cyan-500 text-navy-950 hover:bg-cyan-400 font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)] active:scale-95"
            >
              <Info size={14} />
              <span>Details</span>
            </button>
          ) : project.videoUrl ? (
            <button
              onClick={() => onWatchDemo(project)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-cyan-500 text-navy-950 hover:bg-cyan-400 font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(6,182,212,0.15)] active:scale-95"
            >
              <PlayCircle size={14} />
              <span>Watch Demo</span>
            </button>
          ) : (
            <div className="flex-1 text-center py-2 text-slate-650 font-semibold text-[10px] uppercase border border-dashed border-navy-800 rounded-xl">
              No Video
            </div>
          )}

          {!isOwnProject && (
            <button
              onClick={() => onReviewClick(project)}
              className="flex items-center justify-center px-3 py-2 rounded-xl bg-navy-800 text-slate-300 hover:text-amber-400 hover:bg-navy-700 transition-all text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95"
              title="Reviews"
            >
              Reviews
            </button>
          )}

          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 rounded-xl bg-navy-900 border border-navy-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all active:scale-95"
              title="GitHub Repository"
            >
              <Github size={16} />
            </a>
          ) : null}

          {project.pdfUrl ? (
            <a
              href={project.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 rounded-xl bg-navy-900 border border-navy-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/30 transition-all active:scale-95"
              title="View Project PDF Documentation"
            >
              <FileText size={16} />
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
