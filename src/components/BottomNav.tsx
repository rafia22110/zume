import { Globe, Users, PersonStanding, LayoutDashboard, User } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export type ScreenType = 'classroom' | 'world' | 'customizer' | 'profile';

interface BottomNavProps {
  currentScreen: ScreenType;
  onScreenChange: (screen: ScreenType) => void;
}

export function BottomNav({ currentScreen, onScreenChange }: BottomNavProps) {
  const navItems = [
    { id: 'world', icon: Globe, label: 'עולם' },
    { id: 'classroom', icon: LayoutDashboard, label: 'כיתה' },
    { id: 'customizer', icon: PersonStanding, label: 'דמות' },
    { id: 'profile', icon: User, label: 'פרופיל' },
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
      <nav className="pointer-events-auto glass-surface rounded-[2.5rem] p-2 flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onScreenChange(item.id as ScreenType)}
              className={cn(
                "flex flex-col items-center justify-center px-8 py-4 rounded-[2rem] transition-all duration-500 active:scale-90 relative group focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none",
                isActive 
                  ? "bg-gradient-to-br from-[#00f2fe] to-[#008cff] text-[#050508] shadow-[0_10px_30px_rgba(0,229,255,0.4)]" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-6 h-6 mb-1 transition-transform duration-500", isActive && "scale-110")} />
              <span className={cn(
                "micro-label text-[8px] transition-colors duration-500",
                isActive ? "text-[#050508] font-black" : "text-white/20"
              )}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="nav-glow"
                  className="absolute inset-0 rounded-[2rem] bg-white/20 blur-xl -z-10"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
