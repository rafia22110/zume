import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Compass, Users, MessageSquare, ScrollText, Trophy, Zap, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export function WorldView() {
  const [activeQuest, setActiveQuest] = useState(0);

  const quests = [
    { id: 0, title: 'חקירת המולקולה', progress: 75, reward: 250, type: 'science' },
    { id: 1, title: 'מפגש חברתי', progress: 20, reward: 100, type: 'social' },
    { id: 2, title: 'חידת ה-DNA', progress: 0, reward: 500, type: 'logic' },
  ];

  const socialList = [
    { name: 'נועה', status: 'online', level: 12 },
    { name: 'עידו', status: 'away', level: 8 },
    { name: 'מאיה', status: 'online', level: 15 },
  ];

  return (
    <div className="relative w-full h-full bg-[#050508] overflow-hidden flex flex-col">
      {/* 3D World Simulation (Background) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a1a] via-[#050508] to-[#0a0a1a]">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_#00e5ff_0%,_transparent_70%)]" />
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4 opacity-5">
          {Array.from({ length: 144 }).map((_, i) => (
            <div key={i} className="border border-[#00e5ff]/20 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Top HUD */}
      <div className="relative z-10 p-12 flex justify-between items-start">
        <div className="flex gap-6">
          <div className="glass-surface rounded-[2rem] p-6 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00e5ff] to-[#008cff] flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.4)]">
              <Compass className="w-8 h-8 text-[#050508]" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-white uppercase italic tracking-tight">האקדמיה המוארת</h2>
              <p className="micro-label text-[8px]">מגזר 7 • קומה 3</p>
            </div>
          </div>
          
          <div className="glass-surface rounded-[2rem] px-10 py-6 flex items-center gap-10">
            <div className="flex flex-col items-center">
              <span className="micro-label mb-1">רמה</span>
              <span className="font-display text-3xl text-[#00e5ff]">14</span>
            </div>
            <div className="w-[1px] h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <span className="micro-label mb-1">XP</span>
              <span className="font-display text-3xl text-white">2,450</span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="w-16 h-16 rounded-2xl glass-surface flex items-center justify-center text-white hover:bg-[#00e5ff]/10 hover:text-[#00e5ff] transition-all active:scale-90">
            <Search className="w-6 h-6" />
          </button>
          <button className="w-16 h-16 rounded-2xl glass-surface flex items-center justify-center text-white hover:bg-[#00e5ff]/10 hover:text-[#00e5ff] transition-all active:scale-90 relative">
            <MessageSquare className="w-6 h-6" />
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#ff004c] shadow-[0_0_10px_#ff004c]" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative z-10 flex px-12 pb-40 gap-12 items-end">
        {/* Left Sidebar: Quests */}
        <div className="w-96 space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <ScrollText className="w-6 h-6 text-[#00e5ff]" />
            <h3 className="display-text text-3xl text-white">יומן משימות</h3>
          </div>
          
          {quests.map((quest) => (
            <motion.div
              key={quest.id}
              onClick={() => setActiveQuest(quest.id)}
              whileHover={{ x: 15 }}
              className={cn(
                "p-6 rounded-[2rem] transition-all duration-500 cursor-pointer group relative overflow-hidden",
                activeQuest === quest.id 
                  ? "glass-surface bg-[#00e5ff]/10 border-[#00e5ff]/30" 
                  : "bg-white/[0.02] border border-white/5 hover:border-white/20"
              )}
            >
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-display text-lg text-white uppercase italic">{quest.title}</h4>
                <span className="micro-label text-[#00e5ff]">+{quest.reward} XP</span>
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${quest.progress}%` }}
                  className="h-full bg-gradient-to-r from-[#00e5ff] to-[#008cff]" 
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Center: Interaction Prompt */}
        <div className="flex-1 flex flex-col items-center justify-center mb-20">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-24 rounded-full bg-[#00e5ff]/20 border border-[#00e5ff]/40 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(0,229,255,0.2)]">
              <Zap className="w-10 h-10 text-[#00e5ff] fill-[#00e5ff]/20" />
            </div>
            <div className="bg-[#10141a]/90 backdrop-blur-3xl border border-white/10 rounded-2xl px-8 py-4 flex items-center gap-4 shadow-2xl">
              <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white font-black text-xs">E</span>
              <span className="text-white font-bold text-sm uppercase tracking-widest">התחל אינטראקציה</span>
            </div>
          </motion.div>
        </div>

        {/* Right Sidebar: Social & Map */}
        <div className="w-80 space-y-8">
          {/* Mini Map */}
          <div className="aspect-square bg-[#10141a]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-4 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <div className="relative z-10 w-full h-full border border-white/5 rounded-2xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-[#00e5ff] animate-pulse" />
              <div className="absolute top-4 right-4 text-[8px] font-black text-white/40 uppercase tracking-widest">תצוגת לוויין</div>
            </div>
          </div>

          {/* Social List */}
          <div className="bg-[#10141a]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-5 h-5 text-[#00e5ff]" />
              <h3 className="text-white font-black text-sm uppercase tracking-widest italic">חברים בקרבת מקום</h3>
            </div>
            <div className="space-y-4">
              {socialList.map((user, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      user.status === 'online' ? "bg-[#00ff8c] shadow-[0_0_10px_#00ff8c]" : "bg-white/20"
                    )} />
                    <span className="text-white font-bold text-sm group-hover:text-[#00e5ff] transition-colors">{user.name}</span>
                  </div>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Lvl {user.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
