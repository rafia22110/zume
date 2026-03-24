import React from 'react';
import { motion } from 'motion/react';
import { User, Trophy, Zap, Star, Calendar, Flame, Award, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export function ProfileView() {
  const achievements = [
    { title: 'חוקר מולקולות', icon: Zap, color: '#00e5ff', date: '22/03/24' },
    { title: 'מאסטר DNA', icon: Award, color: '#ff004c', date: '18/03/24' },
    { title: 'משתתף פעיל', icon: Star, color: '#ffd700', date: '15/03/24' },
    { title: 'חלוץ המטא-וורס', icon: Trophy, color: '#00ff8c', date: '10/03/24' },
  ];

  const stats = [
    { label: 'שיעורים שהושלמו', value: '42', icon: Calendar },
    { label: 'רצף למידה', value: '12 ימים', icon: Flame },
    { label: 'נקודות זכות', value: '1,250', icon: Award },
  ];

  return (
    <div className="relative w-full h-full bg-[#050508] overflow-hidden flex flex-col p-8 md:p-16">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00e5ff]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ff004c]/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      {/* Header Section */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 mb-16">
        <div className="relative group">
          <div className="w-48 h-48 rounded-[40px] bg-gradient-to-br from-[#00e5ff] to-[#008cff] p-1 shadow-[0_20px_60px_rgba(0,229,255,0.2)] group-hover:rotate-6 transition-transform duration-500">
            <div className="w-full h-full rounded-[36px] bg-[#10141a] flex items-center justify-center overflow-hidden">
              <User className="w-24 h-24 text-[#00e5ff] opacity-40" />
            </div>
          </div>
          <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-2xl bg-[#050508] border border-white/10 flex items-center justify-center shadow-2xl">
            <span className="text-2xl font-black text-[#00e5ff]">14</span>
          </div>
        </div>

        <div className="text-center md:text-right flex-1">
          <h1 className="display-text text-8xl text-white mb-4">
            אודד <span className="text-[#00e5ff]">מנהל</span>
          </h1>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="px-8 py-3 rounded-full glass-surface text-white/60 micro-label">
              סטודנט מצטיין
            </div>
            <div className="px-8 py-3 rounded-full bg-[#00e5ff]/10 border border-[#00e5ff]/20 text-[#00e5ff] micro-label">
              מגמת מדעים
            </div>
          </div>
          
          <div className="mt-12 max-w-md">
            <div className="flex justify-between micro-label mb-3">
              <span>רמה הבאה: 15</span>
              <span>2,450 / 3,000 XP</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '80%' }}
                className="h-full bg-gradient-to-r from-[#00e5ff] to-[#008cff] shadow-[0_0_20px_rgba(0,229,255,0.5)]" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-surface rounded-[2.5rem] p-10 flex items-center gap-8 group hover:bg-[#00e5ff]/5 transition-all duration-500">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20 group-hover:text-[#00e5ff] group-hover:scale-110 transition-all">
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="micro-label mb-2">{stat.label}</p>
                <p className="font-display text-4xl text-white italic">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Achievements Section */}
      <div className="relative z-10 flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <Award className="w-8 h-8 text-[#00e5ff]" />
            <h3 className="display-text text-4xl text-white">הישגים אחרונים</h3>
          </div>
          <button className="text-[#00e5ff] micro-label flex items-center gap-3 hover:gap-6 transition-all">
            צפה בהכל <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 overflow-y-auto pr-2 custom-scrollbar pb-12">
          {achievements.map((achievement, i) => {
            const Icon = achievement.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -15 }}
                className="glass-surface rounded-[3rem] p-10 flex flex-col items-center text-center group relative overflow-hidden"
              >
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center mb-8 shadow-2xl transition-all duration-500 group-hover:scale-125"
                  style={{ backgroundColor: `${achievement.color}10`, border: `1px solid ${achievement.color}20` }}
                >
                  <Icon className="w-12 h-12" style={{ color: achievement.color }} />
                </div>
                <h4 className="font-display text-xl text-white uppercase italic mb-2">{achievement.title}</h4>
                <p className="micro-label text-[8px]">{achievement.date}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
