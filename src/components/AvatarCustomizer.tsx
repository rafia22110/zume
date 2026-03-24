import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Palette, Shirt, Smile, Zap, RefreshCcw, Check } from 'lucide-react';
import { Avatar } from './Avatar';
import { cn } from '../lib/utils';

export function AvatarCustomizer() {
  const [activeTab, setActiveTab] = useState<'body' | 'hair' | 'gear' | 'face'>('body');
  const [selectedColor, setSelectedColor] = useState('#ffccaa');
  const [isGenerating, setIsGenerating] = useState(false);

  const tabs = [
    { id: 'body', icon: Palette, label: 'גוף' },
    { id: 'hair', icon: Smile, label: 'שיער' },
    { id: 'gear', icon: Shirt, label: 'לבוש' },
    { id: 'face', icon: Zap, label: 'פנים' },
  ];

  const colors = ['#ffccaa', '#d2b48c', '#8b4513', '#ffdbac', '#f1c27d', '#e0ac69'];

  const handleRandomize = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1000);
  };

  return (
    <div className="relative w-full h-full bg-[#050508] overflow-hidden flex flex-col md:flex-row">
      {/* 3D Preview Area */}
      <div className="flex-1 relative h-[50vh] md:h-full">
        <Canvas shadows dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 1.5, 4]} fov={45} />
          <OrbitControls 
            enablePan={false} 
            minDistance={2} 
            maxDistance={6} 
            target={[0, 1, 0]}
            maxPolarAngle={Math.PI / 1.8}
          />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[5, 5, 5]} intensity={1} castShadow />
          <pointLight position={[-5, 2, 2]} intensity={0.5} color="#00e5ff" />
          
          <Suspense fallback={null}>
            <group position={[0, 0, 0]}>
              <Avatar 
                position={[0, 0, 0]}
                name="You" 
                color={selectedColor} 
                isSpeaking={false} 
                isRaisingHand={false} 
              />
            </group>
            <ContactShadows opacity={0.4} scale={10} blur={2} far={4.5} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>

        {/* Floating Controls */}
        <div className="absolute bottom-8 left-8 flex gap-4">
          <button 
            onClick={handleRandomize}
            className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 transition-all active:scale-90"
          >
            <RefreshCcw className={cn("w-6 h-6", isGenerating && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Customization Panel */}
      <div className="w-full md:w-[500px] h-full glass-surface border-l border-white/10 p-12 flex flex-col animate-slam">
        <div className="mb-12">
          <h1 className="display-text text-6xl text-white">
            עיצוב <span className="text-[#00e5ff]">Aether</span>
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="micro-label">התאמת נוכחות דיגיטלית</span>
            <div className="h-[1px] w-12 bg-white/10" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-12 bg-white/5 p-1 rounded-[2rem] border border-white/5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex-1 flex flex-col items-center py-4 rounded-[1.8rem] transition-all duration-500",
                  isActive ? "bg-white/10 text-[#00e5ff] shadow-inner" : "text-white/20 hover:text-white/40"
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="micro-label text-[8px]">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-12"
            >
              {activeTab === 'body' && (
                <div className="space-y-6">
                  <label className="micro-label">גוון עור נבחר</label>
                  <div className="grid grid-cols-6 gap-4">
                    {colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={cn(
                          "w-12 h-12 rounded-2xl border-2 transition-all duration-500 active:scale-90",
                          selectedColor === color ? "border-[#00e5ff] scale-110 shadow-[0_0_20px_rgba(0,229,255,0.4)]" : "border-transparent opacity-40 hover:opacity-100"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'hair' && (
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="aspect-square bg-white/5 rounded-2xl border border-white/10 hover:border-[#00e5ff]/50 transition-all cursor-pointer group flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/10 rounded-full group-hover:scale-110 transition-transform" />
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'gear' && (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-white/5 rounded-2xl border border-white/10 hover:border-[#00e5ff]/50 transition-all cursor-pointer p-4 flex flex-col justify-end">
                      <div className="w-full h-2 bg-white/10 rounded-full mb-2" />
                      <div className="w-2/3 h-2 bg-white/10 rounded-full" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <button className="mt-8 w-full py-5 bg-gradient-to-r from-[#00e5ff] to-[#008cff] rounded-2xl text-[#050508] font-black text-lg uppercase tracking-widest shadow-[0_20px_40px_rgba(0,229,255,0.2)] hover:shadow-[0_20px_50px_rgba(0,229,255,0.4)] transition-all active:scale-95 flex items-center justify-center gap-3">
          <Check className="w-6 h-6" />
          מוכן לכניסה
        </button>
      </div>
    </div>
  );
}
