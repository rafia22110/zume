import { useState, useEffect } from 'react';
import { ClassroomScene } from './components/ClassroomScene';
import { TeacherDashboard } from './components/TeacherDashboard';
import { AvatarCustomizer } from './components/AvatarCustomizer';
import { WorldView } from './components/WorldView';
import { ProfileView } from './components/ProfileView';
import { BottomNav, ScreenType } from './components/BottomNav';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { 
  Info, 
  Sparkles, 
  Mic, 
  Video, 
  Hand, 
  MessageSquare, 
  Users, 
  Settings, 
  PhoneOff,
  Monitor,
  MoreVertical,
  Maximize2
} from 'lucide-react';

interface Student {
  id: number;
  name: string;
  color: string;
  isSpeaking: boolean;
  isRaisingHand: boolean;
  status: 'online' | 'offline';
  reaction?: string | null;
}

interface ChatMessage {
  id: number;
  sender: string;
  color?: string;
  text: string;
  timestamp: string;
}

const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "יוסי כהן", color: "#4facfe", isSpeaking: false, isRaisingHand: false, status: 'online', reaction: null },
  { id: 2, name: "דניאלה רז", color: "#f093fb", isSpeaking: false, isRaisingHand: true, status: 'online', reaction: "🔥" },
  { id: 3, name: "עמית לוי", color: "#7BC8A4", isSpeaking: false, isRaisingHand: false, status: 'online', reaction: null },
  { id: 4, name: "לירון ש.", color: "#FFC65D", isSpeaking: false, isRaisingHand: false, status: 'online', reaction: "💡" },
  { id: 5, name: "נועה אברהם", color: "#ff758c", isSpeaking: false, isRaisingHand: false, status: 'online', reaction: null },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('classroom');
  const [taskType, setTaskType] = useState<'cube' | 'molecule' | 'globe' | 'dna'>('cube');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [focusedStudentId, setFocusedStudentId] = useState<number | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isMetaverseMode, setIsMetaverseMode] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'people' | 'chat' | 'controls'>('people');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "יוסי כהן", text: "היי כולם, איזה עולם מדהים!", timestamp: "10:00" },
    { id: 2, sender: "דניאלה רז", color: "#f093fb", text: "מישהו הבין את המשימה?", timestamp: "10:02" },
  ]);
  const [myReaction, setMyReaction] = useState<string | null>(null);

  // Clear my reaction after 3 seconds
  useEffect(() => {
    if (myReaction) {
      const timer = setTimeout(() => setMyReaction(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [myReaction]);

  // Simulate student activity
  useEffect(() => {
    const interval = setInterval(() => {
      setStudents(prev => prev.map(s => ({
        ...s,
        isSpeaking: Math.random() > 0.9,
        isRaisingHand: Math.random() > 0.95 ? !s.isRaisingHand : s.isRaisingHand,
        reaction: Math.random() > 0.9 ? ['🔥', '💡', '👏', '❤️', '😂', '😮'][Math.floor(Math.random() * 6)] : (Math.random() > 0.8 ? null : s.reaction)
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAiQuery = async (query: string) => {
    setIsAiLoading(true);
    setAiResponse(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a 3D Metaverse Classroom Assistant. The teacher asked: "${query}". 
        If the query is about DNA, molecules, or geography, suggest a 3D model to spawn.
        Return a JSON response with:
        - text: A short explanation in Hebrew.
        - spawnType: One of "dna", "molecule", "globe", or "cube".`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              spawnType: { type: Type.STRING, enum: ["dna", "molecule", "globe", "cube"] }
            },
            required: ["text", "spawnType"]
          }
        }
      });

      const data = JSON.parse(response.text || "{}");
      setAiResponse(data.text);
      if (data.spawnType) {
        setTaskType(data.spawnType);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse("מצטער, חלה שגיאה בעיבוד הבקשה.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'classroom':
        return (
          <div className="flex h-full w-full">
            {/* Main 3D Viewport - The "Meet Grid" Replacement */}
            <div className="flex-1 relative overflow-hidden bg-[#0a0a0f]">
              <AnimatePresence mode="wait">
                {isMetaverseMode ? (
                  <motion.div
                    key="metaverse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <ClassroomScene 
                      taskType={taskType} 
                      students={students} 
                      focusedStudentId={focusedStudentId}
                      myReaction={myReaction}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="standard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 p-8 grid grid-cols-3 gap-4"
                  >
                    {/* Mocked Standard Meet Grid */}
                    <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00f2fe] to-[#4facfe] flex items-center justify-center text-white font-bold text-2xl">T</div>
                      <div className="absolute bottom-4 left-4 text-xs font-bold text-white/70">You (Teacher)</div>
                    </div>
                    {students.map(s => (
                      <div key={s.id} className="relative bg-gray-900 rounded-2xl overflow-hidden border border-white/5 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: s.color }}>{s.name[0]}</div>
                        <div className="absolute bottom-4 left-4 text-xs font-bold text-white/70">{s.name}</div>
                        {s.isSpeaking && <div className="absolute inset-0 border-4 border-[#00f2fe] rounded-2xl animate-pulse" />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Meet-style Overlay Controls */}
              <div className="absolute top-6 left-6 z-20 flex items-center gap-4">
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">REC • 00:42:15</span>
                </div>
                <div className="bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-3">
                  <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Physics 101 - Quantum Mechanics</span>
                </div>
              </div>

              <div className="absolute top-6 right-6 z-20 flex flex-col items-end gap-3">
                <button
                  aria-label="Maximize view"
                  className="p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white/70 hover:text-white transition-all focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                
                {/* Game HUD: Lesson Objective */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-4 rounded-2xl w-48 animate-slam">
                  <h5 className="micro-label text-[#00f2fe] mb-2 font-black">Current Objective</h5>
                  <p className="text-[10px] text-white/80 leading-tight">Explore the 3D model of the {taskType} and identify its key components.</p>
                  <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00f2fe] w-2/3 shadow-[0_0_10px_#00f2fe]" />
                  </div>
                </div>

                {/* Game HUD: Mini-map */}
                <div className="bg-black/40 backdrop-blur-md border border-white/10 p-2 rounded-2xl w-32 h-32 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                  <div className="relative w-full h-full border border-white/5 rounded-lg flex items-center justify-center">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="w-2 h-2 rounded-full bg-[#00f2fe] shadow-[0_0_10px_#00f2fe] z-10" 
                    /> {/* You */}
                    {students.map((s, i) => (
                      <motion.div 
                        key={s.id} 
                        animate={{ 
                          x: (Math.random() - 0.5) * 2,
                          y: (Math.random() - 0.5) * 2
                        }}
                        className={`absolute w-1.5 h-1.5 rounded-full ${focusedStudentId === s.id ? 'bg-[#00f2fe] scale-150' : 'bg-white/40'}`}
                        style={{ 
                          top: `${40 + (i % 2 === 0 ? -25 : 25)}%`, 
                          left: `${40 + (i < 2 ? -25 : 25)}%` 
                        }} 
                      />
                    ))}
                    <div className="absolute inset-0 border border-white/10 rounded-lg pointer-events-none" />
                    <div className="absolute top-1 left-1 text-[6px] text-white/30 uppercase font-black">Sector A-1</div>
                  </div>
                </div>
              </div>

              {/* AI Response Notification */}
              <AnimatePresence>
                {aiResponse && (
                  <motion.div
                    initial={{ opacity: 0, y: 50, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: 50, x: "-50%" }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-xl"
                  >
                    <div className="glass-surface p-6 rounded-[2rem] border-[#00f2fe]/30 flex gap-4 items-start shadow-2xl">
                      <div className="w-12 h-12 rounded-xl bg-[#00f2fe]/10 flex items-center justify-center shrink-0 border border-[#00f2fe]/20">
                        <Sparkles className="w-6 h-6 text-[#00f2fe]" />
                      </div>
                      <div className="flex-1">
                        <h4 className="micro-label text-[#00f2fe] mb-1 italic">AI Assistant</h4>
                        <p className="text-white text-sm leading-relaxed font-body" dir="rtl">{aiResponse}</p>
                      </div>
                      <button
                        onClick={() => setAiResponse(null)}
                        aria-label="Close AI response"
                        className="text-white/20 hover:text-white p-1 focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none rounded-lg"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Meet Sidebar - Participant List */}
            <div className="w-80 bg-[#0a0a0f] border-l border-white/5 flex flex-col z-30">
              <div className="flex border-b border-white/5">
                {[
                  { id: 'people', icon: Users, label: 'People' },
                  { id: 'chat', icon: MessageSquare, label: 'Chat' },
                  { id: 'controls', icon: Settings, label: 'Controls' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setSidebarTab(tab.id as any)}
                    aria-label={`${tab.label} tab`}
                    className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none ${
                      sidebarTab === tab.id ? 'text-[#00f2fe]' : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">{tab.label}</span>
                    {sidebarTab === tab.id && (
                      <motion.div layoutId="sidebarTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00f2fe]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                {sidebarTab === 'people' && (
                  <div className="p-4 space-y-2">
                    {/* Teacher (You) */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00f2fe] to-[#4facfe] flex items-center justify-center text-white font-bold text-xs relative">
                        T
                        {myReaction && (
                          <div className="absolute -top-1 -right-1 text-xs animate-bounce">{myReaction}</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs font-medium">You (Teacher)</p>
                        <p className="text-white/40 text-[10px]">Host</p>
                      </div>
                      <div className="flex gap-1">
                        <Mic className="w-3 h-3 text-white/40" />
                        <Video className="w-3 h-3 text-white/40" />
                      </div>
                    </div>

                    {/* Students */}
                    {students.map(student => (
                      <button
                        key={student.id}
                        onClick={() => setFocusedStudentId(student.id)}
                        aria-label={`Focus on ${student.name}`}
                        className={`w-full text-right p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none ${
                          focusedStudentId === student.id 
                            ? 'bg-[#00f2fe]/10 border-[#00f2fe]/30' 
                            : 'bg-transparent border-transparent hover:bg-white/5'
                        }`}
                      >
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs relative"
                          style={{ backgroundColor: student.color }}
                        >
                          {student.name[0]}
                          {student.isSpeaking && (
                            <div className="absolute -inset-1 border-2 border-[#00f2fe] rounded-full animate-ping opacity-50" />
                          )}
                          {student.reaction && (
                            <div className="absolute -top-1 -right-1 text-xs animate-bounce">{student.reaction}</div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-xs font-medium">{student.name}</p>
                          <p className="text-white/40 text-[10px]">{student.status}</p>
                        </div>
                        <div className="flex gap-1">
                          {student.isRaisingHand && <Hand className="w-3 h-3 text-yellow-400" />}
                          <Mic className={`w-3 h-3 ${student.isSpeaking ? 'text-[#00f2fe]' : 'text-white/20'}`} />
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {sidebarTab === 'chat' && (
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex-1 space-y-4 mb-4">
                      {chatMessages.map(msg => (
                        <div key={msg.id} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold" style={{ color: msg.color || '#00f2fe' }}>{msg.sender}</span>
                            <span className="text-[8px] text-white/20">{msg.timestamp}</span>
                          </div>
                          <p className="text-xs text-white/70 bg-white/5 p-3 rounded-2xl rounded-tl-none">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-auto relative">
                      <input 
                        type="text" 
                        placeholder="Send a message..." 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#00f2fe]/50"
                      />
                    </div>
                  </div>
                )}

                {sidebarTab === 'controls' && (
                  <div className="p-4">
                    <TeacherDashboard
                      students={students}
                      onSpawnTask={setTaskType}
                      onResetCamera={() => setFocusedStudentId(null)}
                      onFocusStudent={(id) => setFocusedStudentId(id)}
                      onAiQuery={handleAiQuery}
                      isAiLoading={isAiLoading}
                      compact
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'customizer':
        return <AvatarCustomizer />;
      case 'world':
        return <WorldView />;
      case 'profile':
        return <ProfileView />;
      default:
        return null;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-body bg-[#050508] text-white">
      {/* Design Recipe 7: Atmospheric Background */}
      <div className="atmosphere z-0" />
      
      {/* Meet Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-black/60 backdrop-blur-xl border-b border-white/5 z-[100] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-[#00f2fe] rounded-lg flex items-center justify-center">
            <Monitor className="w-5 h-5 text-black" />
          </div>
          <h1 className="font-display text-sm uppercase tracking-[0.2em] italic">Metaverse Classroom Plugin</h1>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMetaverseMode(!isMetaverseMode)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none ${
              isMetaverseMode 
                ? 'bg-[#00f2fe]/20 border-[#00f2fe]/50 text-[#00f2fe]' 
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            <Sparkles className={`w-3 h-3 ${isMetaverseMode ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              {isMetaverseMode ? 'Metaverse Active' : 'Enable Metaverse'}
            </span>
          </button>
          <div className="flex -space-x-2">
            {students.slice(0, 3).map(s => (
              <div key={s.id} className="w-6 h-6 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center text-[8px]" style={{ backgroundColor: s.color }}>
                {s.name[0]}
              </div>
            ))}
            <div className="w-6 h-6 rounded-full border-2 border-black bg-white/10 flex items-center justify-center text-[8px] text-white/60">
              +{students.length - 3}
            </div>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="text-xs text-white/60 font-mono tracking-tighter">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div className="pt-14 h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Meet Bottom Control Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4">
        <div className="flex items-center gap-3 bg-black/60 backdrop-blur-2xl border border-white/10 p-2 rounded-full shadow-2xl">
          <button
            aria-label="Mute/Unmute microphone"
            className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none"
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            aria-label="Turn on/off camera"
            className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none"
          >
            <Video className="w-5 h-5" />
          </button>
          
          {/* Reaction Picker */}
          <div className="relative group/reactions">
            <button
              aria-label="Open reaction picker"
              className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none"
            >
              <Sparkles className="w-5 h-5" />
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-2 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl flex gap-2 opacity-0 group-hover/reactions:opacity-100 transition-all pointer-events-none group-hover/reactions:pointer-events-auto">
              {['🔥', '💡', '👏', '❤️', '😂', '😮'].map(emoji => (
                <button 
                  key={emoji} 
                  onClick={() => setMyReaction(emoji)}
                  aria-label={`React with ${emoji}`}
                  className="w-10 h-10 rounded-xl hover:bg-white/10 flex items-center justify-center text-xl transition-all hover:scale-125 focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <button
            aria-label="Raise or lower hand"
            className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none"
          >
            <Hand className="w-5 h-5" />
          </button>
          <button
            aria-label="Present your screen"
            className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none"
          >
            <Monitor className="w-5 h-5" />
          </button>
          <button
            aria-label="Open chat sidebar"
            className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
          <button
            aria-label="More meeting options"
            className="p-4 rounded-full bg-white/5 hover:bg-white/10 text-white transition-all focus-visible:ring-2 focus-visible:ring-[#00f2fe] focus-visible:outline-none"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
          <button
            aria-label="Leave the meeting"
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all ml-2 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Navigation (Hidden in Classroom mode to look like a plugin) */}
      {currentScreen !== 'classroom' && (
        <BottomNav 
          currentScreen={currentScreen} 
          onScreenChange={setCurrentScreen} 
        />
      )}
    </div>
  );
}
