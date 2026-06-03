import React, { useState } from 'react';
import { Sparkles, Menu, X } from 'lucide-react';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
import DashboardView from './components/DashboardView';
import PreprocessingView from './components/PreprocessingView';
import TrainingView from './components/TrainingView';
import CompositionView from './components/CompositionView';
import SettingsView from './components/SettingsView';
import { 
  ModelCard, 
  PreprocessingConfig, 
  TrainConfig, 
  MidiNote, 
  ActivityFeedItem 
} from './types';
import { playPitch } from './utils/audio';

export default function App() {
  const [view, setView] = useState<string>('dashboard');
  const [projectName, setProjectName] = useState<string>("Project Alpha");
  const [projectVersion, setProjectVersion] = useState<string>("v2.4.0-stable");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Initial Generative model nodes state
  const [models, setModels] = useState<ModelCard[]>([
    { 
      id: 'lstm-polyphony', 
      name: 'LSTM-Polyphony-v4', 
      architecture: 'Long Short-Term Memory', 
      status: 'TRAINING', 
      epoch: '482/1000', 
      loss: '0.042', 
      progress: 48, 
      type: 'lstm' 
    },
    { 
      id: 'wavegan-ambient', 
      name: 'WaveGAN-Ambient', 
      architecture: 'Generative Adversarial', 
      status: 'IDLE', 
      samples: '1.2M', 
      type: 'gan' 
    },
    { 
      id: 'gpt-compose', 
      name: 'GPT-Compose-Neo', 
      architecture: 'Attention/Transformer', 
      status: 'COMPLETE', 
      parameters: '175M', 
      accuracy: '98.4%', 
      type: 'transformer' 
    }
  ]);

  // Sequencer MIDI matrix active notes state
  const [notes, setNotes] = useState<MidiNote[]>([
    { id: 'initial-1', pitch: 'E4', startStep: 1, duration: 4, colorType: 'primary' },
    { id: 'initial-2', pitch: 'G4', startStep: 5, duration: 2, colorType: 'secondary' },
    { id: 'initial-3', pitch: 'B4', startStep: 8, duration: 6, colorType: 'tertiary' },
    { id: 'initial-4', pitch: 'E4', startStep: 15, duration: 2, colorType: 'primary' },
    { id: 'initial-5', pitch: 'G4', startStep: 18, duration: 3, colorType: 'secondary' }
  ]);

  // Initial Preprocessing pipeline options state
  const [preprocessingConfig, setPreprocessingConfig] = useState<PreprocessingConfig>({
    quantizationUnit: '16th Note',
    keyNormalization: true,
    velocityBins: 8
  });

  // Initial Hyperparameters training state
  const [trainConfig, setTrainConfig] = useState<TrainConfig>({
    learningRate: 0.00032,
    batchSize: 128,
    epochs: 1000,
    sequenceLength: 512
  });

  // Initial activity feed / experiment audit logs
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>([
    { 
      id: 'item-1', 
      timestamp: "14:22", 
      category: "Epoch", 
      message: "LSTM Model plateaued at 0.04 loss. Adjusting learning rate to 1e-4.", 
      color: "primary" 
    },
    { 
      id: 'item-2', 
      timestamp: "11:05", 
      category: "Export", 
      message: "WaveGAN rendered 'Ambient_Mist_02.wav'. Spectral audit complete.", 
      color: "secondary" 
    },
    { 
      id: 'item-3', 
      timestamp: "Yesterday", 
      category: "Training", 
      message: "GPT-Compose successfully integrated Classical Dataset (Bach partition).", 
      color: "tertiary" 
    },
    { 
      id: 'item-4', 
      timestamp: "Oct 24", 
      category: "System", 
      message: "New MIDI driver installed. Latency reduced to 2.4ms.", 
      color: "neutral" 
    }
  ]);

  // State append method for diagnostic logs
  const addActivityLog = (
    message: string, 
    category: ActivityFeedItem['category'], 
    color: ActivityFeedItem['color']
  ) => {
    const now = new Date();
    const timestampStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const newLogItem: ActivityFeedItem = {
      id: `log-item-${Date.now()}`,
      timestamp: timestampStr,
      category,
      message,
      color
    };
    setActivityFeed(prev => [newLogItem, ...prev]);
  };

  // Quick Action: Topbar click triggers synthesised seed and moves to composition roll page
  const handleGenerateMusicQuick = () => {
    setView('composition');
    playPitch('G4', 0.15, 'sine');
    setTimeout(() => playPitch('B4', 0.15, 'sine'), 100);
    setTimeout(() => playPitch('E5', 0.25, 'sine'), 200);

    // Prompt user with positive toast
    addActivityLog("Generated deep synthesised variations sequence inside MIDI workspace", 'System', 'tertiary');
  };

  const handleNewExperiment = () => {
    // Triggers scale sound check and resets parameters
    playPitch('C4', 0.1, 'sine');
    setTimeout(() => playPitch('E4', 0.1, 'sine'), 80);
    setTimeout(() => playPitch('G4', 0.1, 'sine'), 160);
    setTimeout(() => playPitch('C5', 0.25, 'sine'), 240);

    setView('dashboard');
    addActivityLog("Created a brand new audio experiment segment inside Neural Architect", 'System', 'primary');
    alert("New neural audio synthesis session initiated! Adjust parameters inside Neural Architect.");
  };

  return (
    <div className="min-h-screen bg-[#050505] text-on-surface select-none font-sans overflow-x-hidden pb-16 lg:pb-0">
      
      {/* Top Navigation Bar Component */}
      <TopNavBar 
        currentView={view} 
        setView={setView} 
        onGenerateQuick={handleGenerateMusicQuick} 
      />

      <div className="flex pt-16">
        
        {/* Left Drawer Side Navigation (Desktop only, hidden on mobile in Tailwind CSS) */}
        <div className="hidden lg:block shrink-0">
          <SideNavBar 
            currentView={view} 
            setView={setView} 
            onNewExperiment={handleNewExperiment}
            projectName={projectName}
            projectVersion={projectVersion}
          />
        </div>

        {/* Dynamic Canvas Container Swapper */}
        <main className="flex-1 min-h-[calc(100vh-64px)] overflow-y-auto lg:ml-64 p-6 md:p-10 transition-all duration-300">
          <div className="fade-in">
            {view === 'dashboard' && (
              <DashboardView 
                models={models} 
                setModels={setModels} 
                activityFeed={activityFeed} 
                addActivityLog={addActivityLog}
                setView={setView}
              />
            )}

            {view === 'preprocessing' && (
              <PreprocessingView 
                config={preprocessingConfig} 
                setConfig={setPreprocessingConfig}
                addActivityLog={addActivityLog}
              />
            )}

            {view === 'training' && (
              <TrainingView 
                config={trainConfig} 
                setConfig={setTrainConfig}
                addActivityLog={addActivityLog}
              />
            )}

            {view === 'composition' && (
              <CompositionView 
                notes={notes} 
                setNotes={setNotes}
                addActivityLog={addActivityLog}
              />
            )}

            {view === 'settings' && (
              <SettingsView 
                projectName={projectName}
                setProjectName={setProjectName}
                projectVersion={projectVersion}
                setProjectVersion={setProjectVersion}
                addActivityLog={addActivityLog}
              />
            )}
          </div>
        </main>
      </div>

      {/* Floating Dynamic Bottom Bar Mobile Navigation Shell */}
      <nav className="lg:hidden fixed bottom-5 left-1/2 -translate-x-1/2 w-[90%] h-14 bg-[#0e0e10]/90 border border-white/10 backdrop-blur-xl flex justify-around items-center rounded-2xl shadow-xl z-50">
        <button 
          onClick={() => setView('dashboard')} 
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono tracking-wider transition-colors ${
            view === 'dashboard' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span>Dash</span>
        </button>
        <button 
          onClick={() => setView('preprocessing')} 
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono tracking-wider transition-colors ${
            view === 'preprocessing' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span>Data</span>
        </button>
        <div 
          onClick={handleNewExperiment}
          className="bg-primary hover:brightness-110 p-3.5 rounded-full -mt-8 shadow-lg cursor-pointer transform hover:scale-105 transition-all"
        >
          <Sparkles className="w-4.5 h-4.5 text-background" />
        </div>
        <button 
          onClick={() => setView('training')} 
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono tracking-wider transition-colors ${
            view === 'training' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span>Train</span>
        </button>
        <button 
          onClick={() => setView('composition')} 
          className={`flex flex-col items-center gap-0.5 text-[10px] font-mono tracking-wider transition-colors ${
            view === 'composition' ? 'text-primary' : 'text-on-surface-variant'
          }`}
        >
          <span>Studio</span>
        </button>
      </nav>
    </div>
  );
}
