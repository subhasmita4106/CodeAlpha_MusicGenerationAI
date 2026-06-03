import React, { useState } from 'react';
import { 
  Folder, 
  FolderPlus, 
  Music, 
  Trash2, 
  Sliders, 
  Play, 
  Check, 
  Copy, 
  Download, 
  Sparkles, 
  Maximize2, 
  TrendingUp, 
  RotateCcw,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { PreprocessingConfig } from '../types';
import { playPitch } from '../utils/audio';

interface PreprocessingViewProps {
  config: PreprocessingConfig;
  setConfig: React.Dispatch<React.SetStateAction<PreprocessingConfig>>;
  addActivityLog: (message: string, category: 'Training' | 'Export' | 'System', color: 'primary' | 'secondary' | 'tertiary' | 'neutral') => void;
}

export default function PreprocessingView({ 
  config, 
  setConfig, 
  addActivityLog 
}: PreprocessingViewProps) {
  
  const [activeMidiFile, setActiveMidiFile] = useState<string>('bwv_259.mid');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processedSuccess, setProcessedSuccess] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  
  // JSON Sequence state
  const [sequenceData, setSequenceData] = useState({
    header: { bpm: 120, time_signature: "4/4", key: "E-Minor", pipeline: "music21" },
    sequence: [
      { pitch: 64, note: "E4", step: 0.0, duration: 0.5, velocity: 85 },
      { pitch: 67, note: "G4", step: 0.5, duration: 0.5, velocity: 70 },
      { pitch: 71, note: "B4", step: 1.0, duration: 1.0, velocity: 90 },
      { pitch: 64, note: "E4", step: 2.0, duration: 0.5, velocity: 85 },
      { pitch: 60, note: "C4", step: 2.5, duration: 0.25, velocity: 40 },
      { pitch: 59, note: "B3", step: 2.75, duration: 0.25, velocity: 35 },
      { pitch: 62, note: "D4", step: 3.0, duration: 1.0, velocity: 75 }
    ]
  });

  // Pitch Distribution bars data
  const pitches = [
    { label: 'C', freq: 20, pitchName: 'C4', key: 'C' },
    { label: 'C#', freq: 15, pitchName: 'C#4', key: 'C#' },
    { label: 'D', freq: 40, pitchName: 'D4', key: 'D' },
    { label: 'D#', freq: 10, pitchName: 'D#4', key: 'D#' },
    { label: 'E', freq: 85, pitchName: 'E4', key: 'E', highlight: true },
    { label: 'F', freq: 60, pitchName: 'F4', key: 'F' },
    { label: 'F#', freq: 30, pitchName: 'F#4', key: 'F#' },
    { label: 'G', freq: 45, pitchName: 'G4', key: 'G' },
    { label: 'G#', freq: 12, pitchName: 'G#4', key: 'G#' },
    { label: 'A', freq: 70, pitchName: 'A4', key: 'A' },
    { label: 'A#', freq: 5, pitchName: 'A#4', key: 'A#' },
    { label: 'B', freq: 25, pitchName: 'B4', key: 'B' }
  ];

  // Right sidebar params
  const [pitchShiftRange, setPitchShiftRange] = useState<number>(2);
  const [timeStretch, setTimeStretch] = useState<number>(1.0);
  const [removeMonophonic, setRemoveMonophonic] = useState<boolean>(false);
  const [mergeOverlapping, setMergeOverlapping] = useState<boolean>(true);

  // File explorer folders & files
  const folders = [
    { name: 'bach_chorales/', isFolder: true, color: 'text-secondary' },
    { name: 'bwv_259.mid', isFolder: false, active: activeMidiFile === 'bwv_259.mid' },
    { name: 'bwv_260.mid', isFolder: false, active: activeMidiFile === 'bwv_260.mid' },
    { name: 'jazz_standards/', isFolder: true, color: 'text-secondary' },
    { name: 'pop_hooks_2023/', isFolder: true, color: 'text-secondary' }
  ];

  const handleMidiSelect = (fileName: string) => {
    setActiveMidiFile(fileName);
    addActivityLog(`Loaded MIDI sequence for preprocessing: ${fileName}`, 'System', 'primary');
    
    // Play quick nice sequence cue
    if (fileName === 'bwv_259.mid') {
      playPitch('E4', 0.2, 'sine');
      setTimeout(() => playPitch('G4', 0.2, 'sine'), 100);
      setTimeout(() => playPitch('B4', 0.3, 'sine'), 220);
      
      setSequenceData(prev => ({
        ...prev,
        header: { ...prev.header, key: "E-Minor" }
      }));
    } else {
      playPitch('G4', 0.2, 'sine');
      setTimeout(() => playPitch('A3', 0.2, 'sine'), 100);
      setTimeout(() => playPitch('C4', 0.3, 'sine'), 220);
      
      setSequenceData(prev => ({
        ...prev,
        header: { ...prev.header, key: "A-Minor" }
      }));
    }
  };

  const handleRunPreprocessing = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setProcessedSuccess(false);
    playPitch('A3', 0.15, 'sine');
    setTimeout(() => playPitch('C4', 0.15, 'sine'), 100);
    setTimeout(() => playPitch('E4', 0.2, 'sine'), 200);

    setTimeout(() => {
      setIsProcessing(false);
      setProcessedSuccess(true);
      playPitch('C5', 0.4, 'triangle');
      addActivityLog(`Successfully parsed MIDI file '${activeMidiFile}' through music21 pipeline. Quantized to ${config.quantizationUnit}.`, 'System', 'tertiary');
      
      setTimeout(() => {
        setProcessedSuccess(false);
      }, 3000);
    }, 2000);
  };

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(sequenceData, null, 2));
    setCopied(true);
    playPitch('E4', 0.1, 'sine');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col -mx-margin-desktop md:-mx-margin-desktop -mt-margin-desktop bg-background text-on-surface">
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: MIDI File Explorer sidebar */}
        <section className="w-64 border-r border-white/5 bg-surface-container-lowest/40 flex flex-col shrink-0">
          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <span className="font-mono text-[10px] font-bold text-on-surface-variant tracking-widest">MIDI EXPLORER</span>
            <FolderPlus className="w-4 h-4 text-on-surface-variant hover:text-primary cursor-pointer transition-colors" />
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar p-2">
            <ul className="space-y-0.5">
              {folders.map((item, idx) => {
                if (item.isFolder) {
                  return (
                    <li key={idx} className="p-2 flex items-center gap-2 hover:bg-white/[0.03] rounded cursor-pointer group">
                      <Folder className="w-3.5 h-3.5 text-secondary" />
                      <span className="font-mono text-xs tracking-wide text-on-surface-variant">{item.name}</span>
                    </li>
                  );
                } else {
                  return (
                    <li 
                      key={idx} 
                      onClick={() => handleMidiSelect(item.name)}
                      className={`pl-6 p-2 flex items-center justify-between hover:bg-white/[0.04] rounded cursor-pointer group ${
                        item.active ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Music className={`w-3.5 h-3.5 ${item.active ? 'text-primary' : 'text-on-surface-variant'}`} />
                        <span className="font-mono text-xs tracking-wide">{item.name}</span>
                      </div>
                    </li>
                  );
                }
              })}
            </ul>
          </div>

          <div className="p-4 bg-surface-container-low border-t border-white/5 space-y-2 mt-auto">
            <div className="flex justify-between items-end">
              <span className="font-mono text-[9px] text-on-surface-variant tracking-wider">DISK USAGE</span>
              <span className="font-mono text-[10px] text-primary font-bold">42%</span>
            </div>
            <div className="w-full h-1 bg-surface-variant rounded-full overflow-hidden">
              <div className="w-[42%] h-full bg-primary shadow-[0_0_8px_rgba(0,240,255,0.4)]"></div>
            </div>
          </div>
        </section>

        {/* Central Workspace area: Params, Wave and visual piano roll */}
        <section className="flex-grow flex flex-col overflow-hidden bg-background">
          
          {/* Header config toolbar */}
          <header className="p-5 border-b border-white/5 flex justify-between items-center bg-surface-container-lowest/30">
            <div>
              <h1 className="font-display font-semibold text-2xl text-primary tracking-tight">
                Preprocessing Lab
              </h1>
              <p className="font-mono text-[10px] text-on-surface-variant mt-0.5 tracking-wide">
                Configuring pipeline node: <span className="text-secondary font-semibold">music21 pipeline</span>
              </p>
            </div>
            <div>
              <button 
                onClick={handleRunPreprocessing}
                disabled={isProcessing}
                className="px-5 py-2 bg-primary text-background font-mono text-xs font-bold rounded-full neon-glow-primary hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-80"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : processedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-background" />
                    <span>Success</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-background" />
                    <span>Run Preprocessing</span>
                  </>
                )}
              </button>
            </div>
          </header>

          {/* Interactive Bento Content scroll Area */}
          <div className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-6">
            
            {/* Params & Pitch Grid Row */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* Global preprocessor settings parameters */}
              <div className="col-span-12 lg:col-span-4 glass-panel p-5 rounded-lg border border-white/5 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4">
                  <Sliders className="w-4 h-4 text-primary" />
                  <span className="font-mono text-[10px] font-bold text-on-surface uppercase tracking-wider">
                    GLOBAL PARAMETERS
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="font-mono text-[10px] text-on-surface-variant block mb-1">
                      QUANTIZATION UNIT
                    </label>
                    <select 
                      value={config.quantizationUnit}
                      onChange={(e) => {
                        setConfig(prev => ({ ...prev, quantizationUnit: e.target.value }));
                        addActivityLog(`Configured global quantization unit to ${e.target.value}`, 'System', 'primary');
                      }}
                      className="w-full bg-surface-container-high border border-white/5 text-on-surface rounded font-mono text-xs py-2 px-3 focus:outline-none focus:border-primary cursor-pointer"
                    >
                      <option value="16th Note">16th Note</option>
                      <option value="32nd Note">32nd Note</option>
                      <option value="Quarter Note">Quarter Note</option>
                    </select>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] text-on-surface-variant block mb-1.5">
                      KEY NORMALIZATION
                    </span>
                    <label className="flex items-center gap-2.5 cursor-pointer text-xs">
                      <input 
                        type="checkbox"
                        checked={config.keyNormalization}
                        onChange={(e) => {
                          setConfig(prev => ({ ...prev, keyNormalization: e.target.checked }));
                          addActivityLog(`Normalized all keys to standard C-major/A-minor scale`, 'System', 'primary');
                        }}
                        className="rounded border-none accent-primary h-4 w-4 bg-surface-container-high focus:ring-0 cursor-pointer"
                      />
                      <span className="font-mono text-xs text-on-surface/90">Transpose keys (C-Major / A-Minor)</span>
                    </label>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <span className="font-mono text-[10px] text-on-surface-variant uppercase">VELOCITY BINS</span>
                      <span className="font-mono text-xs text-primary font-bold">{config.velocityBins} BINS</span>
                    </div>
                    <input 
                      type="range"
                      min="2"
                      max="32"
                      step="2"
                      value={config.velocityBins}
                      onChange={(e) => setConfig(prev => ({ ...prev, velocityBins: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-1 text-[8px] font-mono text-on-surface-variant/70">
                      <span>2 BINS</span>
                      <span>8 BINS (Active)</span>
                      <span>32 BINS</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pitch Distribution interactive bars plot */}
              <div className="col-span-12 lg:col-span-8 glass-panel p-5 rounded-lg border border-white/5 relative overflow-hidden flex flex-col justify-between">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    <span className="font-mono text-[10px] font-bold text-on-surface uppercase tracking-wider">
                      PITCH DISTRIBUTION
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-on-surface-variant tracking-wider uppercase">
                    SOURCE: {activeMidiFile}
                  </span>
                </div>

                {/* Bars distribution container */}
                <div className="h-40 flex items-end gap-[3px] border-b border-white/5 px-1 relative">
                  {pitches.map((obj, i) => {
                    const isHighFreq = obj.freq > 60;
                    return (
                      <div 
                        key={i}
                        onClick={() => playPitch(obj.pitchName, 0.3, 'sine')}
                        title={`${obj.label}: ${obj.freq} occurrences. Click to preview.`}
                        style={{ height: `${obj.freq}%` }}
                        className={`flex-1 rounded-t-sm transition-all duration-300 cursor-pointer relative group ${
                          isHighFreq 
                            ? 'bg-primary hover:bg-white shadow-[0_0_12px_rgba(0,240,255,0.15)]' 
                            : 'bg-primary/20 hover:bg-primary/50'
                        }`}
                      >
                        {/* Dynamic Tooltip on Hover */}
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 bg-black/90 text-primary border border-primary/20 text-[9px] font-mono py-0.5 px-1.5 rounded pointer-events-none mb-1 shadow-md z-40 transition-opacity whitespace-nowrap">
                          {obj.label}: {obj.freq} files
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between mt-2 font-mono text-[9px] text-on-surface-variant/80 px-1">
                  {pitches.map((b, i) => (
                    <span key={i} className="flex-1 text-center font-semibold">{b.label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sequence JSON Preview & Duration Stats Row */}
            <div className="grid grid-cols-12 gap-6">
              
              {/* Sequence JSON code preview */}
              <div className="col-span-12 lg:col-span-7 glass-panel rounded-lg border border-white/5 flex flex-col h-80 overflow-hidden">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-surface-container-lowest/50">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-on-surface uppercase tracking-wider">
                      SEQUENCE PREVIEW (JSON)
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopyJSON}
                      title="Copy JSON"
                      className="p-1 px-2 hover:bg-white/5 rounded text-on-surface-variant hover:text-primary transition-all flex items-center gap-1 text-[9px] font-mono cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3 h-3 text-tertiary" />
                          <span className="text-tertiary">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => {
                        alert("Exporting JSON configuration file...");
                      }}
                      title="Download JSON"
                      className="p-1.5 hover:bg-white/5 rounded text-on-surface-variant hover:text-primary cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-4 font-mono text-[11px] text-on-surface-variant/90 overflow-y-auto custom-scrollbar bg-black/40">
                  <pre className="whitespace-pre">
                    <code>{JSON.stringify(sequenceData, null, 2)}</code>
                  </pre>
                </div>
              </div>

              {/* Duration Histogram statistics layout */}
              <div className="col-span-12 lg:col-span-5 glass-panel p-5 rounded-lg border border-white/5 flex flex-col justify-between">
                <span className="font-mono text-[10px] font-bold text-on-surface uppercase tracking-wider block mb-4">
                  DURATION HISTOGRAM
                </span>

                <div className="flex-grow flex items-center justify-center py-2">
                  <div className="relative w-36 h-36">
                    {/* SVG ring representation */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="72" cy="72" r="62" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                      <circle cx="72" cy="72" r="62" fill="transparent" stroke="#00f0ff" strokeDasharray="390" strokeDashoffset="97" strokeWidth="10" />
                      <circle cx="72" cy="72" r="46" fill="transparent" stroke="#dcb8ff" strokeDasharray="290" strokeDashoffset="130" strokeWidth="10" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-mono text-xl font-bold text-on-surface">75%</span>
                      <span className="font-mono text-[8px] text-on-surface-variant tracking-wider uppercase font-semibold">STACCATO</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/5 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-mono text-[10px] text-on-surface-variant">LEGATO (25%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    <span className="font-mono text-[10px] text-on-surface-variant">STACCATO (75%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RAW Sequence visualization roll layout */}
            <div className="glass-panel rounded-lg border border-white/5 overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-surface-container-lowest/50">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                  <span className="font-mono text-[10px] font-bold text-on-surface uppercase tracking-wider">
                    RAW SEQUENCE VISUALIZATION
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] text-on-surface-variant/80 uppercase">Pitch shift zoom</span>
                    <input type="range" className="w-16 accent-primary h-1 bg-white/10" defaultValue="45" />
                  </div>
                  <button 
                    onClick={() => {
                      playPitch('E4', 0.2, 'sine');
                      playPitch('G4', 0.2, 'sine');
                      playPitch('B4', 0.3, 'sine');
                    }}
                    title="Restore pattern preview"
                    className="p-1 px-2 bg-white/5 hover:bg-white/10 rounded font-mono text-[9px] text-on-surface-variant/80 tracking-wider flex items-center gap-1 cursor-pointer"
                  >
                    <span>PREVIEW RAW Notes</span>
                  </button>
                </div>
              </div>

              {/* Styled piano grid roll area */}
              <div className="h-64 midi-grid relative p-4 overflow-x-auto custom-scrollbar">
                
                {/* Visual Note blocks */}
                <div 
                  onClick={() => playPitch('E4', 0.45, 'sine')}
                  className="absolute left-24 top-10 h-8 w-32 bg-primary/40 border border-primary rounded-sm flex items-center justify-between px-3 group cursor-pointer hover:bg-primary/60 transition-all z-20"
                >
                  <span className="font-mono text-[10px] font-bold text-primary">E4</span>
                  <div className="absolute inset-0 blur bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>

                <div 
                  onClick={() => playPitch('G4', 0.3, 'sine')}
                  className="absolute left-64 top-24 h-8 w-16 bg-secondary/40 border border-secondary rounded-sm flex items-center justify-between px-3 group cursor-pointer hover:bg-secondary/60 transition-all z-20"
                >
                  <span className="font-mono text-[10px] font-bold text-secondary">G4</span>
                </div>

                <div 
                  onClick={() => playPitch('B4', 0.5, 'sine')}
                  className="absolute left-80 top-36 h-8 w-48 bg-primary/40 border border-primary rounded-sm flex items-center justify-between px-3 group cursor-pointer hover:bg-primary/60 transition-all z-20"
                >
                  <span className="font-mono text-[10px] font-bold text-primary">B4</span>
                </div>

                <div 
                  onClick={() => playPitch('E4', 0.2, 'sine')}
                  className="absolute left-144 top-10 h-8 w-12 bg-primary/40 border border-primary rounded-sm cursor-pointer z-10" 
                />

                {/* Glowing playhead indicator element */}
                <div className="absolute left-[320px] top-0 bottom-0 w-[2px] bg-tertiary-fixed-dim shadow-[0_0_8px_rgba(0,226,151,1)] z-10 animate-pulse"></div>

                {/* Sticky Piano Keys vertical board */}
                <div className="sticky left-0 top-0 bottom-0 w-12 bg-surface-container-highest border-r border-white/10 z-30 flex flex-col justify-between py-2 rounded-l">
                  <span className="font-mono text-[9px] font-bold text-center text-on-surface-variant">C5</span>
                  <span className="font-mono text-[9px] font-bold text-center bg-black/40 text-on-surface-variant/60">B4</span>
                  <span className="font-mono text-[9px] font-bold text-center text-on-surface-variant">A4</span>
                  <span className="font-mono text-[9px] font-bold text-center bg-black/40 text-on-surface-variant/60">G4</span>
                  <span className="font-mono text-[9px] font-bold text-center text-on-surface-variant">F4</span>
                  <span className="font-mono text-[9px] font-bold text-center text-on-surface-variant">E4</span>
                  <span className="font-mono text-[9px] font-bold text-center bg-black/40 text-on-surface-variant/60">D4</span>
                  <span className="font-mono text-[9px] font-bold text-center text-on-surface-variant">C4</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Parameters controls section */}
        <aside className="w-80 border-l border-white/5 bg-surface-container-lowest/20 flex flex-col shrink-0 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <div>
            <span className="font-mono text-[10px] font-bold text-on-surface-variant tracking-widest block mb-4">
              AI PARAMETERS
            </span>
          </div>

          {/* Note augmentation section */}
          <div className="space-y-4">
            <h3 className="font-mono text-[10px] font-bold text-primary tracking-widest uppercase pb-1.5 border-b border-primary/10">
              AUGMENTATION
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-sans text-xs text-on-surface-variant">Pitch Shift Range</span>
                  <span className="font-mono text-xs text-on-surface">± {pitchShiftRange} semitones</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="12"
                  value={pitchShiftRange}
                  onChange={(e) => setPitchShiftRange(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-sans text-xs text-on-surface-variant">Time Stretch</span>
                  <span className="font-mono text-xs text-on-surface">{timeStretch.toFixed(1)}x - 1.1x</span>
                </div>
                <input 
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={timeStretch}
                  onChange={(e) => setTimeStretch(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Filtering parameters checkboxes */}
          <div className="space-y-4">
            <h3 className="font-mono text-[10px] font-bold text-secondary tracking-widest uppercase pb-1.5 border-b border-secondary/10">
              FILTERING
            </h3>
            <div className="space-y-2.5">
              <label className="flex items-center justify-between p-3 bg-white/[0.03] hover:bg-white/[0.06] rounded border border-white/5 cursor-pointer transition-colors">
                <span className="font-mono text-xs text-on-surface/90">Remove Monophonic</span>
                <input 
                  type="checkbox"
                  checked={removeMonophonic}
                  onChange={(e) => setRemoveMonophonic(e.target.checked)}
                  className="rounded dark:bg-surface-container h-4.5 w-4.5 accent-secondary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-white/[0.03] hover:bg-white/[0.06] rounded border border-white/5 cursor-pointer transition-colors">
                <span className="font-mono text-xs text-on-surface/90">Merge Overlapping</span>
                <input 
                  type="checkbox"
                  checked={mergeOverlapping}
                  onChange={(e) => setMergeOverlapping(e.target.checked)}
                  className="rounded dark:bg-surface-container h-4.5 w-4.5 accent-secondary cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Suggested Model Badge details */}
          <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="font-mono text-[9px] font-bold text-primary tracking-widest uppercase">
                SUGGESTED MODEL
              </span>
            </div>
            <p className="font-mono text-xs font-semibold text-on-surface mb-3">
              LSTM-Attention V2
            </p>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-black/40 border border-white/5 rounded text-[8px] font-mono text-on-surface-variant font-medium">
                MIDI-ONLY
              </span>
              <span className="px-2 py-0.5 bg-black/40 border border-white/5 rounded text-[8px] font-mono text-on-surface-variant font-medium">
                FAST-TRAIN
              </span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
