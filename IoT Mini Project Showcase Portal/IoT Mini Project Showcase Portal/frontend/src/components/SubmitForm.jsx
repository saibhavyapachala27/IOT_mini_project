import { API_URL } from '../config';
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  X,
  Upload,
  Link,
  Video,
  Github,
  BookOpen,
  User,
  Users,
  Cpu,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  FileText
} from 'lucide-react';

export default function SubmitForm({ onSubmit, addToast, categories, departments, anthropicApiKey, editProjectData, user }) {
  const [title, setTitle] = useState('');
  const [studentName, setStudentName] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [category, setCategory] = useState(categories[1] || 'Smart Home');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoSource, setPhotoSource] = useState('url'); // 'file' or 'url'
  const [photoFile, setPhotoFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfSource, setPdfSource] = useState('url'); // 'file' or 'url'
  const [pdfFile, setPdfFile] = useState(null);
  const [githubUrl, setGithubUrl] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState(departments ? departments[0] : 'Unknown');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [componentInput, setComponentInput] = useState('');
  const [components, setComponents] = useState([]);

  // Optional Toggleable Components States
  const [includeFile, setIncludeFile] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [fileSource, setFileSource] = useState('file'); // 'file' or 'url'
  const [generalFile, setGeneralFile] = useState(null);

  const [includeCode, setIncludeCode] = useState(false);
  const [codeFileUrl, setCodeFileUrl] = useState('');
  const [codeContent, setCodeContent] = useState('');
  const [codeFile, setCodeFile] = useState(null);

  const [includeSimulation, setIncludeSimulation] = useState(false);
  const [simulationUrl, setSimulationUrl] = useState('');

  const [includeVideo, setIncludeVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  const [includeDrive, setIncludeDrive] = useState(false);
  const [driveUrl, setDriveUrl] = useState('');

  // Computing optional component: Line and Pic
  const [includeComputing, setIncludeComputing] = useState(false);
  const [computingLine, setComputingLine] = useState('');
  const [computingPicUrl, setComputingPicUrl] = useState('');
  const [computingPicSource, setComputingPicSource] = useState('file'); // 'file' or 'url'
  const [computingPicFile, setComputingPicFile] = useState(null);

  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [photoPreviewError, setPhotoPreviewError] = useState(false);

  // Reset preview error when URL changes
  useEffect(() => {
    setPhotoPreviewError(false);
  }, [photoUrl]);

  // Populate data when editing
  useEffect(() => {
    if (editProjectData) {
      setTitle(editProjectData.title || '');
      setStudentName(editProjectData.studentName || '');
      setTeamMembers(editProjectData.teamMembers || '');
      setCategory(editProjectData.category || (categories[1] || 'Smart Home'));
      const matchedDept = editProjectData.department ? departments.find(d => d.toLowerCase().trim() === editProjectData.department.toLowerCase().trim()) : null;
      setDepartment(matchedDept || editProjectData.department || (departments ? departments[0] : 'Unknown'));
      setPhotoUrl(editProjectData.photoUrl || '');
      setPhotoSource('url');
      setPhotoFile(null);
      setPdfUrl(editProjectData.pdfUrl || '');
      setPdfSource('url');
      setPdfFile(null);
      setGithubUrl(editProjectData.githubUrl || '');
      setDescription(editProjectData.description || '');
      setTags(editProjectData.tags || []);
      setComponents(editProjectData.components || []);

      // Populate optional fields
      setIncludeFile(editProjectData.includeFile || false);
      setFileUrl(editProjectData.fileUrl || '');
      setFileSource(editProjectData.fileUrl && editProjectData.fileUrl.startsWith('http') ? 'url' : 'file');
      setGeneralFile(null);

      setIncludeCode(editProjectData.includeCode || false);
      setCodeFileUrl(editProjectData.codeFileUrl || '');
      setCodeContent(editProjectData.codeContent || '');
      setCodeFile(null);

      setIncludeSimulation(editProjectData.includeSimulation || false);
      setSimulationUrl(editProjectData.simulationUrl || '');

      setIncludeVideo(editProjectData.includeVideo || false);
      setVideoUrl(editProjectData.videoUrl || '');

      setIncludeDrive(editProjectData.includeDrive || false);
      setDriveUrl(editProjectData.driveUrl || '');

      setIncludeComputing(editProjectData.includeComputing || false);
      setComputingLine(editProjectData.computingLine || '');
      setComputingPicUrl(editProjectData.computingPicUrl || '');
      setComputingPicSource(editProjectData.computingPicUrl && editProjectData.computingPicUrl.startsWith('http') ? 'url' : 'file');
      setComputingPicFile(null);
    } else {
      setTitle('');
      setStudentName(user?.name || '');
      setTeamMembers('');
      setCategory(categories[1] || 'Smart Home');
      setPhotoUrl('');
      setPhotoSource('url');
      setPhotoFile(null);
      setPdfUrl('');
      setPdfSource('url');
      setPdfFile(null);
      setGithubUrl('');
      setDescription('');
      
      const matchedDept = user?.department ? departments.find(d => d.toLowerCase().trim() === user.department.toLowerCase().trim()) : null;
      setDepartment(matchedDept || (departments ? departments[0] : 'Unknown'));
      
      setTags([]);
      setComponents([]);

      // Reset optional components
      setIncludeFile(false);
      setFileUrl('');
      setFileSource('file');
      setGeneralFile(null);
      setIncludeCode(false);
      setCodeFileUrl('');
      setCodeContent('');
      setCodeFile(null);
      setIncludeSimulation(false);
      setSimulationUrl('');
      setIncludeVideo(false);
      setVideoUrl('');
      setIncludeDrive(false);
      setDriveUrl('');
      setIncludeComputing(false);
      setComputingLine('');
      setComputingPicUrl('');
      setComputingPicSource('file');
      setComputingPicFile(null);
    }
  }, [editProjectData, categories, departments, user]);

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'pdf' && file.type !== 'application/pdf') {
      addToast('Please select a valid PDF document.', 'error');
      return;
    }
    if (type === 'photo' && !file.type.startsWith('image/')) {
      addToast('Please select a valid image file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (type === 'photo') {
        setPhotoFile({
          filename: file.name,
          fileData: reader.result
        });
        setPhotoUrl(reader.result);
      } else {
        setPdfFile({
          filename: file.name,
          fileData: reader.result
        });
        setPdfUrl(file.name);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleGeneralFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setGeneralFile({
        filename: file.name,
        fileData: reader.result
      });
      setFileUrl(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleCodeFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const textReader = new FileReader();
    textReader.onload = (event) => {
      setCodeContent(event.target.result);
    };
    textReader.readAsText(file);

    const base64Reader = new FileReader();
    base64Reader.onload = () => {
      setCodeFile({
        filename: file.name,
        fileData: base64Reader.result
      });
      setCodeFileUrl(file.name);
    };
    base64Reader.readAsDataURL(file);
  };

  const handleComputingPicChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setComputingPicFile({
        filename: file.name,
        fileData: reader.result
      });
      setComputingPicUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadFile = async (fileObj) => {
    try {
      const response = await fetch(API_URL + '/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fileObj)
      });
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      const data = await response.json();
      return data.url;
    } catch (err) {
      console.error(err);
      throw new Error(`Failed to upload ${fileObj.filename}`);
    }
  };

  const addComponent = () => {
    const trimmed = componentInput.trim();
    if (trimmed && !components.includes(trimmed)) {
      setComponents([...components, trimmed]);
      setComponentInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addComponent();
    }
  };

  const removeComponent = (idxToRemove) => {
    setComponents(components.filter((_, idx) => idx !== idxToRemove));
  };

  const addTag = () => {
    const trimmed = tagInput.trim().replace(/^#/, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (idxToRemove) => {
    setTags(tags.filter((_, idx) => idx !== idxToRemove));
  };

  // AI Description generator
  const generateAiDescription = async () => {
    if (!title) {
      addToast('Please enter a project title first!', 'error');
      return;
    }
    if (components.length === 0) {
      addToast('Please add at least one component to describe!', 'error');
      return;
    }

    setIsAiGenerating(true);
    addToast('Generating project description with AI...', 'info');

    const promptMessage = `Write a compelling, professional 3-4 sentence project description for a student IoT project titled "${title}" which utilizes the following components: ${components.join(', ')}. Focus on the problem it solves and how the components work together. Do not include introductory text like "Here is the description." Just output the description.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": anthropicApiKey || "DUMMY_KEY",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 400,
          messages: [
            {
              role: "user",
              content: promptMessage
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.content?.[0]?.text;
      if (text) {
        setDescription(text.trim());
        addToast('AI Description generated successfully!', 'success');
      } else {
        throw new Error('Empty content returned');
      }
    } catch (err) {
      console.warn("Anthropic API call failed. Using client fallback generator.", err);
      await new Promise(resolve => setTimeout(resolve, 1500));
      const simulatedText = generateMockDescription(title, components, category);
      animateTextTyping(simulatedText);
      addToast('Description generated using client-side AI Fallback (CORS/Key Bypass)', 'info');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const generateMockDescription = (projTitle, comps, cat) => {
    const listStr = comps.slice(0, -1).join(', ') + (comps.length > 1 ? ` and ${comps[comps.length - 1]}` : comps[0]);
    const templates = [
      `The "${projTitle}" is an innovative ${cat.toLowerCase() || 'IoT'} solution engineered to address modern automation challenges. By integrating ${listStr}, the project creates an intelligent, connected environment that monitors variables and automates actions. The core functionality leverages these controllers and sensors to aggregate environment telemetry, providing real-time data transparency and high-efficiency operational control.`,
      `Designed to optimize daily operations, the "${projTitle}" is a smart IoT system that implements advanced connectivity using ${listStr}. The application focuses on resolving user pain points in the ${cat.toLowerCase() || 'general'} sector by collecting sensor datasets and driving actuator outputs automatically. This setup facilitates remote monitoring, lowers resource consumption, and improves overall safety parameters.`,
      `The "${projTitle}" represents a state-of-the-art approach to ${cat.toLowerCase() || 'industrial IoT'} technology, incorporating ${listStr} into a unified monitoring node. Real-time data streams from the sensor array are processed dynamically to prompt warning thresholds or relay switching. This allows operators or students to monitor system parameters remotely, ensuring quick-response troubleshooting and streamlined resource tracking.`
    ];
    return templates[projTitle.length % templates.length];
  };

  const animateTextTyping = (fullText) => {
    setDescription('');
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < fullText.length) {
        setDescription(prev => prev + fullText.charAt(currentIdx));
        currentIdx += 2;
      } else {
        clearInterval(interval);
      }
    }, 15);
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic Validation
    if (!title.trim()) return addToast('Project Title is required!', 'error');
    if (!studentName.trim()) return addToast('Student Name is required!', 'error');
    if (components.length === 0) return addToast('Please add at least one component!', 'error');
    if (!description.trim()) return addToast('Please add a project description!', 'error');

    let uploadedPhotoUrl = photoUrl;
    let uploadedPdfUrl = pdfUrl;
    let uploadedGeneralFileUrl = fileUrl;
    let uploadedCodeFileUrl = codeFileUrl;
    let uploadedComputingPicUrl = computingPicUrl;

    try {
      if (photoSource === 'file' && photoFile) {
        addToast('Uploading project banner image...', 'info');
        uploadedPhotoUrl = await uploadFile(photoFile);
      }
      if (pdfSource === 'file' && pdfFile) {
        addToast('Uploading project PDF document...', 'info');
        uploadedPdfUrl = await uploadFile(pdfFile);
      }
      if (includeFile && fileSource === 'file' && generalFile) {
        addToast('Uploading attachment file...', 'info');
        uploadedGeneralFileUrl = await uploadFile(generalFile);
      }
      if (includeCode && codeFile) {
        addToast('Uploading source code file...', 'info');
        uploadedCodeFileUrl = await uploadFile(codeFile);
      }
      if (includeComputing && computingPicSource === 'file' && computingPicFile) {
        addToast('Uploading computing specifications diagram...', 'info');
        uploadedComputingPicUrl = await uploadFile(computingPicFile);
      }
    } catch (err) {
      addToast(err.message, 'error');
      return;
    }

    // Build project payload
    const projectData = {
      title: title.trim(),
      studentName: studentName.trim(),
      teamMembers: teamMembers.trim() ? teamMembers.trim() : studentName.trim(),
      department,
      tags,
      components,
      description: description.trim(),
      photoUrl: uploadedPhotoUrl.trim() || 'https://images.unsplash.com/photo-1517055720413-63a2b4b4d8cc?auto=format&fit=crop&q=80&w=800',
      pdfUrl: uploadedPdfUrl.trim(),
      githubUrl: githubUrl.trim(),
      category,

      // Optional features fields
      includeFile,
      fileUrl: includeFile ? uploadedGeneralFileUrl : '',
      includeCode,
      codeFileUrl: includeCode ? uploadedCodeFileUrl : '',
      codeContent: includeCode ? codeContent : '',
      includeSimulation,
      simulationUrl: includeSimulation ? simulationUrl.trim() : '',
      includeVideo,
      videoUrl: includeVideo ? videoUrl.trim() : '',
      includeDrive,
      driveUrl: includeDrive ? driveUrl.trim() : '',

      // Computing specs optional
      includeComputing,
      computingLine: includeComputing ? computingLine.trim() : '',
      computingPicUrl: includeComputing ? uploadedComputingPicUrl : '',
    };

    if (editProjectData) {
      projectData.id = editProjectData.id;
    }

    onSubmit(projectData);
  };

  return (
    <div className="max-w-3xl mx-auto bg-navy-900/40 rounded-2xl border border-navy-800/60 p-6 sm:p-8 backdrop-blur-md">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Upload className="text-cyan-400" size={22} />
          {editProjectData ? 'Edit IoT Project' : 'Submit New IoT Project'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Submit your IoT mini project details. Once approved by the administrator, it will be published to the public showcase board.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
              <BookOpen size={12} className="text-cyan-400" />
              Project Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Smart Irrigation System"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm appearance-none cursor-pointer focus:outline-none focus:border-cyan-500/50"
            >
              {categories.filter(c => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
              <User size={12} className="text-cyan-400" />
              Lead Student Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Arjun Patel"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
              <Users size={12} className="text-cyan-400" />
              Team Members (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Arjun Patel, Riya Sharma"
              value={teamMembers}
              onChange={(e) => setTeamMembers(e.target.value)}
              className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
              <BookOpen size={12} className="text-cyan-400" />
              Department <span className="text-rose-500">*</span>
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm appearance-none cursor-pointer focus:outline-none"
            >
              {departments && departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
              <Sparkles size={12} className="text-cyan-400" />
              Project Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type tag & press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 rounded-xl bg-navy-800 border border-navy-700 text-cyan-400 hover:bg-navy-700 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300">
                    #{tag}
                    <button type="button" onClick={() => removeTag(idx)} className="text-slate-500 hover:text-slate-300">
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Components Tag Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
            <Cpu size={12} className="text-cyan-400" />
            Components Used <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Type component name (e.g. ESP32) and press Enter"
              value={componentInput}
              onChange={(e) => setComponentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
            />
            <button
              type="button"
              onClick={addComponent}
              className="p-2.5 rounded-xl bg-navy-800 border border-navy-700 text-cyan-400 hover:bg-navy-700 hover:border-cyan-500/30 transition-colors"
            >
              <Plus size={20} />
            </button>
          </div>
          {components.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 p-2 bg-navy-950/50 rounded-xl border border-navy-800/40">
              {components.map((comp, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-cyan-950/80 text-cyan-400 border border-cyan-800/30 shadow-sm"
                >
                  {comp}
                  <button
                    type="button"
                    onClick={() => removeComponent(idx)}
                    className="p-0.5 rounded-full hover:bg-cyan-900 text-slate-400 hover:text-cyan-200 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-slate-500 italic pl-1">No components added yet. Press Enter or click + to add tags.</p>
          )}
        </div>

        {/* Media & Attachments Section */}
        <div className="border-t border-navy-800/40 pt-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Core Media & Links</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Banner Image */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1">
                  <Link size={12} className="text-cyan-400" />
                  Project Image Banner
                </label>
                <div className="flex bg-navy-950 p-0.5 rounded-lg border border-navy-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setPhotoSource('file')}
                    className={`px-2.5 py-1 rounded font-semibold transition-all ${photoSource === 'file' ? 'bg-navy-850 text-cyan-400 border border-navy-700/50' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setPhotoSource('url')}
                    className={`px-2.5 py-1 rounded font-semibold transition-all ${photoSource === 'url' ? 'bg-navy-850 text-cyan-400 border border-navy-700/50' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Web URL
                  </button>
                </div>
              </div>
              
              {photoSource === 'file' ? (
                <div className="relative border border-dashed border-navy-800 rounded-xl p-4 flex flex-col items-center justify-center bg-navy-950/40 hover:border-cyan-500/30 transition-all cursor-pointer h-24">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, 'photo')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload size={20} className="text-slate-500 mb-1" />
                  <span className="text-xs text-slate-300 font-medium truncate max-w-full px-2">
                    {photoFile ? photoFile.filename : 'Choose Image File'}
                  </span>
                  <span className="text-[9px] text-slate-600 mt-0.5">PNG, JPG, or GIF up to 5MB</span>
                </div>
              ) : (
                <input
                  type="url"
                  placeholder="https://example.com/project.jpg"
                  value={photoUrl.startsWith('data:') ? '' : photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm h-12 focus:outline-none focus:border-cyan-500/50"
                />
              )}
            </div>

            {/* PDF Document */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1">
                  <FileText size={12} className="text-cyan-400" />
                  Project Document (PDF)
                </label>
                <div className="flex bg-navy-950 p-0.5 rounded-lg border border-navy-800 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setPdfSource('file')}
                    className={`px-2.5 py-1 rounded font-semibold transition-all ${pdfSource === 'file' ? 'bg-navy-850 text-cyan-400 border border-navy-700/50' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfSource('url')}
                    className={`px-2.5 py-1 rounded font-semibold transition-all ${pdfSource === 'url' ? 'bg-navy-850 text-cyan-400 border border-navy-700/50' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    Web URL
                  </button>
                </div>
              </div>

              {pdfSource === 'file' ? (
                <div className="relative border border-dashed border-navy-800 rounded-xl p-4 flex flex-col items-center justify-center bg-navy-950/40 hover:border-cyan-500/30 transition-all cursor-pointer h-24">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileChange(e, 'pdf')}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload size={20} className="text-slate-500 mb-1" />
                  <span className="text-xs text-slate-300 font-medium truncate max-w-full px-2">
                    {pdfFile ? pdfFile.filename : (pdfUrl && !pdfUrl.startsWith('http') ? pdfUrl : 'Choose PDF Document')}
                  </span>
                  <span className="text-[9px] text-slate-600 mt-0.5">PDF Document up to 10MB</span>
                </div>
              ) : (
                <input
                  type="url"
                  placeholder="https://example.com/document.pdf"
                  value={pdfUrl && !pdfUrl.startsWith('http') ? '' : pdfUrl}
                  onChange={(e) => setPdfUrl(e.target.value)}
                  className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm h-12 focus:outline-none focus:border-cyan-500/50"
                />
              )}

              {pdfUrl && (
                <div className="mt-2 pl-1 text-[11px] text-cyan-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle size={12} />
                  <span>Attached: {pdfUrl.startsWith('http') ? 'Web PDF Document' : pdfUrl}</span>
                  {pdfUrl.startsWith('http') && (
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-200 underline ml-1 inline-flex items-center gap-0.5">
                      Test Link <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* GitHub Repo */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-1.5 flex items-center gap-1">
                <Github size={12} className="text-cyan-400" />
                GitHub Repo URL
              </label>
              <input
                type="url"
                placeholder="https://github.com/username/project"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>

        {/* Optional Toggleable Components Section */}
        <div className="border-t border-navy-800/40 pt-6">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Toggle Optional Components</h3>
          
          <div className="space-y-4">
            {/* 1. File Upload Toggle */}
            <div className={`p-4 rounded-xl border transition-all ${includeFile ? 'bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.05)]' : 'bg-navy-900/20 border-navy-800/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${includeFile ? 'bg-cyan-900/50 text-cyan-400' : 'bg-navy-950 text-slate-500'}`}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Additional File Upload</h4>
                    <p className="text-[10px] text-slate-500">Attach extra datasets, layouts, schematics, or zip archives.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeFile(!includeFile)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-all ${includeFile ? 'bg-cyan-500 justify-end' : 'bg-navy-800 justify-start'}`}
                >
                  <span className="w-4 h-4 rounded-full bg-navy-950 shadow-md"></span>
                </button>
              </div>

              {includeFile && (
                <div className="mt-4 pt-4 border-t border-navy-850/60 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-200">
                  <div>
                    <div className="flex bg-navy-950 p-0.5 rounded-lg border border-navy-800 text-[10px] w-fit mb-2">
                      <button
                        type="button"
                        onClick={() => setFileSource('file')}
                        className={`px-2.5 py-1 rounded font-semibold transition-all ${fileSource === 'file' ? 'bg-navy-850 text-cyan-400 border border-navy-700/50' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setFileSource('url')}
                        className={`px-2.5 py-1 rounded font-semibold transition-all ${fileSource === 'url' ? 'bg-navy-850 text-cyan-400 border border-navy-700/50' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Web URL
                      </button>
                    </div>

                    {fileSource === 'file' ? (
                      <div className="relative border border-dashed border-navy-800 rounded-xl p-4 flex flex-col items-center justify-center bg-navy-950/40 hover:border-cyan-500/30 transition-all cursor-pointer h-20">
                        <input
                          type="file"
                          onChange={handleGeneralFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload size={16} className="text-slate-500 mb-1" />
                        <span className="text-xs text-slate-350 font-medium truncate max-w-full px-2">
                          {generalFile ? generalFile.filename : (fileUrl && !fileUrl.startsWith('http') ? fileUrl : 'Choose File')}
                        </span>
                      </div>
                    ) : (
                      <input
                        type="url"
                        placeholder="https://example.com/datasheet.zip"
                        value={fileUrl && !fileUrl.startsWith('http') ? '' : fileUrl}
                        onChange={(e) => setFileUrl(e.target.value)}
                        className="w-full bg-navy-950 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500/50"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Code File Upload Toggle */}
            <div className={`p-4 rounded-xl border transition-all ${includeCode ? 'bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.05)]' : 'bg-navy-900/20 border-navy-800/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${includeCode ? 'bg-cyan-900/50 text-cyan-400' : 'bg-navy-950 text-slate-500'}`}>
                    <FileText size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Source Code File Upload</h4>
                    <p className="text-[10px] text-slate-500">Upload code files (.ino, .py, .cpp, .js) and preview text content.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeCode(!includeCode)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-all ${includeCode ? 'bg-cyan-500 justify-end' : 'bg-navy-800 justify-start'}`}
                >
                  <span className="w-4 h-4 rounded-full bg-navy-950 shadow-md"></span>
                </button>
              </div>

              {includeCode && (
                <div className="mt-4 pt-4 border-t border-navy-850/60 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  <div className="relative border border-dashed border-navy-800 rounded-xl p-4 flex flex-col items-center justify-center bg-navy-950/40 hover:border-cyan-500/30 transition-all cursor-pointer h-20">
                    <input
                      type="file"
                      accept=".ino,.py,.cpp,.c,.js,.txt,.json,.h"
                      onChange={handleCodeFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Upload size={16} className="text-slate-500 mb-1" />
                    <span className="text-xs text-slate-355 font-medium truncate max-w-full px-2">
                      {codeFile ? codeFile.filename : (codeFileUrl ? codeFileUrl : 'Select Code File')}
                    </span>
                  </div>

                  {codeContent && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Code Preview</span>
                      <textarea
                        rows={6}
                        value={codeContent}
                        onChange={(e) => setCodeContent(e.target.value)}
                        className="w-full bg-navy-950 border border-navy-900 text-slate-300 font-mono text-[11px] rounded-xl p-3 focus:outline-none focus:border-cyan-500/30 leading-normal resize-none font-semibold"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Simulation Link Toggle */}
            <div className={`p-4 rounded-xl border transition-all ${includeSimulation ? 'bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.05)]' : 'bg-navy-900/20 border-navy-800/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${includeSimulation ? 'bg-cyan-900/50 text-cyan-400' : 'bg-navy-950 text-slate-500'}`}>
                    <Cpu size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Interactive Simulation</h4>
                    <p className="text-[10px] text-slate-500">Provide Wokwi or Tinkercad micro-controller simulator link.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeSimulation(!includeSimulation)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-all ${includeSimulation ? 'bg-cyan-500 justify-end' : 'bg-navy-800 justify-start'}`}
                >
                  <span className="w-4 h-4 rounded-full bg-navy-950 shadow-md"></span>
                </button>
              </div>

              {includeSimulation && (
                <div className="mt-4 pt-4 border-t border-navy-850/60 animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Wokwi/Tinkercad Link</label>
                  <input
                    type="url"
                    placeholder="https://wokwi.com/projects/..."
                    value={simulationUrl}
                    onChange={(e) => setSimulationUrl(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              )}
            </div>

            {/* 4. Video Reference Toggle */}
            <div className={`p-4 rounded-xl border transition-all ${includeVideo ? 'bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.05)]' : 'bg-navy-900/20 border-navy-800/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${includeVideo ? 'bg-cyan-900/50 text-cyan-400' : 'bg-navy-950 text-slate-500'}`}>
                    <Video size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">YouTube Video Reference</h4>
                    <p className="text-[10px] text-slate-500">Embed a YouTube demonstration or video pitch for this project.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeVideo(!includeVideo)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-all ${includeVideo ? 'bg-cyan-500 justify-end' : 'bg-navy-800 justify-start'}`}
                >
                  <span className="w-4 h-4 rounded-full bg-navy-950 shadow-md"></span>
                </button>
              </div>

              {includeVideo && (
                <div className="mt-4 pt-4 border-t border-navy-850/60 animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">YouTube URL</label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              )}
            </div>

            {/* 5. Google Drive Link Toggle */}
            <div className={`p-4 rounded-xl border transition-all ${includeDrive ? 'bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.05)]' : 'bg-navy-900/20 border-navy-800/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${includeDrive ? 'bg-cyan-900/50 text-cyan-400' : 'bg-navy-950 text-slate-500'}`}>
                    <Link size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Google Drive Links</h4>
                    <p className="text-[10px] text-slate-500">Provide link to tutorials, extra media, code, or shared Drive folder.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeDrive(!includeDrive)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-all ${includeDrive ? 'bg-cyan-500 justify-end' : 'bg-navy-800 justify-start'}`}
                >
                  <span className="w-4 h-4 rounded-full bg-navy-950 shadow-md"></span>
                </button>
              </div>

              {includeDrive && (
                <div className="mt-4 pt-4 border-t border-navy-850/60 animate-in slide-in-from-top-2 duration-200">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Google Drive URL</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={driveUrl}
                    onChange={(e) => setDriveUrl(e.target.value)}
                    className="w-full bg-navy-950 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              )}
            </div>

            {/* 6. Computing Section (Line & Pic) Toggle */}
            <div className={`p-4 rounded-xl border transition-all ${includeComputing ? 'bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.05)]' : 'bg-navy-900/20 border-navy-800/50'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${includeComputing ? 'bg-cyan-900/50 text-cyan-400' : 'bg-navy-950 text-slate-500'}`}>
                    <Cpu size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Computing Specifications</h4>
                    <p className="text-[10px] text-slate-500">Provide a technical configuration description (Line) and architectural setup diagram (Pic).</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIncludeComputing(!includeComputing)}
                  className={`w-10 h-6 flex items-center rounded-full p-1 transition-all ${includeComputing ? 'bg-cyan-500 justify-end' : 'bg-navy-800 justify-start'}`}
                >
                  <span className="w-4 h-4 rounded-full bg-navy-950 shadow-md"></span>
                </button>
              </div>

              {includeComputing && (
                <div className="mt-4 pt-4 border-t border-navy-850/60 space-y-4 animate-in slide-in-from-top-2 duration-200">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Computing Specifications (Text Line)</label>
                    <input
                      type="text"
                      placeholder="e.g. Raspberry Pi 4 edge compute cluster running Local MQTT broker"
                      value={computingLine}
                      onChange={(e) => setComputingLine(e.target.value)}
                      className="w-full bg-navy-950 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500/50"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Computing Diagram / Setup Picture</label>
                      <div className="flex bg-navy-950 p-0.5 rounded-lg border border-navy-800 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setComputingPicSource('file')}
                          className={`px-2.5 py-1 rounded font-semibold transition-all ${computingPicSource === 'file' ? 'bg-navy-850 text-cyan-400 border border-navy-700/50' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          Upload File
                        </button>
                        <button
                          type="button"
                          onClick={() => setComputingPicSource('url')}
                          className={`px-2.5 py-1 rounded font-semibold transition-all ${computingPicSource === 'url' ? 'bg-navy-850 text-cyan-400 border border-navy-700/50' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                          Web URL
                        </button>
                      </div>
                    </div>

                    {computingPicSource === 'file' ? (
                      <div className="relative border border-dashed border-navy-800 rounded-xl p-4 flex flex-col items-center justify-center bg-navy-950/40 hover:border-cyan-500/30 transition-all cursor-pointer h-20">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleComputingPicChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <Upload size={16} className="text-slate-500 mb-1" />
                        <span className="text-xs text-slate-350 font-medium truncate max-w-full px-2">
                          {computingPicFile ? computingPicFile.filename : (computingPicUrl && !computingPicUrl.startsWith('http') ? 'Diagram Attached' : 'Choose Diagram Pic')}
                        </span>
                      </div>
                    ) : (
                      <input
                        type="url"
                        placeholder="https://example.com/computing-setup.png"
                        value={computingPicUrl && !computingPicUrl.startsWith('http') ? '' : computingPicUrl}
                        onChange={(e) => setComputingPicUrl(e.target.value)}
                        className="w-full bg-navy-950 border border-navy-800 text-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-cyan-500/50"
                      />
                    )}

                    {computingPicUrl && (
                      <div className="mt-2 text-center">
                        <span className="text-[9px] text-slate-500 font-bold uppercase block mb-1">Diagram Preview</span>
                        <img src={computingPicUrl} alt="Computing Setup Preview" className="mx-auto h-24 object-contain rounded-lg border border-navy-800" />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Photo URL Live Preview (If present) */}
        {photoUrl && !photoPreviewError && (
          <div className="p-3 bg-navy-950/40 rounded-xl border border-navy-800/40 flex flex-col items-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase mb-2">Live Photo Preview</span>
            <div className="relative w-48 h-28 rounded-lg overflow-hidden border border-navy-800">
              <img
                src={photoUrl}
                alt="Preview"
                onError={() => setPhotoPreviewError(true)}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Project Description with AI generator */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-400 tracking-wider uppercase flex items-center gap-1">
              Project Abstract / Description <span className="text-rose-500">*</span>
            </label>

            <button
              type="button"
              disabled={isAiGenerating}
              onClick={generateAiDescription}
              className={`
                flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold transition-all
                ${isAiGenerating
                  ? 'bg-navy-950 border-cyan-800/30 text-cyan-500 cursor-not-allowed'
                  : 'bg-cyan-950/50 border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-navy-950 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                }
              `}
            >
              <Sparkles size={13} className={isAiGenerating ? 'animate-spin' : ''} />
              <span>{isAiGenerating ? 'AI Generating...' : 'Generate Description'}</span>
            </button>
          </div>

          <textarea
            rows={5}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your project, the hardware connections, the logic, and what problems it solves..."
            className="w-full bg-navy-950/80 border border-navy-800 text-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-cyan-500/50"
          />

          {!anthropicApiKey && (
            <div className="flex items-start gap-2 mt-2 p-2.5 rounded-lg bg-navy-950/60 border border-navy-800/30 text-[11px] text-slate-500">
              <AlertCircle size={14} className="text-cyan-500 mt-0.5 shrink-0" />
              <p>
                No Anthropic API key configured in Admin Settings. The description generator will use a detailed local context-aware text synthesizer fallback. Configure an API key in the <strong>Admin Dashboard</strong> settings to use actual Claude models.
              </p>
            </div>
          )}
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 text-navy-950 hover:bg-cyan-400 rounded-xl font-extrabold text-sm tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-[0.98]"
          >
            {editProjectData
              ? (editProjectData.status === 'Rejected' ? 'Edit & Resubmit Project' : 'Save Changes')
              : 'Submit Project for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
}
