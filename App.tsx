import React, { useState, Suspense } from 'react';
import {
  Music,
  Guitar,
  FileText,
  Mic,
  BookOpen,
  PenTool,
  User,
  Gamepad2,
  Menu,
  X,
  Edit3,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { PianoGenerator } from './components/PianoGenerator';
import { GuitarGenerator } from './components/GuitarGenerator';
import { ScaleGenerator } from './components/ScaleGenerator';
import { SheetMusicGenerator } from './components/SheetMusicGenerator';
import { LoginScreen } from './pages/LoginScreen';
import { AdminDashboard } from './components/Admin/AdminDashboard';
import { SystemBanner } from './components/Admin/SystemBanner';
import { useAdmin } from './components/Admin/AdminContext';
import { LessonFeed } from './components/LessonFeed';
import { LessonEditor } from './components/LessonEditor';
import { CifraCreator } from './components/CifraCreator';
import { NewLessonEditor } from './components/NewLessonEditor';
import { Footer } from './components/Footer';

// Lazy load new components
const IdGenerator = React.lazy(() =>
  import("./components/IdGenerator").then((module) => ({
    default: module.IdGenerator,
  }))
);
const ChordQuiz = React.lazy(() =>
  import("./components/ChordQuiz").then((module) => ({
    default: module.ChordQuiz,
  }))
);
const MemoryGame = React.lazy(() =>
  import("./components/MemoryGame").then((module) => ({
    default: module.MemoryGame,
  }))
);

enum Tab {
  NEW_LESSON_EDITOR = "NEW_LESSON_EDITOR",
  PIANO = "PIANO",
  GUITAR = "GUITAR",
  SCALES = "SCALES",
  SHEET_MUSIC = "SHEET_MUSIC",
  DESIGN = "DESIGN",
  PODCASTS = "PODCASTS",
  LESSON_EDITOR = "LESSON_EDITOR",
  OLD_LESSON_EDITOR = "OLD_LESSON_EDITOR",
  CIFRA_CREATOR = "CIFRA_CREATOR",
  MEMORY_GAME = "MEMORY_GAME",
  ID_GENERATOR = "ID_GENERATOR",
  CHORD_QUIZ = "CHORD_QUIZ",
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PIANO);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  const { features, currentUser, logout } = useAdmin();

  // If not authenticated, show login screen
  if (!currentUser) {
    return <LoginScreen />;
  }

  // If admin wants to access dashboard
  if (showAdminDashboard && currentUser.role === 'Admin') {
    return (
      <AdminDashboard onLogout={() => {
        setShowAdminDashboard(false);
      }} />
    );
  }

  const handleLogout = () => {
    logout();
    setIsProfileMenuOpen(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col font-sans text-slate-700 selection:bg-yellow-200 bg-pattern">
      <SystemBanner />

      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-md border-b border-white/20 shadow-sm z-50 px-6 flex items-center justify-between">

        {/* Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-4 flex-none w-auto">
          <button
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(Tab.PIANO)}>
            <img src="/starkids_logo_hd.png" alt="Starkids Studio" className="h-14 w-auto" />
            <div className="leading-tight">
              <h1 className="font-lobster text-2xl text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-purple-600">
                Starkids
              </h1>
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Studio</p>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center items-center px-4 max-w-5xl">
          <div className="flex items-center gap-3 justify-center w-full">
            {features.lessonEditor && currentUser?.permissions?.lessonEditor && (
              <NavButton
                active={activeTab === Tab.NEW_LESSON_EDITOR}
                onClick={() => setActiveTab(Tab.NEW_LESSON_EDITOR)}
                icon={<Edit3 size={18} />}
                label="Lesson Edit"
                color="text-blue-500"
              />
            )}
            {features.piano && currentUser?.permissions?.piano && (
              <NavButton
                active={activeTab === Tab.PIANO}
                onClick={() => setActiveTab(Tab.PIANO)}
                icon={<Music size={18} />}
                label="Piano"
                color="text-pink-500"
              />
            )}
            {features.lessonEditor && currentUser?.permissions?.lessonEditor && (
              <NavButton
                active={activeTab === Tab.OLD_LESSON_EDITOR}
                onClick={() => setActiveTab(Tab.OLD_LESSON_EDITOR)}
                icon={<Edit3 size={18} />}
                label="Editor Aulas"
                color="text-indigo-500"
              />
            )}
            {features.guitar && currentUser?.permissions?.guitar && (
              <NavButton
                active={activeTab === Tab.GUITAR}
                onClick={() => setActiveTab(Tab.GUITAR)}
                icon={<Guitar size={18} />}
                label="Violão"
                color="text-orange-500"
              />
            )}
            {features.cifra && currentUser?.permissions?.cifra && (
              <NavButton
                active={activeTab === Tab.CIFRA_CREATOR}
                onClick={() => setActiveTab(Tab.CIFRA_CREATOR)}
                icon={<FileText size={18} />}
                label="Cifras"
                color="text-yellow-500"
              />
            )}
            {features.scales && currentUser?.permissions?.scales && (
              <NavButton
                active={activeTab === Tab.SCALES}
                onClick={() => setActiveTab(Tab.SCALES)}
                icon={<Music size={18} />}
                label="Escalas"
                color="text-green-500"
              />
            )}
            {features.sheetMusic && currentUser?.permissions?.sheetMusic && (
              <NavButton
                active={activeTab === Tab.SHEET_MUSIC}
                onClick={() => setActiveTab(Tab.SHEET_MUSIC)}
                icon={<FileText size={18} />}
                label="Partituras"
                color="text-purple-500"
              />
            )}
            {features.memoryGame && currentUser?.permissions?.memoryGame && (
              <NavButton
                active={activeTab === Tab.MEMORY_GAME}
                onClick={() => setActiveTab(Tab.MEMORY_GAME)}
                icon={<Gamepad2 size={18} />}
                label="Memory Game"
                color="text-red-500"
              />
            )}
            {features.quiz && currentUser?.permissions?.quiz && (
              <NavButton
                active={activeTab === Tab.CHORD_QUIZ}
                onClick={() => setActiveTab(Tab.CHORD_QUIZ)}
                icon={<Gamepad2 size={18} />}
                label="Quiz"
                color="text-indigo-500"
              />
            )}
            {features.idGenerator && currentUser?.permissions?.idGenerator && (
              <NavButton
                active={activeTab === Tab.ID_GENERATOR}
                onClick={() => setActiveTab(Tab.ID_GENERATOR)}
                icon={<User size={18} />}
                label="Carteirinha"
                color="text-cyan-500"
              />
            )}
            {features.design && currentUser?.permissions?.design && (
              <NavButton
                active={activeTab === Tab.DESIGN}
                onClick={() => setActiveTab(Tab.DESIGN)}
                icon={<PenTool size={18} />}
                label="Design"
                color="text-teal-500"
              />
            )}
            {features.podcasts && currentUser?.permissions?.podcasts && (
              <NavButton
                active={activeTab === Tab.PODCASTS}
                onClick={() => setActiveTab(Tab.PODCASTS)}
                icon={<Mic size={18} />}
                label="Podcasts"
                color="text-rose-500"
              />
            )}
          </div>
        </nav>

        {/* User Profile / Admin Access */}
        <div className="flex-none relative">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
              {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <span className="text-sm font-bold text-slate-600 hidden md:block">
              {currentUser ? currentUser.name : 'Usuário'}
            </span>
            <ChevronDown size={16} className={`text-slate-400 transition-transform hidden md:block ${isProfileMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isProfileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsProfileMenuOpen(false)}
              />

              {/* Menu */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fade-in-up">
                {/* User Info */}
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {currentUser?.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 truncate">{currentUser?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-white rounded-full text-slate-600 font-semibold">
                      {currentUser?.instrumento}
                    </span>
                    {currentUser?.role === 'Admin' && (
                      <span className="text-xs px-2 py-1 bg-purple-500 text-white rounded-full font-semibold">
                        Admin
                      </span>
                    )}
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  {currentUser?.role === 'Admin' && (
                    <button
                      onClick={() => {
                        setShowAdminDashboard(true);
                        setIsProfileMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-slate-700 hover:bg-purple-50 rounded-xl transition-colors"
                    >
                      <User size={18} className="text-purple-500" />
                      <span className="font-semibold">Moderador</span>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut size={18} />
                    <span className="font-semibold">Sair</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </header>

      {/* --- MOBILE MENU --- */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-24 px-6 lg:hidden overflow-y-auto">
          <div className="flex flex-col gap-2">
            {features.lessonEditor && currentUser?.permissions?.lessonEditor && <MobileNavButton active={activeTab === Tab.NEW_LESSON_EDITOR} onClick={() => { setActiveTab(Tab.NEW_LESSON_EDITOR); setIsMenuOpen(false); }} label="Lesson Edit" icon={<Edit3 size={20} />} />}
            {features.piano && currentUser?.permissions?.piano && <MobileNavButton active={activeTab === Tab.PIANO} onClick={() => { setActiveTab(Tab.PIANO); setIsMenuOpen(false); }} label="Piano" icon={<Music size={20} />} />}
            {features.lessonEditor && currentUser?.permissions?.lessonEditor && <MobileNavButton active={activeTab === Tab.OLD_LESSON_EDITOR} onClick={() => { setActiveTab(Tab.OLD_LESSON_EDITOR); setIsMenuOpen(false); }} label="Editor Aulas" icon={<Edit3 size={20} />} />}
            {features.guitar && currentUser?.permissions?.guitar && <MobileNavButton active={activeTab === Tab.GUITAR} onClick={() => { setActiveTab(Tab.GUITAR); setIsMenuOpen(false); }} label="Violão" icon={<Guitar size={20} />} />}
            {features.cifra && currentUser?.permissions?.cifra && <MobileNavButton active={activeTab === Tab.CIFRA_CREATOR} onClick={() => { setActiveTab(Tab.CIFRA_CREATOR); setIsMenuOpen(false); }} label="Cifras" icon={<FileText size={20} />} />}
            {features.scales && currentUser?.permissions?.scales && <MobileNavButton active={activeTab === Tab.SCALES} onClick={() => { setActiveTab(Tab.SCALES); setIsMenuOpen(false); }} label="Escalas" icon={<Music size={20} />} />}
            {features.sheetMusic && currentUser?.permissions?.sheetMusic && <MobileNavButton active={activeTab === Tab.SHEET_MUSIC} onClick={() => { setActiveTab(Tab.SHEET_MUSIC); setIsMenuOpen(false); }} label="Partituras" icon={<FileText size={20} />} />}
            {features.memoryGame && currentUser?.permissions?.memoryGame && <MobileNavButton active={activeTab === Tab.MEMORY_GAME} onClick={() => { setActiveTab(Tab.MEMORY_GAME); setIsMenuOpen(false); }} label="Memory Game" icon={<Gamepad2 size={20} />} />}
            {features.quiz && currentUser?.permissions?.quiz && <MobileNavButton active={activeTab === Tab.CHORD_QUIZ} onClick={() => { setActiveTab(Tab.CHORD_QUIZ); setIsMenuOpen(false); }} label="Quiz" icon={<Gamepad2 size={20} />} />}
            {features.idGenerator && currentUser?.permissions?.idGenerator && <MobileNavButton active={activeTab === Tab.ID_GENERATOR} onClick={() => { setActiveTab(Tab.ID_GENERATOR); setIsMenuOpen(false); }} label="Carteirinha" icon={<User size={20} />} />}
            {features.design && currentUser?.permissions?.design && <MobileNavButton active={activeTab === Tab.DESIGN} onClick={() => { setActiveTab(Tab.DESIGN); setIsMenuOpen(false); }} label="Design" icon={<PenTool size={20} />} />}
            {features.podcasts && currentUser?.permissions?.podcasts && <MobileNavButton active={activeTab === Tab.PODCASTS} onClick={() => { setActiveTab(Tab.PODCASTS); setIsMenuOpen(false); }} label="Podcasts" icon={<Mic size={20} />} />}
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 pt-28 relative z-0">
        {activeTab === Tab.NEW_LESSON_EDITOR && (features.lessonEditor && currentUser?.permissions?.lessonEditor ? <NewLessonEditor /> : <div className="flex justify-center items-center h-full text-slate-400">Acesso restrito</div>)}
        {activeTab === Tab.PIANO && (features.piano && currentUser?.permissions?.piano ? <PianoGenerator /> : <div className="flex justify-center items-center h-full text-slate-400">Acesso restrito</div>)}
        {activeTab === Tab.GUITAR && (features.guitar && currentUser?.permissions?.guitar ? <GuitarGenerator /> : <div className="flex justify-center items-center h-full text-slate-400">Acesso restrito</div>)}
        {activeTab === Tab.SCALES && (features.scales && currentUser?.permissions?.scales ? <ScaleGenerator /> : <div className="flex justify-center items-center h-full text-slate-400">Acesso restrito</div>)}
        {activeTab === Tab.SHEET_MUSIC && (features.sheetMusic && currentUser?.permissions?.sheetMusic ? <SheetMusicGenerator /> : <div className="flex justify-center items-center h-full text-slate-400">Acesso restrito</div>)}
        {activeTab === Tab.OLD_LESSON_EDITOR && (features.lessonEditor && currentUser?.permissions?.lessonEditor ? <LessonEditor /> : <div className="flex justify-center items-center h-full text-slate-400">Acesso restrito</div>)}
        {activeTab === Tab.CIFRA_CREATOR && (features.cifra && currentUser?.permissions?.cifra ? <CifraCreator /> : <div className="flex justify-center items-center h-full text-slate-400">Acesso restrito</div>)}

        <Suspense fallback={<div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div></div>}>
          {activeTab === Tab.ID_GENERATOR && (features.idGenerator && currentUser?.permissions?.idGenerator ? <IdGenerator /> : <div className="flex justify-center items-center h-full text-slate-400">Acesso restrito</div>)}
          {activeTab === Tab.CHORD_QUIZ && (features.quiz && currentUser?.permissions?.quiz ? <ChordQuiz /> : <div className="flex justify-center items-center h-full text-slate-400">Acesso restrito</div>)}
          {activeTab === Tab.MEMORY_GAME && (features.memoryGame && currentUser?.permissions?.memoryGame ? <MemoryGame /> : <div className="flex justify-center items-center h-full text-slate-400">Acesso restrito</div>)}
        </Suspense>

        {activeTab === Tab.DESIGN && (features.design && currentUser?.permissions?.design ? (
          <div className="flex items-center justify-center h-96 text-slate-400">
            <div className="text-center">
              <img src="/sleeping_star.png" alt="Em breve" className="mx-auto mb-4 h-64 w-auto object-contain" />
              <h2 className="text-2xl font-bold">Design Studio</h2>
              <p>Em breve...</p>
            </div>
          </div>
        ) : <div className="flex justify-center items-center h-full text-slate-400">Acesso restrito</div>)}

        {activeTab === Tab.PODCASTS && (features.podcasts && currentUser?.permissions?.podcasts ? (
          <div className="flex items-center justify-center h-96 text-slate-400">
            <div className="text-center">
              <img src="/sleeping_star.png" alt="Em breve" className="mx-auto mb-4 h-64 w-auto object-contain" />
              <h2 className="text-2xl font-bold">Starkids Podcast</h2>
              <p>Em breve...</p>
            </div>
          </div>
        ) : <div className="flex justify-center items-center h-full text-slate-400">Acesso restrito</div>)}
      </main>
      <Footer />
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: string }> = ({ active, onClick, icon, label, color }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 transform ${active
      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/30 scale-105'
      : 'text-slate-600 hover:bg-slate-100 hover:shadow-md hover:scale-102'
      }`}
  >
    <div className="transition-all duration-300">
      {icon}
    </div>
    <span className="text-sm font-semibold whitespace-nowrap">
      {label}
    </span>
  </button>
);

const MobileNavButton: React.FC<{ active: boolean, onClick: () => void, label: string, icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-colors ${active ? 'bg-sky-50 text-sky-600 font-bold' : 'text-slate-500 hover:bg-slate-50'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;
