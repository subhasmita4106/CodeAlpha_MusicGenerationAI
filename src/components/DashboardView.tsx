import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Activity, 
  CheckCircle, 
  Plus, 
  ChevronRight, 
  Music, 
  Radio, 
  Cpu, 
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';
import { ModelCard, ActivityFeedItem } from '../types';
import { playPitch } from '../utils/audio';

interface DashboardViewProps {
  models: ModelCard[];
  setModels: React.Dispatch<React.SetStateAction<ModelCard[]>>;
  activityFeed: ActivityFeedItem[];
  addActivityLog: (message: string, category: ActivityFeedItem['category'], color: ActivityFeedItem['color']) => void;
  setView: (view: string) => void;
}

export default function DashboardView({ 
  models, 
  setModels, 
  activityFeed, 
  addActivityLog,
  setView 
}: DashboardViewProps) {
  
  const [selectedModelId, setSelectedModelId] = useState<string>('lstm-polyphony');
  const [temperature, setTemperature] = useState<number>(0.85);
  const [contextWindow, setContextWindow] = useState<number>(2048);

  const selectedModel = models.find(m => m.id === selectedModelId) || models[0];

  // MIDI libraries static data
  const libraries = [
    { name: "Classical", description: "Bach, Chopin, Mozart MIDI archives", size: "42.4 GB", count: "12k Files", icon: "classical" },
    { name: "Jazz Fusion", description: "Improvisational bebop structures", size: "15.8 GB", count: "5k Files", icon: "jazz" },
    { name: "Electronic", description: "Synth-pop, Techno, House patterns", size: "88.2 GB", count: "30k Files", icon: "electronic" }
  ];

  // Synth preview playback sequence on RE-SEED click
  const triggerReSeed = () => {
    // Generate lovely synthesized audio riff based on current temperature value
    const basePitches = ['C4', 'E4', 'G4', 'B4', 'C5'];
    const randomPitches = Array.from({ length: 6 }, () => {
      const idx = Math.floor(Math.random() * basePitches.length);
      return basePitches[idx];
    });

    addActivityLog(`Re-seeded ${selectedModel.name} node with scale factor ${temperature}. Generative sequence updated.`, 'System', 'primary');
    
    // Play notes staggered
    randomPitches.forEach((pitch, i) => {
      setTimeout(() => {
        // Use different oscillator types for different models!
        const oscType = selectedModel.type === 'lstm' ? 'triangle' as OscillatorType : 
                        selectedModel.type === 'gan' ? 'sine' as OscillatorType : 'sawtooth' as OscillatorType;
        playPitch(pitch, 0.25, oscType);
      }, i * 160);
    });

    // Randomize loss slightly during re-seed to simulate model improvement
    setModels(prev => prev.map(m => {
      if (m.id === selectedModelId && m.status === 'TRAINING') {
        const nextLoss = Math.max(0.015, (parseFloat(m.loss || '0.042') - 0.003 * Math.random())).toFixed(4);
        return { ...m, loss: nextLoss };
      }
      return m;
    }));
  };

  const handlePauseToggle = (modelId: string) => {
    setModels(prev => prev.map(m => {
      if (m.id === modelId) {
        const nextStatus = m.status === 'TRAINING' ? 'IDLE' : 'TRAINING';
        addActivityLog(`Toggled state of ${m.name} to ${nextStatus}`, 'System', nextStatus === 'TRAINING' ? 'primary' : 'neutral');
        return { ...m, status: nextStatus };
      }
      return m;
    }));
  };

  const handleInitializeModel = () => {
    const defaultModels = [
      { id: 'custom-diffusion-1', name: 'Diffusion-Symphony', architecture: 'Latent Audio Diffusion', status: 'TRAINING' as const, epoch: '1/500', loss: '0.825', samples: '150k', parameters: '450M', accuracy: '84.2%', progress: 2, type: 'gan' as const },
      { id: 'custom-rnn-2', name: 'Ambient-Flow-RNN', architecture: 'Recurrent Neural Network', status: 'IDLE' as const, samples: '40k', parameters: '12M', type: 'lstm' as const },
      { id: 'custom-transformer-3', name: 'Choral-Transformer', architecture: 'Sparse Attention Generative', status: 'COMPLETE' as const, parameters: '2.1B', accuracy: '99.1%', type: 'transformer' as const }
    ];

    // Pick one not already added or generate random
    const count = models.length - 3;
    const modelToPick = defaultModels[count % defaultModels.length];
    const uniqueId = `${modelToPick.id}-${Math.floor(Math.random() * 100)}`;
    const newModel: ModelCard = {
      ...modelToPick,
      id: uniqueId,
      name: `${modelToPick.name} ${String.fromCharCode(65 + count)}`
    };

    setModels(prev => [...prev, newModel]);
    setSelectedModelId(uniqueId);
    addActivityLog(`Initialized new generative audio node: ${newModel.name}`, 'System', 'tertiary');
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Title & Status Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-primary tracking-tight mb-2">
            Neural Architect
          </h1>
          <p className="text-on-surface-variant font-sans max-w-2xl text-sm leading-relaxed">
            Manage your generative models and synthetic soundscapes. Monitor real-time training epochs and dataset affinity.
          </p>
        </div>
        <div>
          <div className="glass-panel px-4 py-2.5 flex items-center gap-3 rounded-lg border border-white/5 active-glow-primary">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed animate-pulse"></span>
            <span className="font-mono text-xs font-semibold text-on-surface tracking-wider">GPU-01: ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Models and Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Generative Nodes & Library Exploration (8 Columns) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {models.map((model) => {
              const isSelected = selectedModelId === model.id;
              return (
                <div 
                  key={model.id}
                  onClick={() => setSelectedModelId(model.id)}
                  className={`glass-panel p-6 rounded-lg group transition-all duration-300 relative overflow-hidden cursor-pointer border ${
                    isSelected 
                      ? 'border-primary shadow-[0_0_20px_rgba(0,219,233,0.1)] bg-white/[0.03]' 
                      : 'border-white/5 hover:border-primary/45'
                  }`}
                >
                  <div className="absolute top-4 right-4">
                    <span className={`font-mono text-[9px] font-bold px-2.5 py-0.5 rounded-full border tracking-widest ${
                      model.status === 'TRAINING' 
                        ? 'bg-primary/10 text-primary-fixed border-primary/30 animate-pulse' 
                        : model.status === 'COMPLETE' 
                          ? 'bg-tertiary/15 text-tertiary-fixed border-tertiary/30' 
                          : 'bg-white/5 text-on-surface-variant border-white/10'
                    }`}>
                      {model.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 rounded flex items-center justify-center border ${
                      model.type === 'lstm' ? 'bg-primary/10 border-primary/20 text-primary' :
                      model.type === 'gan' ? 'bg-secondary/15 border-secondary/20 text-secondary' :
                                            'bg-tertiary/15 border-tertiary/20 text-tertiary'
                    }`}>
                      {model.type === 'lstm' ? <Activity className="w-5 h-5" /> : 
                       model.type === 'gan' ? <Radio className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-display text-[18px] font-semibold text-on-surface tracking-tight">
                        {model.name}
                      </h3>
                      <p className="font-mono text-[9px] text-on-surface-variant tracking-wider uppercase mt-0.5">
                        {model.architecture}
                      </p>
                    </div>
                  </div>

                  {/* Audio Waveform visualization block */}
                  <div className="waveform-bg h-20 rounded bg-black/45 border border-white/5 mb-4 relative overflow-hidden flex items-end justify-center px-4 gap-[2px]">
                    {model.status === 'TRAINING' ? (
                      Array.from({ length: 22 }).map((_, idx) => {
                        // Generates a dancing voice scale block
                        const heightPercent = 25 + Math.sin(idx * 0.4 + Date.now() * 0.005) * 60;
                        return (
                          <div 
                            key={idx} 
                            style={{ height: `${Math.max(10, Math.min(95, heightPercent))}%` }}
                            className="flex-1 bg-primary rounded-t transition-all duration-300 pointer-events-none"
                          />
                        );
                      })
                    ) : model.status === 'COMPLETE' ? (
                      <div className="absolute inset-0 flex items-center justify-center gap-2 text-tertiary/50">
                        <CheckCircle className="w-4 h-4 text-tertiary" />
                        <span className="font-mono text-xs font-semibold uppercase tracking-wider">Inference Ready</span>
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-center gap-[1px] opacity-40 group-hover:opacity-75 transition-opacity h-full">
                        {/* Static stylized wave peaks */}
                        {[20, 30, 45, 60, 40, 20, 15, 30, 50, 70, 85, 90, 60, 45, 20, 30, 50, 60, 40, 25, 10, 15].map((h, i) => (
                          <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-secondary rounded-t" />
                        ))}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Metadata Stats Footer */}
                  <div className="flex justify-between items-center font-mono text-[10px] text-on-surface-variant">
                    {model.status === 'TRAINING' ? (
                      <>
                        <span>Epoch {model.epoch || '482/1000'}</span>
                        <span className="text-primary font-bold">Loss: {model.loss || '0.042'}</span>
                      </>
                    ) : model.status === 'COMPLETE' ? (
                      <>
                        <span>Params: {model.parameters || '175M'}</span>
                        <span className="text-tertiary font-bold">Accuracy: {model.accuracy || '98.4%'}</span>
                      </>
                    ) : (
                      <>
                        <span>Samples: {model.samples || '1.2M'}</span>
                        <span className="text-secondary font-bold">State: IDLE</span>
                      </>
                    )}
                  </div>

                  {/* Horizontal progress bar for training */}
                  {model.status === 'TRAINING' && (
                    <div className="mt-3 w-full bg-white/5 h-1 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full animate-pulse active-glow-primary" style={{ width: `${model.progress || 48}%` }}></div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Initialize New Model Button */}
            <div 
              onClick={handleInitializeModel}
              className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center gap-4 group hover:border-primary/45 cursor-pointer transition-all duration-300 min-h-[220px]"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-105 transition-all">
                <Plus className="w-7 h-7 text-on-surface-variant group-hover:text-primary transition-colors" />
              </div>
              <span className="font-display font-medium text-lg text-on-surface-variant group-hover:text-primary transition-colors">
                Initialize New Model
              </span>
            </div>
          </div>

          {/* MIDI Dataset Explorer */}
          <div className="glass-panel p-6 md:p-8 rounded-lg border border-white/5">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-semibold text-on-surface">
                  MIDI Dataset Libraries
                </h2>
              </div>
              <button 
                onClick={() => setView('preprocessing')}
                className="font-mono text-[10px] text-primary hover:underline hover:opacity-85 uppercase tracking-wider font-semibold flex items-center gap-1"
              >
                <span>Manage All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {libraries.map((lib, i) => (
                <div 
                  key={i}
                  className="p-4 bg-surface-container-low rounded border border-white/5 hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                  onClick={() => setView('preprocessing')}
                >
                  <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                    <Music className={`w-4 h-4 ${i === 0 ? 'text-primary' : i === 1 ? 'text-secondary' : 'text-tertiary'}`} />
                  </div>
                  <h4 className="font-sans font-semibold text-sm text-on-surface group-hover:text-primary transition-colors mb-1">
                    {lib.name}
                  </h4>
                  <p className="font-mono text-[10px] text-on-surface-variant leading-relaxed">
                    {lib.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-[9px] font-mono text-on-surface-variant/75">
                    <span>{lib.size}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span>{lib.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Log Feed & Param Adjusters (4 Columns) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Recent Experiments Activity Log */}
          <div className="glass-panel p-6 flex flex-col h-[350px] rounded-lg border border-white/5">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-4 h-4 text-primary" />
              <h2 className="font-display text-base font-semibold text-on-surface">
                Recent Experiments
              </h2>
            </div>

            {/* Scrollable Feed */}
            <div className="flex-1 space-y-4 overflow-y-auto custom-scrollbar pr-1">
              {activityFeed.map((item) => (
                <div key={item.id} className="relative pl-5 border-l border-white/10 pb-2">
                  <span className={`absolute left-[-4.5px] top-1.5 w-2 h-2 rounded-full ring-4 ring-background ${
                    item.color === 'primary' ? 'bg-primary' :
                    item.color === 'secondary' ? 'bg-secondary' :
                    item.color === 'tertiary' ? 'bg-tertiary' : 'bg-on-surface-variant'
                  }`} />
                  <p className="font-mono text-[9px] text-on-surface-variant/80 mb-0.5">
                    {item.timestamp} — <span className="uppercase tracking-wider font-semibold">{item.category}</span>
                  </p>
                  <p className="font-sans text-xs text-on-surface leading-tight">
                    {item.message}
                  </p>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setView('training')}
              className="w-full mt-4 py-2 bg-white/5 rounded font-mono text-[10px] tracking-wider uppercase font-semibold text-on-surface-variant hover:bg-white/10 border border-white/5 transition-all text-center"
            >
              View Full History
            </button>
          </div>

          {/* Contextual Quick Param Adjuster */}
          <div className="glass-panel p-6 bg-primary/5 border border-primary/10 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-mono text-[10px] font-bold text-primary tracking-widest uppercase">
                Node Params: {selectedModel.name}
              </h3>
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">Temperature</span>
                  <span className="font-mono text-xs text-primary font-bold">{temperature.toFixed(2)}</span>
                </div>
                <input 
                  type="range"
                  min="0.1"
                  max="1.5"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <p className="font-sans text-[9px] text-on-surface-variant/75 mt-1 leading-normal">
                  Higher temperature values trigger high creativity and randomness. Lower values favor structured accuracy.
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-mono text-[10px] text-on-surface-variant uppercase">Context Window</span>
                  <span className="font-mono text-xs text-primary font-bold">{contextWindow} ms</span>
                </div>
                <input 
                  type="range"
                  min="512"
                  max="4096"
                  step="256"
                  value={contextWindow}
                  onChange={(e) => setContextWindow(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Param Controls Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => handlePauseToggle(selectedModel.id)}
                  className="flex-1 bg-surface-container-high hover:bg-white/10 py-2.5 rounded font-mono text-[10px] font-semibold uppercase tracking-wider text-on-surface transition-all active:scale-95 border border-white/5"
                >
                  {selectedModel.status === 'TRAINING' ? 'PAUSE NODE' : 'START NODE'}
                </button>
                <button 
                  onClick={triggerReSeed}
                  className="flex-1 bg-primary text-background hover:brightness-110 py-2.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider transition-all active:scale-95 text-center"
                >
                  RE-SEED SCALE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
