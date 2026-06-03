import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Radio, 
  Volume2, 
  Repeat, 
  Download, 
  Share2, 
  Plus, 
  Trash2, 
  Wand2, 
  Sparkles,
  Info
} from 'lucide-react';
import { MidiNote } from '../types';
import { playPitch } from '../utils/audio';

interface CompositionViewProps {
  notes: MidiNote[];
  setNotes: React.Dispatch<React.SetStateAction<MidiNote[]>>;
  addActivityLog: (message: string, category: 'Training' | 'Export' | 'System', color: 'primary' | 'secondary' | 'tertiary' | 'neutral') => void;
}

export default function CompositionView({ 
  notes, 
  setNotes, 
  addActivityLog 
}: CompositionViewProps) {
  
  const [instrument, setInstrument] = useState<string>('Neural Grand Piano');
  const [tempo, setTempo] = useState<number>(124);
  const [creativity, setCreativity] = useState<number>(85);
  
  // Audio playback timeline states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playheadPos, setPlayheadPos] = useState<number>(180); // position in pixels (starts near initial note)
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("01:42 / 03:20");
  const [playbackSeconds, setPlaybackSeconds] = useState<number>(102); // 1:42 is 102s
  
  // Standard keys list matched to rows in DAW layout
  const keys = [
    { pitch: 'C5', isBlack: false },
    { pitch: 'B4', isBlack: true },
    { pitch: 'A#4', isBlack: false },
    { pitch: 'A4', isBlack: true },
    { pitch: 'G#4', isBlack: false },
    { pitch: 'G4', isBlack: true },
    { pitch: 'F#4', isBlack: false },
    { pitch: 'F4', isBlack: true },
    { pitch: 'E4', isBlack: false },
    { pitch: 'D#4', isBlack: true },
    { pitch: 'D4', isBlack: false },
    { pitch: 'C#4', isBlack: true },
    { pitch: 'C4', isBlack: false },
    { pitch: 'B3', isBlack: true },
    { pitch: 'A#3', isBlack: false },
    { pitch: 'A3', isBlack: true },
    { pitch: 'G#3', isBlack: false },
    { pitch: 'G3', isBlack: true },
    { pitch: 'F#3', isBlack: false },
    { pitch: 'F3', isBlack: true },
    { pitch: 'E3', isBlack: false },
    { pitch: 'D#3', isBlack: true },
    { pitch: 'D3', isBlack: false },
    { pitch: 'C#3', isBlack: true },
    { pitch: 'C3', isBlack: false }
  ];

  // Map instrument selection to oscillatorType
  const getOscillator = (): OscillatorType => {
    switch (instrument) {
      case 'Crystal Pad v4': return 'triangle';
      case 'Deep Bass AI': return 'sawtooth';
      case 'Ethereal Choir': return 'sine';
      default: return 'sine';
    }
  };

  // Timeline scheduler loop while playing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        setPlayheadPos(prev => {
          let next = prev + 5; // step forward
          if (next > 1000) {
            next = 50; // loop back
          }
          
          // Auditory scheduling: check if we are intersecting any MIDI notes!
          // Grid starts at left offset 48px, cell width 40px
          const stepOffset = Math.floor((next - 50) / 40);
          
          // Play notes matching the current step!
          notes.forEach(note => {
            if (note.startStep === stepOffset) {
              playPitch(note.pitch, 0.4, getOscillator());
            }
          });

          return next;
        });

        setPlaybackSeconds(prev => {
          const nextSecs = prev + 1;
          const mins = Math.floor(nextSecs / 60);
          const secs = nextSecs % 60;
          setCurrentTimeStr(`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')} / 03:20`);
          return nextSecs;
        });
      }, 350);
    }

    return () => clearInterval(interval);
  }, [isPlaying, notes, instrument]);

  const handleGenerateVariation = () => {
    playPitch('A3', 0.15, 'sine');
    setTimeout(() => playPitch('C4', 0.15, 'sine'), 100);
    setTimeout(() => playPitch('E4', 0.15, 'sine'), 200);
    setTimeout(() => playPitch('A4', 0.3, 'sine'), 300);

    addActivityLog(`Generating synthetic melody variation with creativity bias: ${creativity}%`, 'System', 'tertiary');

    // Generate random notes to fill the roll grid dynamically
    const randomNotes: MidiNote[] = [
      { id: 'gen-1', pitch: 'E4', startStep: 1, duration: 4, colorType: 'primary' },
      { id: 'gen-2', pitch: 'G4', startStep: 5, duration: 2, colorType: 'secondary' },
      { id: 'gen-3', pitch: 'B4', startStep: 8, duration: 6, colorType: 'tertiary' },
      { id: 'gen-4', pitch: 'C5', startStep: 15, duration: 3, colorType: 'primary' },
      { id: 'gen-5', pitch: 'A#4', startStep: 19, duration: 2, colorType: 'secondary' },
      { id: 'gen-6', pitch: 'D4', startStep: 22, duration: 4, colorType: 'primary' }
    ];

    setNotes(randomNotes);
    setPlayheadPos(80); // Move playhead back
  };

  const handleRefinePhrase = () => {
    // Quantize selected pitch durations and snap them closer together
    playPitch('E4', 0.1, 'sine');
    setTimeout(() => playPitch('E4', 0.2, 'sine'), 80);
    setNotes(prev => prev.map(note => ({
      ...note,
      duration: Math.max(1, Math.round(note.duration * 0.8))
    })));
    addActivityLog("Aligned composition notes to strict temporal grid", 'System', 'primary');
  };

  const handleGridCellClick = (pitch: string, stepIndex: number) => {
    playPitch(pitch, 0.35, getOscillator());
    
    // Check if matching note already exists at cell location
    const matchedIdx = notes.findIndex(n => n.pitch === pitch && n.startStep === stepIndex);
    
    if (matchedIdx !== -1) {
      // Remove it! Toggle cell
      setNotes(prev => prev.filter((_, idx) => idx !== matchedIdx));
    } else {
      // Add a note block
      const colors: MidiNote['colorType'][] = ['primary', 'secondary', 'tertiary'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      const newMidiNote: MidiNote = {
        id: `note-${Date.now()}`,
        pitch,
        startStep: stepIndex,
        duration: Math.floor(Math.random() * 3) + 2, // 2-4 steps
        colorType: randomColor
      };
      setNotes(prev => [...prev, newMidiNote]);
    }
  };

  const clearGrid = () => {
    setNotes([]);
    playPitch('C3', 0.3, 'sine');
    addActivityLog("Cleared sequencer workspace grid", 'System', 'neutral');
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-hidden flex flex-col -mx-margin-desktop md:-mx-margin-desktop -mt-margin-desktop bg-[#050505]">
      
      {/* Upper content workspace pane (piano roll + options) */}
      <div className="flex-grow flex overflow-hidden">
        
        {/* Main interactive piano roll sequence canvas */}
        <section className="flex-grow relative overflow-auto custom-scrollbar flex bg-[#050505]">
          
          {/* Vertical keys board sidebar (pinned left) */}
          <div className="sticky left-0 w-16 bg-[#131315] hover:opacity-100 transition-opacity z-30 border-r border-white/10 flex flex-col pt-1">
            {keys.map((key, i) => (
              <div 
                key={i}
                onClick={() => playPitch(key.pitch, 0.35, getOscillator())}
                className={`h-8 border-b border-white/[0.03] select-none flex items-center justify-end pr-2 font-mono text-[9px] font-semibold cursor-pointer active:brightness-90 transition-all ${
                  key.isBlack 
                    ? 'bg-[#0a0a0b] text-white/40' 
                    : 'bg-white/[0.04] text-white/20'
                  }`}
              >
                <span>{key.pitch}</span>
              </div>
            ))}
          </div>

          {/* Scrolling GRID matrix container */}
          <div className="flex-grow relative min-w-[1240px] h-full overflow-hidden h-[800px] piano-roll-bg">
            
            {/* Draw cells of step grid */}
            <div className="absolute inset-0 z-0 pointer-events-auto">
              {keys.map((key, rowIdx) => (
                <div key={rowIdx} className="h-8 flex">
                  {Array.from({ length: 30 }).map((_, colIdx) => (
                    <div 
                      key={colIdx} 
                      onClick={() => handleGridCellClick(key.pitch, colIdx)}
                      className="w-10 h-full border-r border-b border-white/[0.02] hover:bg-white/[0.03] active:bg-primary/20 cursor-crosshair transition-colors"
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* Render currently active layered notes */}
            {notes.map((note) => {
              // Map pitch name of key to row offset index
              const rowOffset = keys.findIndex(k => k.pitch === note.pitch);
              if (rowOffset === -1) return null;
              
              // Calculate styling bounds inside grid
              const topVal = rowOffset * 32; // 8px rows? No, row height is 32px (h-8 is 2rem = 32px)
              const leftVal = 64 + note.startStep * 40; // width is 40px (w-10 is 2.5rem = 40px)
              const widthVal = note.duration * 40;

              return (
                <div 
                  key={note.id}
                  onClick={(e) => {
                    e.stopPropagation(); // Stop parent click trigger
                    playPitch(note.pitch, 0.4, getOscillator());
                    
                    // Filter or delete note block
                    setNotes(prev => prev.filter(n => n.id !== note.id));
                  }}
                  title={`Pitch: ${note.pitch} (Step ${note.startStep}). Click to delete.`}
                  style={{ 
                    top: `${topVal}px`, 
                    left: `${leftVal}px`, 
                    width: `${widthVal}px` 
                  }}
                  className={`absolute h-7 rounded-sm border cursor-pointer flex items-center justify-between px-2 font-mono text-[9px] font-bold shadow-[0_0_12px_rgba(0,128,128,0.15)] z-20 backdrop-blur-sm transition-all hover:scale-x-[1.02] ${
                    note.colorType === 'primary' 
                      ? 'bg-primary-container/40 border-primary-container text-primary shadow-[0_0_15px_rgba(0,219,233,0.3)]' 
                      : note.colorType === 'secondary' 
                        ? 'bg-secondary/40 border-secondary text-secondary shadow-[0_0_15px_rgba(220,184,255,0.3)]' 
                        : 'bg-tertiary-container/40 border-tertiary-container text-[#00f7a6] shadow-[0_0_15px_rgba(0,247,166,0.3)]'
                  }`}
                >
                  <span>{note.pitch}</span>
                </div>
              );
            })}

            {/* Floating chronological Playhead ticker cursor */}
            <div 
              style={{ left: `${playheadPos}px` }}
              className="absolute top-0 bottom-0 w-[1.5px] bg-primary shadow-[0_0_10px_#00f0ff] z-20 pointer-events-none transition-all duration-300"
            >
              <div className="absolute top-0 -left-1 w-2 h-2 rounded-full bg-primary shadow-[0_0_6px_#00f0ff]"></div>
            </div>

          </div>
        </section>

        {/* Control parameters parameters Drawer panel (pinned right side) */}
        <aside className="w-80 border-l border-white/5 bg-[#131315]/85 backdrop-blur-2xl flex flex-col shrink-0 p-6 space-y-6">
          <div>
            <h3 className="font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">
              Control Parameters
            </h3>

            <div className="space-y-4">
              
              {/* Instrument Select */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-sans text-on-surface-variant font-medium">Instrument Synth</label>
                  <span className="font-mono text-primary font-bold text-[10px]">{instrument}</span>
                </div>
                <select 
                  value={instrument}
                  onChange={(e) => {
                    setInstrument(e.target.value);
                    addActivityLog(`Switched active synth node physical engine to ${e.target.value}`, 'System', 'primary');
                  }}
                  className="w-full bg-[#201f21] border border-white/5 rounded text-xs py-2 px-3 font-mono text-on-surface hover:border-white/10 focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Neural Grand Piano">Neural Grand Piano</option>
                  <option value="Crystal Pad v4">Crystal Pad v4</option>
                  <option value="Deep Bass AI">Deep Bass AI</option>
                  <option value="Ethereal Choir">Ethereal Choir</option>
                </select>
              </div>

              {/* Tempo BPM slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-sans text-on-surface-variant font-medium">Tempo (BPM)</label>
                  <span className="font-mono text-primary font-bold text-xs">{tempo} BPM</span>
                </div>
                <input 
                  type="range"
                  min="60"
                  max="220"
                  value={tempo}
                  onChange={(e) => setTempo(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Creativity bias slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-sans text-on-surface-variant font-medium">Creativity Bias</label>
                  <span className="font-mono text-primary font-bold text-xs">{creativity}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={creativity}
                  onChange={(e) => setCreativity(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

            </div>
          </div>

          <div className="space-y-2.5 border-t border-white/5 pt-4">
            <button 
              onClick={handleGenerateVariation}
              className="w-full py-3.5 bg-primary text-background font-mono font-bold text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all shadow-[0_0_15px_rgba(0,219,233,0.15)] cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 fill-background" />
              <span>Generate Variation</span>
            </button>

            <button 
              onClick={handleRefinePhrase}
              className="w-full py-3.5 bg-transparent border border-white/10 text-on-surface font-mono font-bold text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 hover:bg-white/5 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Refine Phrase</span>
            </button>

            <button 
              onClick={clearGrid}
              className="w-full py-2 bg-red-900/10 hover:bg-red-900/20 text-red-400 font-mono text-[9px] font-bold uppercase tracking-widest rounded flex items-center justify-center gap-1.5 border border-red-500/10 transition-all cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Reset Roll Sequence</span>
            </button>
          </div>

          <div className="pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center text-on-surface-variant">
            <button 
              onClick={() => alert("Downloading standard formatted MIDI loop output...")}
              className="py-2.5 hover:bg-white/5 rounded flex flex-col items-center gap-1 cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4 hover:text-primary transition-colors" />
              <span className="font-mono text-[8px] tracking-wider uppercase">MIDI</span>
            </button>
            <button 
              onClick={() => alert("Synthesizing WAV/MP3 standard file output...")}
              className="py-2.5 hover:bg-white/5 rounded flex flex-col items-center gap-1 cursor-pointer transition-colors"
            >
              <Volume2 className="w-4 h-4 hover:text-primary transition-colors" />
              <span className="font-mono text-[8px] tracking-wider uppercase">AUDIO</span>
            </button>
            <button 
              onClick={() => alert("Exporting local project database config details...")}
              className="py-2.5 hover:bg-white/5 rounded flex flex-col items-center gap-1 cursor-pointer transition-colors"
            >
              <Share2 className="w-4 h-4 hover:text-primary transition-colors" />
              <span className="font-mono text-[8px] tracking-wider uppercase">PROJECT</span>
            </button>
          </div>
        </aside>

      </div>

      {/* Bottom DAW Transport strip & wave indicator */}
      <footer className="h-28 border-t border-white/10 bg-[#0e0e10]/85 backdrop-blur-xl p-4 flex flex-col justify-between shrink-0">
        
        {/* Playback action items wrapper */}
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-4.5">
            <button 
              onClick={() => {
                setPlayheadPos(114);
                playPitch('C4', 0.2, 'sine');
              }}
              title="Skip back to start"
              className="text-primary hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <SkipBack className="w-4 h-4 fill-current" />
            </button>
            
            <button 
              onClick={() => {
                setIsPlaying(!isPlaying);
                playPitch('E4', 0.25, 'sine');
              }}
              className="text-primary hover:text-white cursor-pointer hover:scale-105 active:scale-95"
              title={isPlaying ? "Pause playback" : "Start chronological playback"}
            >
              {isPlaying ? (
                <div className="w-9 h-9 rounded-full bg-primary/20 hover:bg-primary/30 border border-primary/40 flex items-center justify-center">
                  <Pause className="w-4 h-4 text-primary fill-current" />
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Play className="w-4 h-4 text-primary fill-current" />
                </div>
              )}
            </button>

            <button 
              onClick={() => {
                setPlayheadPos(800);
                playPitch('E5', 0.2, 'sine');
              }}
              title="Skip forward"
              className="text-primary hover:text-white transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <SkipForward className="w-4 h-4 fill-current" />
            </button>

            <button 
              onClick={() => {
                setIsPlaying(false);
                playPitch('C3', 0.4, 'sawtooth');
                alert("Recording sequence audio inputs from MIDI board...");
              }}
              className="text-error-container hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1 text-[10px] uppercase font-mono tracking-wider font-semibold"
              title="Record timeline signals"
            >
              <Radio className="w-4 h-4 text-error animate-pulse" />
              <span className="text-error hidden sm:inline">REC</span>
            </button>
          </div>

          <div className="font-mono text-xs text-primary font-bold tracking-widest">
            {currentTimeStr}
          </div>

          <div className="flex gap-4">
            <button className="text-on-surface-variant hover:text-primary cursor-pointer">
              <Volume2 className="w-4 h-4" />
            </button>
            <button className="text-on-surface-variant hover:text-primary cursor-pointer">
              <Repeat className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Dynamic bottom linear Audio Waves visual */}
        <div className="flex-1 relative waveform-container flex items-center justify-center overflow-hidden py-1 border border-white/[0.03] rounded bg-black/35 mt-1">
          <svg className="w-full h-10" viewBox="0 0 1000 60">
            <defs>
              <linearGradient id="waveGrad" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#dbfcff", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#00dbe9", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path 
              d="M0,30 Q10,5 20,30 T40,30 T60,10 T80,50 T100,20 T120,45 T140,25 T160,35 T180,15 T200,40 T220,20 T240,45 T260,10 T280,55 T300,30 T320,40 T340,15 T360,50 T380,25 T400,35 T420,10 T440,55 T460,30 T480,45 T500,20 T520,50 T540,25 T560,40 T580,15 T600,55 T620,30 T640,45 T660,20 T680,50 T700,25 T720,40 T740,15 T760,55 T780,30 T800,45 T820,20 T840,50 T860,25 T880,40 T900,15 T920,55 T940,30 T960,45 T980,20 T1000,50" 
              fill="none" 
              stroke="url(#waveGrad)" 
              strokeWidth="2.5" 
              className="transition-transform duration-300"
              style={{ transform: `translateY(${isPlaying ? Math.sin(playheadPos * 0.1) * 3 : 0}px)` }}
            />
          </svg>
          
          {/* Chronological progress transparent panel block overlays */}
          <div 
            style={{ width: `${(playheadPos / 1000) * 100}%` }} 
            className="absolute left-0 top-0 bottom-0 bg-primary/10 border-r border-primary/30 pointer-events-none" 
          />
        </div>

      </footer>
    </div>
  );
}
