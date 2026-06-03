import React from 'react';
import { 
  Sliders, 
  Cpu, 
  Volume2, 
  Database, 
  Save, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface SettingsViewProps {
  projectName: string;
  setProjectName: (name: string) => void;
  projectVersion: string;
  setProjectVersion: (version: string) => void;
  addActivityLog: (message: string, category: 'Training' | 'Export' | 'System', color: 'primary' | 'secondary' | 'tertiary' | 'neutral') => void;
}

export default function SettingsView({
  projectName,
  setProjectName,
  projectVersion,
  setProjectVersion,
  addActivityLog
}: SettingsViewProps) {
  
  const handleSaveSettings = () => {
    addActivityLog(`Saved custom system metadata for Project: ${projectName}`, 'System', 'primary');
    alert("System recalibrations updated successfully! The model dashboard has refreshed.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-display font-semibold text-3xl text-primary tracking-tight mb-2">
          System Settings
        </h1>
        <p className="text-on-surface-variant font-sans text-sm">
          Calibrate system nodes, hardware accelerators, and file ingestion parameters.
        </p>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-lg border border-white/5 space-y-8">
        {/* Project Metadata Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-primary">
            <Sliders className="w-4 h-4" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider">PROJECT METADATA</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-on-surface-variant uppercase block">PROJECT NAME</label>
              <input 
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full bg-[#201f21] border border-white/10 rounded text-xs py-2 px-3 font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-on-surface-variant uppercase block">RELEASE CHANNEL</label>
              <input 
                type="text"
                value={projectVersion}
                onChange={(e) => setProjectVersion(e.target.value)}
                className="w-full bg-[#201f21] border border-white/10 rounded text-xs py-2 px-3 font-mono text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* Hardware Ingestion Accelerator */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-secondary">
            <Cpu className="w-4 h-4" />
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider">HARDWARE ACCELERATION</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 bg-white/[0.02] hover:bg-white/[0.04] rounded border border-white/5">
              <div>
                <h4 className="font-sans font-semibold text-xs text-on-surface">CUDA Core Mapping</h4>
                <p className="font-sans text-[10px] text-on-surface-variant mt-0.5">Use RTX 4095 matrix cores to accelerate MIDI vector operations</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded accent-secondary h-4 w-4 bg-surface-container" />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-white/[0.02] hover:bg-white/[0.04] rounded border border-white/5">
              <div>
                <h4 className="font-sans font-semibold text-xs text-on-surface">Tensor Cache Allocation</h4>
                <p className="font-sans text-[10px] text-on-surface-variant mt-0.5">Allocate 2.4 GB local RAM layer for pre-synthesized chord predictions</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded accent-secondary h-4 w-4 bg-surface-container" />
            </div>
          </div>
        </section>

        {/* Action Items Footer */}
        <div className="pt-4 flex gap-3 justify-end">
          <button 
            onClick={() => {
              setProjectName("Project Alpha");
              setProjectVersion("v2.4.0-stable");
            }}
            className="px-4 py-2 bg-white/5 rounded font-mono text-[10px] tracking-wider uppercase font-semibold text-on-surface-variant hover:bg-white/10 border border-white/5 transition-all text-center cursor-pointer"
          >
            Reset system Config
          </button>
          
          <button 
            onClick={handleSaveSettings}
            className="px-5 py-2 bg-primary text-background font-mono text-xs font-bold uppercase tracking-wider rounded flex items-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-md"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Calibrations</span>
          </button>
        </div>
      </div>
    </div>
  );
}
