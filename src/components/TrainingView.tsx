import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Thermometer, 
  Play, 
  StopCircle, 
  RotateCw, 
  Terminal, 
  Layers, 
  HelpCircle,
  TrendingDown,
  LineChart,
  HardDrive
} from 'lucide-react';
import { TrainConfig } from '../types';
import { playPitch } from '../utils/audio';

interface TrainingViewProps {
  config: TrainConfig;
  setConfig: React.Dispatch<React.SetStateAction<TrainConfig>>;
  addActivityLog: (message: string, category: 'Training' | 'Export' | 'System', color: 'primary' | 'secondary' | 'tertiary' | 'neutral') => void;
}

interface LogLine {
  time: string;
  epoch: number;
  loss: number;
  accuracy: number;
  eta: string;
  isHeadline?: boolean;
  isCheckpoint?: boolean;
}

export default function TrainingView({ 
  config, 
  setConfig, 
  addActivityLog 
}: TrainingViewProps) {
  
  const [learningRate, setLearningRate] = useState<number>(0.00032);
  const [batchSize, setBatchSize] = useState<number>(128);
  const [epochs, setEpochs] = useState<string>("1000");
  const [seqLength, setSeqLength] = useState<number>(512);
  
  const [isTraining, setIsTraining] = useState<boolean>(true);
  const [gpuLoad, setGpuLoad] = useState<number>(84.2);
  const [temperature, setTemperature] = useState<number>(72);
  
  // Simulated initial logs
  const [logs, setLogs] = useState<LogLine[]>([
    { time: "09:21:04", epoch: 0, loss: 1.4502, accuracy: 0.125, eta: "4h 12m", isHeadline: true },
    { time: "09:21:06", epoch: 0, loss: 1.2210, accuracy: 0.184, eta: "4h 10m" },
    { time: "09:21:10", epoch: 1, loss: 0.9854, accuracy: 0.210, eta: "4h 08m" },
    { time: "09:22:15", epoch: 2, loss: 0.8124, accuracy: 0.342, eta: "4h 01m" },
    { time: "09:23:45", epoch: 3, loss: 0.7214, accuracy: 0.491, eta: "3h 58m" },
    { time: "09:25:12", epoch: 12, loss: 0.5402, accuracy: 0.651, eta: "3h 52m" },
    { time: "09:32:00", epoch: 41, loss: 0.3120, accuracy: 0.812, eta: "3h 48m", isCheckpoint: true },
    { time: "09:33:45", epoch: 42, loss: 0.2411, accuracy: 0.892, eta: "3h 45m" }
  ]);

  const [currentEpoch, setCurrentEpoch] = useState<number>(42);
  const [currentLoss, setCurrentLoss] = useState<number>(0.2411);
  const [currentAcc, setCurrentAcc] = useState<number>(0.892);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  // Interval thread for simulated real-time learning logs
  useEffect(() => {
    if (!isTraining) return;

    const interval = setInterval(() => {
      setCurrentEpoch(prev => {
        const nextEpoch = prev + 1;
        const now = new Date();
        const timestamp = now.toLocaleTimeString('en-GB', { hour12: false });
        
        // Loss decreases, accuracy increases asymptotically
        const nextLoss = Math.max(0.0125, currentLoss - 0.0012 * Math.random());
        const nextAcc = Math.min(0.998, currentAcc + 0.0006 * Math.random());
        setCurrentLoss(nextLoss);
        setCurrentAcc(nextAcc);

        // Periodically output checkpoints or logs
        const isCheck = nextEpoch % 5 === 0;
        
        setLogs(prevLogs => [
          ...prevLogs,
          { 
            time: timestamp, 
            epoch: nextEpoch, 
            loss: parseFloat(nextLoss.toFixed(4)), 
            accuracy: parseFloat(nextAcc.toFixed(3)), 
            eta: "3h 42m",
            isCheckpoint: isCheck
          }
        ]);

        if (isCheck) {
          addActivityLog(`Automatically compiled model checkpoint for Epoch ${nextEpoch}. Loss: ${nextLoss.toFixed(4)}.`, 'Training', 'primary');
          // Play mini chime to signal checkpoint success
          playPitch('B4', 0.15, 'sine');
          setTimeout(() => playPitch('E5', 0.2, 'sine'), 80);
        }

        // Slightly fluctuate GPU load & Core temperature
        setGpuLoad(parseFloat((80 + Math.random() * 8).toFixed(1)));
        setTemperature(Math.floor(70 + Math.random() * 5));

        return nextEpoch;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isTraining, currentLoss, currentAcc]);

  // Autoscroll log terminal
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const handleUpdateParams = () => {
    setIsTraining(false);
    playPitch('A3', 0.15, 'triangle');
    setTimeout(() => playPitch('E4', 0.3, 'triangle'), 100);

    addActivityLog(`Recalibrated hyperparameters - Learning rate: ${learningRate}, Batch size: ${batchSize}`, 'System', 'primary');

    setTimeout(() => {
      const now = new Date();
      const stamp = now.toLocaleTimeString('en-GB', { hour12: false });
      
      setLogs(prev => [
        ...prev,
        { time: stamp, epoch: currentEpoch, loss: parseFloat(currentLoss.toFixed(4)), accuracy: parseFloat(currentAcc.toFixed(3)), eta: "Calculating...", isHeadline: true }
      ]);
      setIsTraining(true);
    }, 1000);
  };

  const handleStopTraining = () => {
    if (isTraining) {
      setIsTraining(false);
      playPitch('G3', 0.3, 'sawtooth');
      addActivityLog(`User paused model training for melody-gen-v4-sequencer`, 'System', 'neutral');
    } else {
      setIsTraining(true);
      playPitch('E4', 0.3, 'triangle');
      addActivityLog(`Re-activated model training sequence`, 'System', 'primary');
    }
  };

  const handlePreviewAudio = () => {
    // Play gorgeous synthesized audio riff based on weights
    const scale = ['E3', 'A3', 'B3', 'C4', 'E4', 'G4', 'A4', 'B4', 'C5'];
    scale.forEach((note, index) => {
      setTimeout(() => {
        playPitch(note, 0.4, 'triangle');
      }, index * 180);
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header and status indicators */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-display font-semibold text-3xl text-primary tracking-tight">
            LSTM Training Session
          </h1>
          <p className="font-mono text-xs text-on-surface-variant mt-1.5 uppercase tracking-wide">
            Active Model Architecture: <span className="text-secondary font-semibold">melody-gen-v4-sequencer</span>
          </p>
        </div>

        {/* Real-time Hardware monitor charts */}
        <div className="flex gap-4">
          <div className="glass-panel p-4 rounded-lg flex items-center gap-4 border border-white/5 bg-surface-container-lowest/50">
            <div className="flex flex-col items-end">
              <span className="font-mono text-[9px] font-bold text-on-surface-variant tracking-wider">GPU LOAD</span>
              <span className="font-mono text-xs font-semibold text-tertiary-fixed-dim">{gpuLoad}%</span>
            </div>
            <div className="w-10 h-10 rounded-full border border-surface-variant flex items-center justify-center relative">
              <svg className="w-full h-full transform -rotate-90 absolute">
                <circle cx="20" cy="20" r="16" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <circle cx="20" cy="20" r="16" fill="transparent" stroke="#00f7a6" strokeDasharray="1005" strokeDashoffset={100 - gpuLoad} strokeWidth="2" />
              </svg>
              <Cpu className="w-3.5 h-3.5 text-tertiary-fixed-dim" />
            </div>
          </div>

          <div className="glass-panel p-4 rounded-lg flex items-center gap-4 border border-white/5 bg-surface-container-lowest/50">
            <div className="flex flex-col items-end">
              <span className="font-mono text-[9px] font-bold text-on-surface-variant tracking-wider">TEMP</span>
              <span className="font-mono text-xs font-semibold text-error">{temperature}°C</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
              <Thermometer className="w-4 h-4 text-error pulse-mint" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Analytical curves & hyperparameters config layout */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Real-time convergence analytics charts block (8 Columns) */}
        <div className="col-span-12 xl:col-span-8 glass-panel rounded-lg p-6 border border-white/5 relative flex flex-col justify-between min-h-[460px]">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <LineChart className="w-4 h-4 text-primary" />
              <h3 className="font-mono text-[10px] font-bold text-on-surface uppercase tracking-widest">
                Convergence Analytics
              </h3>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-primary rounded-full neon-glow-primary" />
                <span className="font-mono text-[9px] tracking-wider uppercase text-on-surface-variant font-semibold">LOSS</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-tertiary rounded-full neon-glow-tertiary" />
                <span className="font-mono text-[9px] tracking-wider uppercase text-on-surface-variant font-semibold font-sans">ACCURACY</span>
              </div>
            </div>
          </div>

          {/* Simulated curves representation */}
          <div className="h-80 w-full midi-grid-bg relative rounded border border-white/5 bg-black/40 p-4">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 800 400">
              {/* Convergence Loss bezier curves */}
              <path 
                className="text-primary-container neon-glow-primary opacity-80" 
                d={`M 0 350 Q 150 ${350 - currentEpoch * 1.5} 300 240 T 450 150 T 600 95 T 800 80`} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3.5" 
              />
              {/* Accuracy improvements curves */}
              <path 
                className="text-tertiary-container neon-glow-tertiary opacity-80" 
                d={`M 0 380 Q 200 370 380 270 T 550 180 T 700 145 T 800 120`} 
                fill="none" 
                stroke="#00f7a6" 
                strokeWidth="2.5" 
              />

              {/* Grid highlights mapping */}
              <line stroke="rgba(255,255,255,0.1)" strokeDasharray="4" x1="400" x2="400" y1="0" y2="400" />
              <circle className="fill-primary-container neon-glow-primary" cx="400" cy="150" r="5" />
            </svg>

            {/* Float values tooltip */}
            <div className="absolute top-[135px] left-[52%] glass-panel p-2.5 rounded border border-primary/30 text-[9px] font-mono shadow-xl bg-black/90 pointer-events-none whitespace-nowrap">
              <p className="text-white/60 uppercase tracking-widest mb-0.5">EPOCH {currentEpoch}</p>
              <p className="text-primary">Loss: <span className="font-bold">{currentLoss.toFixed(4)}</span></p>
              <p className="text-[#00f7a6]">Accuracy: <span className="font-bold">{(currentAcc * 100).toFixed(1)}%</span></p>
            </div>
          </div>
        </div>

        {/* Hyperparameters Config Drawer (4 Columns) */}
        <div className="col-span-12 xl:col-span-4 glass-panel rounded-lg p-6 border border-white/5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-[10px] font-bold text-on-surface uppercase tracking-widest mb-6">
              Hyperparameters
            </h3>
            
            <div className="space-y-5">
              <div>
                <div className="flex justify-between font-mono text-[10px] mb-1">
                  <label className="text-on-surface-variant uppercase">LEARNING RATE</label>
                  <span className="text-primary font-bold">{learningRate.toFixed(5)}</span>
                </div>
                <input 
                  type="range"
                  min="0.00001"
                  max="0.001"
                  step="0.00005"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <span className="font-mono text-[10px] text-on-surface-variant block mb-1.5 uppercase">BATCH SIZE</span>
                <div className="grid grid-cols-4 gap-2">
                  {[32, 64, 128, 256].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setBatchSize(size)}
                      className={`py-2 rounded font-mono text-xs border transition-all cursor-pointer ${
                        batchSize === size
                          ? 'bg-primary/20 border-primary text-primary font-bold'
                          : 'bg-white/5 border-white/5 text-on-surface-variant hover:bg-white/10 hover:text-on-surface'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between font-mono text-[10px] mb-1">
                  <label className="text-on-surface-variant uppercase">TRAINING EPOCHS</label>
                  <span className="text-primary font-bold">{epochs}</span>
                </div>
                <input 
                  type="text" 
                  value={epochs}
                  onChange={(e) => setEpochs(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-transparent border-0 border-b border-white/20 focus:border-primary focus:ring-0 transition-all font-mono text-sm text-on-surface py-1 text-left"
                />
              </div>

              <div>
                <div className="flex justify-between font-mono text-[10px] mb-1">
                  <label className="text-on-surface-variant uppercase">SEQ LENGTH (LSTM)</label>
                  <span className="text-primary font-bold">{seqLength} MS</span>
                </div>
                <input 
                  type="range"
                  min="128"
                  max="2048"
                  step="128"
                  value={seqLength}
                  onChange={(e) => setSeqLength(parseInt(e.target.value))}
                  className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-3">
            <button 
              onClick={handleUpdateParams}
              className="flex-grow bg-primary text-background py-3.5 rounded-lg font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-background" />
              <span>Update Hyperparams</span>
            </button>
            <button 
              onClick={handleStopTraining}
              className={`p-3.5 rounded-lg flex items-center justify-center active:scale-95 transition-all cursor-pointer ${
                isTraining 
                  ? 'bg-error-container text-on-error-container hover:brightness-110' 
                  : 'bg-tertiary-container text-on-tertiary-container hover:brightness-110'
              }`}
              title={isTraining ? "Pause Training Thread" : "Resume Training Thread"}
            >
              <StopCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Live Execution logs */}
      <div className="glass-panel rounded-lg border border-white/5 overflow-hidden">
        <div className="px-6 py-4.5 border-b border-white/10 flex justify-between items-center bg-surface-container-high/40">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full bg-tertiary-fixed-dim ${isTraining ? 'animate-pulse' : ''}`} />
            <span className="font-mono text-xs font-semibold text-on-surface tracking-widest">LIVE EXECUTION LOGS</span>
          </div>
          <span className="font-mono text-[9px] text-on-surface-variant/70 tracking-wider font-semibold uppercase">AUTO-SCROLL ENABLED</span>
        </div>

        {/* Terminal panel code board */}
        <div className="p-6 h-64 overflow-y-auto font-mono text-xs space-y-1.5 bg-[#050505]/65 custom-scrollbar">
          {logs.map((log, index) => {
            if (log.isHeadline) {
              return (
                <div key={index} className="text-secondary opacity-90 font-semibold pt-1">
                  [{log.time}] &gt;&gt; Initializing CUDA pipeline & loading 'classic_piano_midi_v2'...
                </div>
              );
            }
            if (log.isCheckpoint) {
              return (
                <div key={index} className="text-primary font-semibold py-0.5 border-y border-primary/5 my-1">
                  [{log.time}] Checkpoint saved: ./checkpoints/lstm_v4_e{log.epoch}.pt | Loss: {log.loss.toFixed(4)}
                </div>
              );
            }
            return (
              <div key={index} className="text-on-surface-variant/85 hover:text-on-surface transition-colors flex justify-between gap-4">
                <span>[{log.time}] EPOCH {String(log.epoch).padStart(2, '0')}/1000 | Loss: {log.loss.toFixed(4)} | Accuracy: {log.accuracy.toFixed(3)} | ETA: {log.eta}</span>
                <span className="text-[10px] text-white/20 select-none">OK</span>
              </div>
            );
          })}
          {isTraining && (
            <div className="text-primary animate-pulse font-semibold">
              [...] Training active on RTX 4090 GPU... computing loss gradients...
            </div>
          )}
          <div ref={consoleEndRef} />
        </div>
      </div>

      {/* Asymmetric bento grid row cards */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Checkpoint preview loop synth (4 columns) */}
        <div 
          onClick={handlePreviewAudio}
          className="col-span-12 md:col-span-4 glass-panel rounded-lg p-6 border border-white/5 relative group cursor-pointer h-64 overflow-hidden"
        >
          {/* Decorative waveform layout visual */}
          <img 
            alt="Waves visual indicator"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcexCSM00TJ7V_tAYCX77cbcV0D9k81EbbJJJtXIffzSEcPnxh2CXQjWRd_-YofEry4P3r8OyBUutsGGCrwVf70kczfeObLOhjK9UVLXvVUelmY91iUr68-sbQ-mfjAKsNRlpkCENj-8n_hdI3Kg9HCEs--Nogwk-_G4zKZDTZGnzCBJK31bn8B-X4fx12padxl3egQ-golzvAFMjIRMtMYfZloyAJXeWLWx4V-ko0y-WikqUfiIPoMfFjiKB6TDtJZhwYNWucz8g" 
            className="absolute inset-0 w-full h-full object-cover opacity-10 group-hover:opacity-15 group-hover:scale-105 transition-all duration-700 pointer-events-none" 
            referrerPolicy="no-referrer"
          />

          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <span className="font-mono text-[9px] font-bold text-primary tracking-widest uppercase block mb-1">
                LAST CHECKPOINT
              </span>
              <h4 className="font-display font-semibold text-lg text-on-surface">
                Neural Riff v2
              </h4>
              <p className="mt-2 font-sans text-xs text-on-surface-variant leading-relaxed">
                Generated 42 midi seeds with 0.89 probability accuracy weights threshold. Click card to preview synthesised output audio.
              </p>
            </div>
            <button className="self-start font-mono text-xs text-primary group-hover:text-white transition-colors flex items-center gap-2">
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>PREVIEW AUDIO</span>
            </button>
          </div>
        </div>

        {/* Network architecture description panel (8 columns) */}
        <div className="col-span-12 md:col-span-8 glass-panel rounded-lg p-6 border border-white/5 flex gap-6 overflow-hidden relative h-64">
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="font-mono text-[9px] font-bold text-[#00f7a6] tracking-widest uppercase block mb-1">
                MODEL ARCHITECTURE
              </span>
              <h4 className="font-display font-semibold text-lg text-on-surface">
                Bidirectional LSTM + Attention
              </h4>
              <p className="font-sans text-xs text-on-surface-variant mt-1 max-w-lg">
                Multi-layer recurrent topology utilizing custom sparse multi-head self-attention mechanisms to map long-range temporal chord distributions effectively.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-2.5 py-1 bg-white/5 rounded border border-white/5 font-mono text-[10px] text-on-surface-variant font-medium">
                LAYERS: 4
              </span>
              <span className="px-2.5 py-1 bg-white/5 rounded border border-white/5 font-mono text-[10px] text-on-surface-variant font-medium">
                HIDDEN: 1024
              </span>
              <span className="px-2.5 py-1 bg-white/5 rounded border border-white/5 font-mono text-[10px] text-on-surface-variant font-medium">
                DROPOUT: 0.2
              </span>
              <span className="px-2.5 py-1 bg-white/5 rounded border border-white/5 font-mono text-[10px] text-on-surface-variant font-medium">
                HEADS: 8
              </span>
            </div>
          </div>

          {/* Matrix architecture visual element */}
          <div className="hidden md:block w-1/3 border border-white/5 rounded bg-black/40 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-4 gap-1.5 p-3">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                      i % 3 === 0 
                        ? 'bg-primary shadow-[0_0_8px_rgba(0,240,255,0.4)]' 
                        : 'bg-primary/20 hover:bg-primary/50 cursor-pointer'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
