import React, { useState, useEffect } from 'react';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GraveCard from './components/GraveCard';
import UploadModal from './components/UploadModal';
import AutopsyView from './components/AutopsyView';
import FrankensteinModal from './components/FrankensteinModal';
import ComparisonTable from './components/ComparisonTable';
import HowItWorksModal from './components/HowItWorksModal';
import { fetchProjects, fetchProjectDetails, resetDemoCemetery } from './services/api';
import { Skull, PlusCircle, Zap, RefreshCw, Loader2, Sparkles } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('landing'); // 'landing' | 'cemetery' | 'autopsy'
  const [currentTab, setCurrentTab] = useState('cemetery'); // 'cemetery' | 'comparison'

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedProjectData, setSelectedProjectData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [selectedForFrankenstein, setSelectedForFrankenstein] = useState([]);
  
  // Modals
  const [uploadOpen, setUploadOpen] = useState(false);
  const [frankensteinOpen, setFrankensteinOpen] = useState(false);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  // Load Projects from Backend
  const loadProjectsList = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data.projects || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectsList();
  }, []);

  // Handle selecting a project to view Autopsy
  const handleSelectProject = async (id) => {
    setSelectedProjectId(id);
    setLoadingDetails(true);
    setView('autopsy');
    try {
      const data = await fetchProjectDetails(id);
      setSelectedProjectData(data);
    } catch (err) {
      alert('Failed to load project details: ' + err.message);
      setView('cemetery');
    } finally {
      setLoadingDetails(false);
    }
  };

  // Toggle Frankenstein Selection
  const handleToggleFrankenstein = (id) => {
    setSelectedForFrankenstein(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      } else {
        if (prev.length >= 4) {
          alert('You can select up to 4 projects for Frankenstein Mode.');
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  // Reset Demo Cemetery
  const handleResetDemo = async () => {
    if (confirm('Reset Cemetery to original demo projects?')) {
      await resetDemoCemetery();
      await loadProjectsList();
      setSelectedForFrankenstein([]);
      setView('cemetery');
    }
  };

  // Upload Success
  const handleUploadSuccess = async (newProjectId) => {
    setUploadOpen(false);
    await loadProjectsList();
    handleSelectProject(newProjectId);
  };

  // Try Demo Project action from Hero
  const handleTryDemo = () => {
    setView('cemetery');
    const demoProj = projects.find(p => p.is_demo) || projects[0];
    if (demoProj) {
      handleSelectProject(demoProj.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080c] text-slate-100 relative selection:bg-purple-900 selection:text-purple-200">
      
      {/* Background Fog & Particle Animation */}
      <ParticleCanvas />

      {/* Sticky Navigation Bar */}
      <Navbar 
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          setCurrentTab(tab);
          if (view === 'landing' || view === 'autopsy') setView('cemetery');
        }}
        onOpenUpload={() => setUploadOpen(true)}
        onOpenFrankenstein={() => setFrankensteinOpen(true)}
        selectedForFrankenstein={selectedForFrankenstein}
        onOpenHowItWorks={() => setHowItWorksOpen(true)}
        onResetDemo={handleResetDemo}
      />

      <main className="relative z-10">
        
        {/* VIEW 1: LANDING PAGE */}
        {view === 'landing' && (
          <Hero 
            onEnterCemetery={() => setView('cemetery')}
            onOpenHowItWorks={() => setHowItWorksOpen(true)}
            onTryDemo={handleTryDemo}
          />
        )}

        {/* VIEW 2: CEMETERY DASHBOARD OR COMPARISON */}
        {view === 'cemetery' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
            
            {/* Header & Quick Summary Bar */}
            <div className="cemetery-glass p-6 rounded-2xl border border-purple-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black uppercase font-mono tracking-tight text-slate-100 flex items-center gap-2">
                  🪦 THE CEMETERY DASHBOARD
                </h1>
                <p className="text-xs text-purple-300 font-mono mt-1">
                  Click any grave card to perform an AI autopsy or select projects for Frankenstein fusion.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setUploadOpen(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-slate-950" />
                  + BURY A PROJECT
                </button>

                <button
                  onClick={() => setFrankensteinOpen(true)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                    selectedForFrankenstein.length >= 2
                      ? 'bg-purple-600 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-pulse'
                      : 'bg-slate-900 text-purple-300 border-purple-900/40 hover:bg-purple-950/40'
                  }`}
                >
                  <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  Frankenstein ({selectedForFrankenstein.length})
                </button>
              </div>
            </div>

            {/* TAB CONTENT: CEMETERY GRAVES OR COMPARISON */}
            {currentTab === 'cemetery' ? (
              loading ? (
                <div className="py-20 text-center text-purple-300 font-mono flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  <span>Loading buried projects from cemetery database...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {projects.map((proj) => (
                    <GraveCard 
                      key={proj.id}
                      project={proj}
                      onSelect={handleSelectProject}
                      isFrankensteinSelected={selectedForFrankenstein.includes(proj.id)}
                      onToggleFrankenstein={handleToggleFrankenstein}
                    />
                  ))}
                </div>
              )
            ) : (
              <ComparisonTable 
                projects={projects}
                onSelectProject={handleSelectProject}
              />
            )}

          </div>
        )}

        {/* VIEW 3: AUTOPSY VIEW */}
        {view === 'autopsy' && (
          loadingDetails ? (
            <div className="py-32 text-center text-purple-300 font-mono flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
              <span className="text-sm font-bold uppercase tracking-wider">
                Exhuming project repository & loading forensic autopsy data...
              </span>
            </div>
          ) : selectedProjectData ? (
            <AutopsyView 
              projectData={selectedProjectData}
              onBack={() => setView('cemetery')}
              onOpenResurrection={() => {}}
            />
          ) : null
        )}

      </main>

      {/* MODALS */}
      <UploadModal 
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />

      <FrankensteinModal 
        isOpen={frankensteinOpen}
        onClose={() => setFrankensteinOpen(false)}
        projects={projects}
        selectedIds={selectedForFrankenstein}
        onToggleSelect={handleToggleFrankenstein}
      />

      <HowItWorksModal 
        isOpen={howItWorksOpen}
        onClose={() => setHowItWorksOpen(false)}
      />

    </div>
  );
}
