import { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Book, 
  Scroll, 
  Layers, 
  Grid, 
  Type, 
  Palette, 
  Copy, 
  Check, 
  Download,
  PenTool,
  Keyboard,
  Brush
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import copy from 'copy-to-clipboard';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type CardType = 'blocknote' | 'ruled' | 'squared' | 'book' | 'parchment';
type FontType = 'graffiti' | 'handwriting' | 'typewriter';

interface CardConfig {
  type: CardType;
  bgColor: string;
  font: FontType;
  fontColor: string;
  fontSize: number;
  text: string;
}

const CARD_TYPES: { id: CardType; label: string; icon: any }[] = [
  { id: 'blocknote', label: 'Blocknote', icon: FileText },
  { id: 'ruled', label: 'Righed', icon: Layers },
  { id: 'squared', label: 'Quadretti', icon: Grid },
  { id: 'book', label: 'Libro', icon: Book },
  { id: 'parchment', label: 'Pergamena', icon: Scroll },
];

const FONTS: { id: FontType; label: string; icon: any; family: string }[] = [
  { id: 'graffiti', label: 'Graffiti', icon: Brush, family: "'Permanent Marker', cursive" },
  { id: 'handwriting', label: 'A Penna', icon: PenTool, family: "'Caveat', cursive" },
  { id: 'typewriter', label: 'Macchina da Scrivere', icon: Keyboard, family: "'Special Elite', serif" },
];

const COLORS = [
  { name: 'Bianco', value: '#ffffff' },
  { name: 'Crema', value: '#fffaf0' },
  { name: 'Giallo', value: '#fef9c3' },
  { name: 'Celeste', value: '#e0f2fe' },
  { name: 'Rosa', value: '#fce7f3' },
  { name: 'Verde', value: '#f0fdf4' },
  { name: 'Pergamena', value: '#f4e4bc' },
];

export default function App() {
  const [config, setConfig] = useState<CardConfig>({
    type: 'blocknote',
    bgColor: '#ffffff',
    font: 'handwriting',
    fontColor: '#1f2937',
    fontSize: 24,
    text: 'Scrivi qui il tuo messaggio...',
  });

  const [copied, setCopied] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState('');

  useEffect(() => {
    generateCode();
  }, [config]);

  const handleCopy = () => {
    copy(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateCode = () => {
    const fontObj = FONTS.find(f => f.id === config.font);
    
    let textureStyles = '';
    if (config.type === 'ruled') {
      textureStyles = 'background-image: linear-gradient(#9198e5 1px, transparent 1px); background-size: 100% 2rem;';
    } else if (config.type === 'squared') {
      textureStyles = 'background-image: linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px); background-size: 20px 20px;';
    } else if (config.type === 'parchment') {
      textureStyles = 'background-image: url("https://www.transparenttextures.com/patterns/old-map.png");';
    }

    const html = `
<div style="
  width: 100%;
  max-width: 500px;
  min-height: 300px;
  padding: 40px;
  background-color: ${config.bgColor};
  ${textureStyles}
  border-radius: ${config.type === 'book' ? '4px 20px 20px 4px' : config.type === 'parchment' ? '0' : '12px'};
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  ${config.type === 'book' ? 'border-left: 15px solid rgba(0,0,0,0.1);' : ''}
  ${config.type === 'blocknote' ? 'border-top: 30px solid #f3f4f6;' : ''}
">
  ${config.type === 'blocknote' ? '<div style="position: absolute; top: -15px; left: 0; right: 0; height: 10px; background: repeating-linear-gradient(90deg, #d1d5db, #d1d5db 10px, transparent 10px, transparent 20px);"></div>' : ''}
  
  <div style="
    font-family: ${fontObj?.family};
    color: ${config.fontColor};
    font-size: ${config.fontSize}px;
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
    flex: 1;
  ">
    ${config.text}
  </div>
</div>
    `.trim();
    setGeneratedHtml(html);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 mb-2">Realistic Card Generator</h1>
        <p className="text-zinc-500">Crea card realistiche e personalizzate con un click</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left: Controls */}
        <div className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-zinc-100">
          {/* Card Type */}
          <section>
            <label className="text-sm font-semibold text-zinc-700 mb-3 block flex items-center gap-2">
              <Layers className="w-4 h-4" /> Tipo di Card
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CARD_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setConfig({ ...config, type: type.id })}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                    config.type === type.id 
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-md" 
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  )}
                >
                  <type.icon className="w-6 h-6 mb-1" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">{type.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Background Color */}
          <section>
            <label className="text-sm font-semibold text-zinc-700 mb-3 block flex items-center gap-2">
              <Palette className="w-4 h-4" /> Colore Card
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setConfig({ ...config, bgColor: color.value })}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    config.bgColor === color.value ? "border-zinc-900 scale-110" : "border-transparent"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
              <input 
                type="color" 
                value={config.bgColor}
                onChange={(e) => setConfig({ ...config, bgColor: e.target.value })}
                className="w-8 h-8 p-0 border-0 bg-transparent cursor-pointer"
              />
            </div>
          </section>

          {/* Font Family */}
          <section>
            <label className="text-sm font-semibold text-zinc-700 mb-3 block flex items-center gap-2">
              <Type className="w-4 h-4" /> Stile Font
            </label>
            <div className="grid grid-cols-3 gap-2">
              {FONTS.map((font) => (
                <button
                  key={font.id}
                  onClick={() => setConfig({ ...config, font: font.id })}
                  className={cn(
                    "flex flex-col items-center justify-center p-3 rounded-xl border transition-all",
                    config.font === font.id 
                      ? "bg-zinc-900 text-white border-zinc-900 shadow-md" 
                      : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                  )}
                >
                  <font.icon className="w-5 h-5 mb-1" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">{font.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Font Color & Size */}
          <div className="grid grid-cols-2 gap-4">
            <section>
              <label className="text-sm font-semibold text-zinc-700 mb-2 block">Colore Font</label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  value={config.fontColor}
                  onChange={(e) => setConfig({ ...config, fontColor: e.target.value })}
                  className="w-full h-10 p-1 bg-white border border-zinc-200 rounded-lg cursor-pointer"
                />
              </div>
            </section>
            <section>
              <label className="text-sm font-semibold text-zinc-700 mb-2 block">Grandezza Font ({config.fontSize}px)</label>
              <input 
                type="range" 
                min="12" 
                max="72" 
                value={config.fontSize}
                onChange={(e) => setConfig({ ...config, fontSize: parseInt(e.target.value) })}
                className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-zinc-900 mt-4"
              />
            </section>
          </div>

          {/* Text Content */}
          <section>
            <label className="text-sm font-semibold text-zinc-700 mb-2 block">Contenuto</label>
            <textarea
              value={config.text}
              onChange={(e) => setConfig({ ...config, text: e.target.value })}
              className="w-full h-32 p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-zinc-900 focus:border-transparent transition-all resize-none"
              placeholder="Inserisci il testo qui..."
            />
          </section>
        </div>

        {/* Right: Preview & Code */}
        <div className="space-y-8 sticky top-8">
          {/* Card Preview */}
          <div className="flex justify-center items-center perspective-1000">
            <motion.div
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className={cn(
                "w-full max-w-[500px] min-h-[400px] p-10 shadow-2xl relative overflow-hidden flex flex-col texture-paper",
                config.type === 'book' && "rounded-l-sm rounded-r-3xl border-l-[15px] border-black/10",
                config.type === 'parchment' && "rounded-none texture-parchment shadow-[0_0_50px_rgba(0,0,0,0.2)_inset]",
                config.type === 'blocknote' && "rounded-xl border-t-[30px] border-zinc-100",
                config.type !== 'book' && config.type !== 'parchment' && config.type !== 'blocknote' && "rounded-2xl"
              )}
              style={{ backgroundColor: config.bgColor }}
            >
              {/* Textures Overlay */}
              {config.type === 'ruled' && <div className="absolute inset-0 texture-ruled pointer-events-none opacity-40" />}
              {config.type === 'squared' && <div className="absolute inset-0 texture-squared pointer-events-none opacity-30" />}
              
              {/* Blocknote Spiral */}
              {config.type === 'blocknote' && (
                <div className="absolute top-[-15px] left-0 right-0 h-2.5 flex justify-around px-4 pointer-events-none">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="w-4 h-8 bg-zinc-300 rounded-full shadow-inner" />
                  ))}
                </div>
              )}

              {/* Content */}
              <div 
                className={cn(
                  "flex-1 z-10",
                  config.font === 'graffiti' && "font-graffiti",
                  config.font === 'handwriting' && "font-handwriting",
                  config.font === 'typewriter' && "font-typewriter"
                )}
                style={{ 
                  color: config.fontColor, 
                  fontSize: `${config.fontSize}px`,
                  lineHeight: 1.4
                }}
              >
                {config.text}
              </div>
              
              {/* Parchment Edges */}
              {config.type === 'parchment' && (
                <div className="absolute inset-0 border-[20px] border-transparent border-image-[url('https://www.transparenttextures.com/patterns/old-map.png')] opacity-20 pointer-events-none" />
              )}
            </motion.div>
          </div>

          {/* Code Section */}
          <div className="bg-zinc-900 rounded-2xl p-6 shadow-xl text-zinc-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">HTML Code</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copiato!' : 'Copia Codice'}
              </button>
            </div>
            <pre className="text-[10px] sm:text-xs font-mono overflow-x-auto p-4 bg-black/30 rounded-xl max-h-48 scrollbar-thin scrollbar-thumb-zinc-700">
              <code>{generatedHtml}</code>
            </pre>
          </div>
        </div>
      </div>

      <footer className="mt-16 pt-8 border-t border-zinc-200 text-center text-zinc-400 text-sm">
        Realistic Card Generator &bull; Creato con amore per il design pulito
      </footer>
    </div>
  );
}
