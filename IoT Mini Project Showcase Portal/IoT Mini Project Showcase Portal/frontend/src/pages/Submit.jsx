import React from 'react';
import SubmitForm from '../components/SubmitForm';
import { Upload } from 'lucide-react';

export default function Submit({ onSubmit, addToast, categories, departments, anthropicApiKey, editProjectData, user }) {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title Header */}
      <div className="border-b border-navy-800/40 pb-4">
        <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
          <Upload className="text-cyan-400" size={24} />
          Student Submission Portal
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Are you a student at Sansah Innovations? Register your IoT prototype, specify your sensors, and submit for certification.
        </p>
      </div>

      {/* Submission Form component */}
      <SubmitForm
        onSubmit={onSubmit}
        addToast={addToast}
        categories={categories}
        departments={departments}
        anthropicApiKey={anthropicApiKey}
        editProjectData={editProjectData}
        user={user}
      />
    </div>
  );
}
