import React from 'react';
import { Cpu, Bell, User, Music } from 'lucide-react';

interface TopNavBarProps {
  currentView: string;
  setView: (view: string) => void;
  onGenerateQuick: () => void;
}

export default function TopNavBar({ currentView, setView, onGenerateQuick }: TopNavBarProps) {
  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-10 h-16 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-8">
        <div 
          onClick={() => setView('dashboard')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded bg-primary-container flex items-center justify-center border border-primary/20">
            <Music className="w-4 h-4 text-on-primary-container group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-display text-2xl font-bold text-primary tracking-tighter hover:opacity-90">
            AuraSynth AI
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <button 
            type="button"
            onClick={() => setView('dashboard')}
            className={`font-sans text-sm font-medium transition-all cursor-pointer pb-1 border-b-2 ${
              currentView === 'dashboard' 
                ? 'text-primary border-primary' 
                : 'text-on-surface-variant hover:text-primary border-transparent'
            }`}
          >
            Models
          </button>
          <button 
            type="button"
            onClick={() => setView('preprocessing')}
            className={`font-sans text-sm font-medium transition-all cursor-pointer pb-1 border-b-2 ${
              currentView === 'preprocessing' 
                ? 'text-primary border-primary' 
                : 'text-on-surface-variant hover:text-primary border-transparent'
            }`}
          >
            Datasets
          </button>
          <button 
            type="button"
            onClick={() => setView('training')}
            className={`font-sans text-sm font-medium transition-all cursor-pointer pb-1 border-b-2 ${
              currentView === 'training' 
                ? 'text-primary border-primary' 
                : 'text-on-surface-variant hover:text-primary border-transparent'
            }`}
          >
            Training
          </button>
          <button 
            type="button"
            onClick={() => setView('composition')}
            className={`font-sans text-sm font-medium transition-all cursor-pointer pb-1 border-b-2 ${
              currentView === 'composition' 
                ? 'text-primary border-primary' 
                : 'text-on-surface-variant hover:text-primary border-transparent'
            }`}
          >
            Studio
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onGenerateQuick}
          className="hidden md:flex items-center bg-primary-container text-on-primary-container px-5 py-1.5 rounded-full font-mono text-xs font-bold hover:opacity-95 transition-all active:scale-95 glow-primary"
        >
          Generate Music
        </button>

        <div className="flex items-center gap-2 border-l border-white/10 pl-4">
          <button 
            title="System Diagnostics"
            className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all cursor-pointer active:scale-95"
          >
            <Cpu className="w-4 h-4" />
          </button>
          <button 
            title="Notifications"
            className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all cursor-pointer active:scale-95 relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-error animate-pulse"></span>
          </button>
          <button 
            title="User Profile"
            className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-white/5 transition-all cursor-pointer active:scale-95"
          >
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
