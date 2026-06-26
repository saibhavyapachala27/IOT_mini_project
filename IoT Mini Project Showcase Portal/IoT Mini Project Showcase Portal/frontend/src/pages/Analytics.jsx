import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { PieChart, BarChart3, Activity } from 'lucide-react';

export default function Analytics({ departments }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('sansah_token');
        const res = await fetch(API_URL + '/api/admin/projects', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Compute Data for Approval Status Donut
  const pending = projects.filter(p => p.status === 'Pending').length;
  const underReview = projects.filter(p => p.status === 'Under Review').length;
  const approved = projects.filter(p => p.status === 'Approved').length;
  const rejected = projects.filter(p => p.status === 'Rejected').length;
  
  const statusData = [
    { label: 'Approved', value: approved, color: '#34d399' }, // emerald-400
    { label: 'Under Review', value: underReview, color: '#60a5fa' }, // blue-400
    { label: 'Pending Review', value: pending, color: '#fbbf24' }, // amber-400
    { label: 'Rejected', value: rejected, color: '#fb7185' } // rose-400
  ].filter(d => d.value > 0);

  // Compute Data for Department Donut
  const deptCounts = departments.map(dept => ({
    label: dept,
    value: projects.filter(p => p.department && p.department.toLowerCase().trim() === dept.toLowerCase().trim()).length
  }));
  const deptColors = ['#22d3ee', '#818cf8', '#a78bfa', '#f472b6', '#38bdf8', '#fb923c'];
  const departmentData = deptCounts
    .filter(d => d.value > 0)
    .map((d, i) => ({ ...d, color: deptColors[i % deptColors.length] }));

  // Compute Data for Monthly Submissions
  const monthlyCounts = {};
  projects.forEach(p => {
    const d = new Date(p.createdAt);
    const month = d.toLocaleString('default', { month: 'short' });
    monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
  });
  
  // Create a sorted array of last 6 months
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toLocaleString('default', { month: 'short' }));
  }

  const barData = months.map(m => ({
    label: m,
    value: monthlyCounts[m] || 0
  }));
  const maxBarValue = Math.max(...barData.map(d => d.value), 1); // Avoid div by 0

  if (loading) {
    return <div className="py-20 text-center text-slate-400">Loading analytics...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="border-b border-navy-800/40 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <PieChart className="text-cyan-400" size={24} />
          Portal Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Visual insights into project submissions, department distribution, and review statuses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution Donut Chart */}
        <div className="bg-navy-900/40 border border-navy-800/60 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-6">
            <PieChart size={16} className="text-cyan-400" />
            Projects by Department
          </h3>
          {departmentData.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-10">No department data available.</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-48 h-48 relative">
                <DonutChart data={departmentData} />
              </div>
              <div className="space-y-3 flex-1">
                {departmentData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-slate-300 truncate max-w-[140px]" title={d.label}>{d.label}</span>
                    </div>
                    <span className="text-slate-100 font-bold">{d.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Approval Status Donut Chart */}
        <div className="bg-navy-900/40 border border-navy-800/60 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-6">
            <Activity size={16} className="text-cyan-400" />
            Approval Status Overview
          </h3>
          {statusData.length === 0 ? (
            <p className="text-slate-500 text-xs text-center py-10">No status data available.</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-48 h-48 relative">
                <DonutChart data={statusData} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-extrabold text-slate-100">{projects.length}</span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Total</span>
                </div>
              </div>
              <div className="space-y-3 flex-1 w-full">
                {statusData.map((d, i) => {
                  const pct = Math.round((d.value / projects.length) * 100);
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-slate-300">{d.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{pct}%</span>
                        <span className="text-slate-100 font-bold">{d.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Monthly Submissions Bar Chart */}
        <div className="lg:col-span-2 bg-navy-900/40 border border-navy-800/60 rounded-2xl p-6 backdrop-blur-md">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 mb-8">
            <BarChart3 size={16} className="text-cyan-400" />
            Monthly Submissions Trend (Last 6 Months)
          </h3>
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 relative px-2">
            {/* Y-axis guidelines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
              {[1, 0.75, 0.5, 0.25, 0].map((step, i) => (
                <div key={i} className="w-full border-t border-navy-800/50 flex items-start">
                  <span className="text-[10px] text-slate-600 -mt-2.5 bg-navy-950/80 px-1 ml-[-20px]">
                    {Math.round(maxBarValue * step)}
                  </span>
                </div>
              ))}
            </div>

            {/* Bars */}
            {barData.map((d, i) => {
              const heightPct = (d.value / maxBarValue) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full z-10 group">
                  <div 
                    className="w-full max-w-[40px] bg-gradient-to-t from-cyan-900/40 to-cyan-400/80 rounded-t-lg transition-all duration-500 group-hover:to-cyan-300 relative flex justify-center"
                    style={{ height: `${heightPct === 0 ? 1 : heightPct}%` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-navy-950 border border-cyan-800/50 text-cyan-400 text-xs font-bold px-2 py-1 rounded transition-opacity shadow-lg">
                      {d.value}
                    </div>
                  </div>
                  <div className="h-8 mt-2 flex items-center justify-center">
                    <span className="text-xs text-slate-400 font-semibold">{d.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple SVG Donut Chart Component
function DonutChart({ data }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativePercent = 0;
  
  return (
    <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 filter drop-shadow-[0_0_10px_rgba(0,0,0,0.5)]">
      {data.map((slice, i) => {
        const percent = (slice.value / total) * 100;
        const offset = 100 - cumulativePercent;
        cumulativePercent += percent;
        
        return (
          <circle
            key={i}
            cx="18" cy="18" r="15.91549430918954"
            fill="transparent"
            stroke={slice.color}
            strokeWidth="4"
            strokeDasharray={`${percent} ${100 - percent}`}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out hover:stroke-width-[5px] cursor-pointer"
          />
        );
      })}
    </svg>
  );
}
