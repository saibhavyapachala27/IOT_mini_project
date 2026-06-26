import { API_URL } from './config';
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Showcase from './pages/Showcase';
import Submit from './pages/Submit';
import Admin from './pages/Admin';
import Analytics from './pages/Analytics';
import Members from './pages/Members';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MyProjects from './pages/MyProjects';
import Help from './pages/Help';
import VerifyEmail from './pages/VerifyEmail';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  XOctagon, 
  Info,
  Terminal,
  Cpu
} from 'lucide-react';

export const DEPARTMENTS = [
  'Computer Science',
  'Information Technology',
  'Electronics & Communication',
  'Electrical & Electronics',
  'Mechanical Engineering',
  'Civil Engineering'
];

// Seed projects removed. Connected to MongoDB backend.

const CATEGORIES = ['All', 'Smart Home', 'Agriculture', 'Health', 'Industrial', 'Other'];

export default function App() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('sansah_activities');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState('showcase');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [activeVideoProject, setActiveVideoProject] = useState(null);
  const [editProjectData, setEditProjectData] = useState(null);

  const [anthropicApiKey, setAnthropicApiKey] = useState(() => {
    return localStorage.getItem('sansah_iot_anthropic_key') || '';
  });

  // Check auth
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('sansah_token');
      if (token) {
        try {
          const res = await fetch(API_URL + '/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            const userData = await res.json();
            setUser(userData);
          } else {
            localStorage.removeItem('sansah_token');
          }
        } catch (e) {
          console.error(e);
        }
      }
      setAuthChecking(false);
    };
    checkAuth();
  }, []);

  // Fetch approved projects for showcase
  useEffect(() => {
    const fetchPublicProjects = async () => {
      try {
        const res = await fetch(API_URL + '/api/projects');
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch(err) { console.error(err); }
    };
    fetchPublicProjects();
  }, [activeTab]);

  // Handle hash changes for routing like signup
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#signup' && !user) {
        setActiveTab('signup');
      } else if (!user) {
        setActiveTab('login');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [user]);

  // Persist API key
  useEffect(() => {
    localStorage.setItem('sansah_iot_anthropic_key', anthropicApiKey);
  }, [anthropicApiKey]);

  // Persist Activities
  useEffect(() => {
    localStorage.setItem('sansah_activities', JSON.stringify(activities));
  }, [activities]);

  // Toast system helper
  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logActivity = (action, details) => {
    const newActivity = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 100));
  };

  const handleLogin = (userData) => {
    setUser(userData);
    window.location.hash = '';
    setActiveTab(userData.role === 'Admin' ? 'admin' : 'showcase');
    addToast(`Logged in as ${userData.name}`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('sansah_token');
    setUser(null);
    setActiveTab('login');
    addToast('Logged out successfully', 'info');
  };

  // Admin and State update actions (now handled by refetching in Admin component)
  const handleApproveProject = () => {};
  const handleRejectProject = () => {};
  const handleDeleteProject = () => {};

  const handleAddProject = async (projectData) => {
    const token = localStorage.getItem('sansah_token');
    try {
      let res;
      if (projectData.id) {
        res = await fetch(`${API_URL}/api/projects/${projectData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(projectData)
        });
      } else {
        res = await fetch(API_URL + '/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(projectData)
        });
      }
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Submission failed');
      }
      
      addToast(projectData.id ? 'Project updated successfully!' : 'Project submitted successfully!', 'success');
      logActivity(projectData.id ? 'Project Updated' : 'Project Submitted', `"${projectData.title}" was ${projectData.id ? 'updated' : 'submitted'}.`);
      setEditProjectData(null);
      setActiveTab('myprojects');
    } catch(err) {
      addToast(err.message, 'error');
    }
  };

  const handleResetData = () => {
    addToast('Reset data is disabled with MongoDB.', 'warning');
  };

  // Helper to extract YouTube video embed URL
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    
    // Regular expression to parse YouTube URL variations
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    
    if (match && match[2].length === 12 || (match && match[2].length === 11)) {
      return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
    }
    
    return url; // Fallback to raw URL if not parseable
  };

  const renderContent = () => {
    if (authChecking) return <div className="text-center py-20 text-slate-400 font-bold text-lg">Loading...</div>;

    if (!user) {
      if (activeTab === 'signup') return <Signup onSignup={handleLogin} />;
      return <Login onLogin={handleLogin} />;
    }

    switch (activeTab) {
      case 'showcase':
        return (
          <Showcase
            projects={projects}
            onWatchDemo={setActiveVideoProject}
            categories={CATEGORIES}
            departments={DEPARTMENTS}
            user={user}
          />
        );
      case 'submit':
        return (
          <Submit
            onSubmit={handleAddProject}
            addToast={addToast}
            categories={CATEGORIES}
            departments={DEPARTMENTS}
            anthropicApiKey={anthropicApiKey}
            editProjectData={editProjectData}
            user={user}
          />
        );
      case 'myprojects':
        return <MyProjects setActiveTab={setActiveTab} setEditProjectData={setEditProjectData} user={user} />;
      case 'profile':
        return <Profile user={user} setUser={setUser} />;
      case 'help':
        return <Help />;
      case 'admin':
        if (user.role !== 'Admin') return null;
        return (
          <Admin
            anthropicApiKey={anthropicApiKey}
            setAnthropicApiKey={setAnthropicApiKey}
            addToast={addToast}
            activities={activities}
          />
        );
      case 'analytics':
        if (user.role !== 'Admin') return null;
        return <Analytics departments={DEPARTMENTS} />;
      case 'members':
        if (user.role !== 'Admin') return null;
        return <Members departments={DEPARTMENTS} addToast={addToast} />;
      default:
        return (
          <Showcase
            projects={projects}
            onWatchDemo={setActiveVideoProject}
            categories={CATEGORIES}
            departments={DEPARTMENTS}
            user={user}
          />
        );
    }
  };

  // Count pending submissions for navbar badge
  const pendingCount = projects.filter((p) => p.status === 'Pending').length;

  if (window.location.pathname === '/verify-email') {
    return <VerifyEmail />;
  }

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col lg:flex-row relative">
      {/* Background Decorative Blur Gradients */}
      <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-red-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Sidebar Navigation */}
      {user && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          pendingCount={pendingCount}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          user={user}
          onLogout={handleLogout}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-h-screen pt-16 lg:pt-0 ${user ? 'lg:pl-80' : ''} transition-all duration-300`}>
        <div className="p-4 sm:p-6 lg:p-10 max-w-7xl w-full mx-auto flex-1 pb-16 lg:pb-10">
          {renderContent()}
        </div>
      </main>

      {/* Toast Notification Stack */}
      <div className="fixed top-4 right-4 z-100 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`
              p-4 rounded-xl shadow-2xl flex items-start gap-3 border pointer-events-auto cursor-pointer
              transform translate-y-0 transition-all duration-300 hover:scale-[1.02] animate-in slide-in-from-top-4
              ${toast.type === 'success' ? 'bg-navy-900/95 border-emerald-500/30 text-slate-100 shadow-emerald-500/5' : ''}
              ${toast.type === 'error' ? 'bg-navy-900/95 border-rose-500/30 text-slate-100 shadow-rose-500/5' : ''}
              ${toast.type === 'warning' ? 'bg-navy-900/95 border-amber-500/30 text-slate-100 shadow-amber-500/5' : ''}
              ${toast.type === 'info' ? 'bg-navy-900/95 border-cyan-500/30 text-slate-100 shadow-cyan-500/5' : ''}
            `}
          >
            <div className={`mt-0.5 shrink-0
              ${toast.type === 'success' ? 'text-emerald-400' : ''}
              ${toast.type === 'error' ? 'text-rose-400' : ''}
              ${toast.type === 'warning' ? 'text-amber-400' : ''}
              ${toast.type === 'info' ? 'text-cyan-400' : ''}
            `}>
              {toast.type === 'success' && <CheckCircle2 size={18} />}
              {toast.type === 'error' && <XOctagon size={18} />}
              {toast.type === 'warning' && <AlertTriangle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
            </div>
            
            <div className="flex-1 text-xs font-semibold leading-normal">
              {toast.message}
            </div>

            <button className="text-slate-500 hover:text-slate-300 transition-colors">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Video YouTube Embed Modal */}
      {activeVideoProject && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveVideoProject(null)}
        >
          <div 
            className="w-full max-w-4xl bg-navy-950 border border-navy-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-navy-900 flex items-center justify-between bg-navy-900/50">
              <div className="flex items-center gap-2">
                <Cpu className="text-cyan-400" size={18} />
                <h3 className="text-sm font-bold text-slate-100 truncate max-w-md">
                  {activeVideoProject.title} &mdash; Demonstration
                </h3>
              </div>
              <button 
                onClick={() => setActiveVideoProject(null)}
                className="p-1 rounded-full bg-navy-900 hover:bg-navy-800 border border-navy-800 text-slate-400 hover:text-slate-100 transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Video Container */}
            <div className="relative aspect-video w-full bg-black">
              {activeVideoProject.videoUrl.includes('youtube') || activeVideoProject.videoUrl.includes('youtu.be') ? (
                <iframe
                  src={getYouTubeEmbedUrl(activeVideoProject.videoUrl)}
                  title={activeVideoProject.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                  <Terminal size={36} className="text-cyan-500 mb-2" />
                  <p className="text-sm font-semibold">Non-YouTube link detected</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mb-4">
                    This video URL cannot be embedded directly in our popup player.
                  </p>
                  <a
                    href={activeVideoProject.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-cyan-500 text-navy-950 hover:bg-cyan-400 rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                  >
                    Open Link in New Tab
                  </a>
                </div>
              )}
            </div>

            {/* Details Footer */}
            <div className="p-4 bg-navy-900/50 border-t border-navy-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-400">
              <div>
                Submitted by: <strong className="text-slate-300 font-bold">{activeVideoProject.studentName}</strong>
              </div>
              <div>
                Category: <strong className="text-cyan-400 font-bold">{activeVideoProject.category}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
