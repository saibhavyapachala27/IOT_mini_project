import React from 'react';
import { 
  Cpu, 
  LayoutGrid, 
  PlusCircle, 
  Settings, 
  X, 
  Menu,
  GraduationCap,
  PieChart,
  Users,
  LogOut
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, pendingCount, sidebarOpen, setSidebarOpen, user, onLogout }) {
  const isAdmin = user?.role === 'Admin';

  const navItems = [
    {
      id: 'showcase',
      label: 'Public Showcase',
      icon: LayoutGrid,
      desc: 'Explore approved projects',
      show: true
    },
    {
      id: 'myprojects',
      label: 'My Projects',
      icon: LayoutGrid,
      desc: 'Manage your submissions',
      show: !isAdmin
    },
    {
      id: 'submit',
      label: 'Submit Project',
      icon: PlusCircle,
      desc: 'Share your innovation',
      show: !isAdmin
    },
    {
      id: 'admin',
      label: 'Admin Dashboard',
      icon: Settings,
      desc: 'Review submissions',
      badge: pendingCount > 0 ? pendingCount : null,
      show: isAdmin
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: PieChart,
      desc: 'Platform statistics',
      show: isAdmin
    },
    {
      id: 'members',
      label: 'Members',
      icon: Users,
      desc: 'User directory',
      show: isAdmin
    }
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden h-16 w-full glassmorphism border-b border-navy-800/50 flex items-center justify-between px-4 fixed top-0 left-0 z-40">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-800/30 text-cyan-400 glow-cyan">
            <Cpu size={20} className="animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-slate-100 leading-tight">Sansah Innovations</h1>
            <p className="text-[10px] text-cyan-400 font-medium tracking-wider uppercase">IoT Showcase Portal</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg bg-navy-900 border border-navy-800 text-slate-300 hover:text-cyan-400 transition-colors"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Backdrop for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 lg:w-80 glassmorphism border-r border-navy-800/40 
        z-50 lg:z-30 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col justify-between
      `}>
        {/* Upper section */}
        <div>
          {/* Brand header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-navy-800/30">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <Cpu size={24} className="animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div>
                <h1 className="font-extrabold text-slate-100 text-lg leading-tight tracking-tight">Sansah</h1>
                <p className="text-xs text-cyan-400 font-semibold tracking-widest uppercase">Innovations</p>
              </div>
            </div>
            
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-navy-900 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2 mt-4">
            {navItems.filter(item => item.show).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group text-left
                    ${isActive 
                      ? 'bg-cyan-950/45 border border-cyan-500/20 text-cyan-400 shadow-[inset_0_0_10px_rgba(6,182,212,0.08)]' 
                      : 'hover:bg-navy-900/60 border border-transparent text-slate-400 hover:text-slate-200'
                    }
                  `}
                >
                  <div className={`
                    p-2 rounded-lg transition-colors
                    ${isActive ? 'bg-cyan-900/50 text-cyan-400' : 'bg-navy-900 text-slate-400 group-hover:text-cyan-400 group-hover:bg-navy-800'}
                  `}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm tracking-wide">{item.label}</span>
                      {item.badge !== null && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-cyan-500 text-navy-950 rounded-full animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate group-hover:text-slate-400 transition-colors mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Lower Section / Branding / Footer */}
        <div className="p-4 border-t border-navy-800/30">
          <div className="bg-navy-900/55 rounded-xl border border-navy-800/40 p-3 mb-3">
            <button 
              onClick={() => { setActiveTab('profile'); setSidebarOpen(false); }}
              className="w-full flex gap-3 items-center mb-3 text-left hover:bg-navy-800/50 p-2 rounded-lg transition-colors group"
            >
              <div className="p-2.5 rounded-lg bg-navy-800 text-cyan-400 group-hover:bg-cyan-900/50 transition-colors">
                <GraduationCap size={20} />
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-xs text-slate-200 font-bold truncate group-hover:text-cyan-400 transition-colors">{user?.name}</p>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{user?.role}</p>
              </div>
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase transition-colors"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-600 font-medium tracking-wide">
              &copy; {new Date().getFullYear()} Sansah Innovations
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
