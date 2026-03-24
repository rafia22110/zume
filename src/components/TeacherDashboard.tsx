import { useState } from 'react';
import { Users, Plus, RotateCcw, Send, Sparkles, Globe, Atom, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface Student {
  id: number;
  name: string;
  color: string;
  isSpeaking: boolean;
  isRaisingHand: boolean;
  status: 'online' | 'offline';
}

interface TeacherDashboardProps {
  students: Student[];
  onSpawnTask: (type: 'cube' | 'molecule' | 'globe' | 'dna') => void;
  onResetCamera: () => void;
  onFocusStudent: (id: number) => void;
  onAiQuery: (query: string) => void;
  isAiLoading: boolean;
  compact?: boolean;
}

export function TeacherDashboard({
  students,
  onSpawnTask,
  onResetCamera,
  onFocusStudent,
  onAiQuery,
  isAiLoading,
  compact = false
}: TeacherDashboardProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onAiQuery(query);
      setQuery('');
    }
  };

  if (compact) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as any)}
            placeholder="Ask AI to spawn models..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#00f2fe]/50 pr-10"
          />
          <button 
            onClick={handleSubmit as any}
            disabled={isAiLoading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00f2fe] hover:text-white transition-colors disabled:opacity-50"
          >
            {isAiLoading ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'cube', label: 'Cube', icon: Box },
            { id: 'molecule', label: 'Molecule', icon: Atom },
            { id: 'globe', label: 'Globe', icon: Globe },
            { id: 'dna', label: 'DNA', icon: Box },
          ].map((task) => (
            <button
              key={task.id}
              onClick={() => onSpawnTask(task.id as any)}
              className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
            >
              <task.icon className="w-3 h-3 text-[#00f2fe]" />
              <span className="text-[10px] text-white/70 uppercase tracking-tighter">{task.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onResetCamera}
          className="w-full py-3 rounded-xl bg-[#00f2fe]/10 border border-[#00f2fe]/20 hover:bg-[#00f2fe]/20 text-[#00f2fe] font-display text-[10px] uppercase tracking-widest italic flex items-center justify-center gap-2 transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          Reset View
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col p-12">
      {/* Top Header - Editorial Style */}
      <div className="flex justify-between items-start pointer-events-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col"
        >
          <h1 className="display-text text-8xl text-white drop-shadow-[0_0_30px_rgba(0,242,254,0.3)]">
            Aether <span className="text-[#00f2fe]">Class</span>
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="micro-label">מערכת ניהול מטאברס v4.2</span>
            <div className="h-[1px] w-24 bg-white/20" />
            <span className="micro-label text-[#00f2fe]">מצב שידור פעיל</span>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-end"
        >
          <div className="glass-surface p-6 rounded-[2rem] flex items-center gap-6">
            <div className="text-right">
              <p className="micro-label mb-1">מורה נוכח</p>
              <p className="font-display text-2xl uppercase italic">רפאל ארגנטי</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00f2fe] to-[#008cff] p-[1px]">
              <div className="w-full h-full rounded-2xl bg-[#050508] flex items-center justify-center">
                <Users className="w-8 h-8 text-[#00f2fe]" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Split */}
      <div className="flex-1 flex justify-between items-end mt-12">
        {/* Left: Student List - Bold & Vertical */}
        <div className="w-96 flex flex-col gap-4 pointer-events-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#00f2fe] animate-pulse" />
            <h3 className="micro-label text-white">נוכחות תלמידים (5)</h3>
          </div>
          
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-4 custom-scrollbar">
            {students.map((student, idx) => (
              <motion.div
                key={student.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onFocusStudent(student.id)}
                className="group relative flex items-center gap-6 p-4 rounded-2xl glass-surface hover:bg-[#00f2fe]/10 transition-all cursor-pointer"
              >
                <span className="font-display text-5xl text-white/10 group-hover:text-[#00f2fe]/20 transition-colors absolute -left-2 top-1/2 -translate-y-1/2">
                  0{student.id}
                </span>
                <div className="relative z-10 flex items-center gap-4 w-full">
                  <div 
                    className="w-12 h-12 rounded-xl border border-white/20 shadow-lg" 
                    style={{ backgroundColor: student.color }}
                  />
                  <div className="flex-1">
                    <p className="font-display text-xl uppercase italic group-hover:text-[#00f2fe] transition-colors">
                      {student.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        student.status === 'online' ? "bg-[#00ffcc]" : "bg-white/20"
                      )} />
                      <span className="micro-label text-[8px]">
                        {student.status === 'online' ? 'מחובר' : 'מנותק'}
                      </span>
                    </div>
                  </div>
                  {student.isRaisingHand && (
                    <div className="px-3 py-1 rounded-full bg-yellow-400/20 border border-yellow-400/40 text-yellow-400 text-[8px] font-black uppercase tracking-widest">
                      יד מורמת
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right: Controls & AI */}
        <div className="w-[450px] flex flex-col gap-6 pointer-events-auto">
          {/* AI Panel - Striking */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-surface p-8 rounded-[2.5rem] border-[#00f2fe]/20"
          >
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-[#00f2fe]" />
              <h3 className="micro-label text-white">סייען הוראה חכם</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="הקלד שאלה לבינה המלאכותית..."
                className="w-full bg-white/5 border-b border-white/10 py-4 px-2 text-xl font-body text-white placeholder:text-white/20 focus:outline-none focus:border-[#00f2fe] transition-all text-right"
                dir="rtl"
              />
              <button
                type="submit"
                disabled={isAiLoading}
                className="absolute left-0 bottom-4 p-2 text-[#00f2fe] hover:scale-110 transition-transform disabled:opacity-50"
              >
                {isAiLoading ? <RotateCcw className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              </button>
            </form>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'globe', icon: Globe, label: 'גלובוס' },
              { id: 'molecule', icon: Atom, label: 'מולקולה' },
              { id: 'dna', icon: Box, label: 'DNA' }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onSpawnTask(item.id as any)}
                  className="glass-surface p-6 rounded-3xl flex flex-col items-center gap-3 hover:bg-[#00f2fe]/10 hover:border-[#00f2fe]/30 transition-all group"
                >
                  <Icon className="w-6 h-6 text-[#00f2fe] group-hover:scale-125 transition-transform" />
                  <span className="micro-label text-[8px]">{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={onResetCamera}
            className="w-full py-5 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-display text-sm uppercase tracking-widest italic flex items-center justify-center gap-3 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            איפוס מבט מורה
          </button>
        </div>
      </div>
    </div>
  );
}
