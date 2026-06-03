import React from 'react';
import { 
  LayoutDashboard, 
  Binary, 
  Cpu, 
  Piano, 
  Settings, 
  Plus, 
  HelpCircle, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface SideNavBarProps {
  currentView: string;
  setView: (view: string) => void;
  onNewExperiment: () => void;
  projectVersion?: string;
  projectName?: string;
}

export default function SideNavBar({ 
  currentView, 
  setView, 
  onNewExperiment,
  projectName = "Project Alpha",
  projectVersion = "v2.4.0-stable"
}: SideNavBarProps) {
  
  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'preprocessing', name: 'Preprocessing', icon: Binary },
    { id: 'training', name: 'Training', icon: Cpu },
    { id: 'composition', name: 'Composition', icon: Piano },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] z-40 flex flex-col py-6 bg-surface-container-lowest/85 backdrop-blur-2xl border-r border-white/5 w-64 shadow-2xl transition-all duration-300">
      {/* Project Status Info */}
      <div className="px-6 mb-8 group">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-xl font-semibold text-on-surface tracking-tight group-hover:text-primary transition-colors">
            {projectName}
          </h2>
          <Sparkles className="w-3.5 h-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <p className="font-mono text-[10px] text-on-surface-variant/70 tracking-widest uppercase mt-0.5">
          {projectVersion}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3.5 px-6 py-3 font-mono text-xs tracking-wider transition-all cursor-pointer border-r-4 ${
                isActive 
                  ? 'bg-primary/10 text-primary border-primary font-bold' 
                  : 'text-on-surface-variant hover:bg-white/5 hover:text-on-surface border-transparent'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Interactive Action and Support */}
      <div className="px-4 mt-auto space-y-5">
        <button 
          onClick={onNewExperiment}
          className="w-full flex items-center justify-center gap-2 bg-primary text-background font-mono font-medium text-xs py-3 rounded hover:brightness-110 active:scale-95 transition-all outline-none"
        >
          <Plus className="w-4 h-4" />
          <span>New Experiment</span>
        </button>

        <div className="pt-4 border-t border-white/5 space-y-1">
          <button 
            type="button"
            onClick={() => setView('settings')}
            className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-primary transition-all font-mono text-xs cursor-pointer text-left"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Docs</span>
          </button>
          <button 
            type="button"
            className="w-full flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-primary transition-all font-mono text-xs cursor-pointer text-left"
            onClick={() => {
              alert("Support Center: Reach out at support@aurasynth.ai or browse our Neural synthesis manuals!");
            }}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Support</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
