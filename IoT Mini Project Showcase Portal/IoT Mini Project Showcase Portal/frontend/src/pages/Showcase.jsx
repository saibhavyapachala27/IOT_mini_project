import React, { useState } from 'react';
import FilterBar from '../components/FilterBar';
import ProjectCard from '../components/ProjectCard';
import ReviewModal from '../components/ReviewModal';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import { LayoutGrid, Cpu } from 'lucide-react';

export default function Showcase({ projects, onWatchDemo, categories, departments, user }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [activeReviewProject, setActiveReviewProject] = useState(null);
  const [activeDetailsProject, setActiveDetailsProject] = useState(null);

  // Filter approved projects first
  const approvedProjects = projects.filter(p => p.status === 'Approved');

  // Apply category, department, and search filters
  const filteredProjects = approvedProjects.filter((project) => {
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesDepartment = selectedDepartment === 'All' || 
      (project.department && project.department.toLowerCase().trim() === selectedDepartment.toLowerCase().trim());

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory && matchesDepartment;

    const matchesSearch =
      project.title.toLowerCase().includes(query) ||
      project.studentName.toLowerCase().includes(query) ||
      (project.teamMembers && project.teamMembers.toLowerCase().includes(query)) ||
      (project.tags && project.tags.some(tag => tag.toLowerCase().includes(query))) ||
      (project.components && project.components.some(comp => comp.toLowerCase().includes(query)));

    return matchesCategory && matchesDepartment && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-navy-900 to-navy-950 border border-navy-800/60 p-6 sm:p-8 flex flex-col justify-center">
        {/* Glow decoration */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/30 text-cyan-400 text-xs font-semibold mb-3">
            <Cpu size={12} className="animate-pulse" />
            <span>Sansah Innovations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
            IoT Mini Project Showcase
          </h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Discover cutting-edge Internet of Things prototypes designed, coded, and built by our students. Check out sensor designs, microcontrollers, and live video demonstrations.
          </p>
        </div>
      </div>

      {/* Filter and Search Section */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        departments={departments}
      />

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="py-20 text-center text-slate-500 border border-dashed border-navy-800 rounded-2xl bg-navy-900/10">
          <LayoutGrid size={48} className="mx-auto mb-3 text-slate-600" />
          <h3 className="font-extrabold text-base text-slate-400">No Projects Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            We couldn't find any approved projects matching the selected category or search filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onWatchDemo={onWatchDemo}
              onReviewClick={setActiveReviewProject}
              onDetailsClick={setActiveDetailsProject}
              user={user}
            />
          ))}
        </div>
      )}

      {/* Project Details Modal */}
      {activeDetailsProject && (
        <ProjectDetailsModal
          project={activeDetailsProject}
          user={user}
          onClose={() => setActiveDetailsProject(null)}
          onWatchDemo={onWatchDemo}
        />
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
