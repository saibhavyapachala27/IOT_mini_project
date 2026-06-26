import React from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';

export default function FilterBar({
  searchQuery, setSearchQuery,
  selectedCategory, setSelectedCategory, categories,
  selectedDepartment, setSelectedDepartment, departments
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full md:flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, student, tags, components..."
            className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-navy-800 text-slate-200 placeholder-slate-500 rounded-xl focus:border-cyan-500/50 focus:shadow-[0_0_12px_rgba(6,182,212,0.1)] transition-all text-sm"
          />
        </div>

        {departments && (
          <div className="relative w-full md:w-64 shrink-0">
            <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full appearance-none bg-navy-900 border border-navy-800 text-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50 transition-all cursor-pointer"
            >
              <option value="All">All Departments</option>
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase mr-2">Categories:</span>
        {categories.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-200
                ${isActive
                  ? 'bg-cyan-500 text-navy-950 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.3)] scale-[1.03]'
                  : 'bg-navy-900/60 text-slate-400 border-navy-800/80 hover:text-slate-200 hover:border-navy-700 hover:bg-navy-900'
                }
              `}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
