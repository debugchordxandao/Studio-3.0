import React, { useState, Suspense } from "react";
import { Login } from "./components/Login";
import {
  Music,
  Guitar,
  ListMusic,
  FileMusic,
  Palette,
  Mic,
  Loader2,
  FileText,
} from "lucide-react";
import { STARKIDS_LOGO_URL } from "./constants";

// Lazy load components for better performance
const PianoGenerator = React.lazy(() =>
  import("./components/PianoGenerator").then((module) => ({
    default: module.PianoGenerator,
  }))
);
const ScaleGenerator = React.lazy(() =>
  import("./components/ScaleGenerator").then((module) => ({
    default: module.ScaleGenerator,
  }))
);
const SheetMusicGenerator = React.lazy(() =>
  import("./components/SheetMusicGenerator").then((module) => ({
    default: module.SheetMusicGenerator,
  }))
);
const LessonEditor = React.lazy(() =>
  import("./components/LessonEditor").then((module) => ({
    default: module.LessonEditor,
  }))
);
const GuitarGenerator = React.lazy(() =>
  import("./components/GuitarGenerator").then((module) => ({
    default: module.GuitarGenerator,
  }))
);

enum Tab {
  PIANO = "PIANO",
  GUITAR = "GUITAR",
  SCALES = "SCALES",
  SHEET_MUSIC = "SHEET_MUSIC",
  DESIGN = "DESIGN",
  PODCASTS = "PODCASTS",
  LESSON_EDITOR = "LESSON_EDITOR",
}

const LoadingSpinner = () => (
  <div className="w-full h-[60vh] flex flex-col items-center justify-center text-sky-500">
    <Loader2 className="w-12 h-12 animate-spin mb-4" />
    <p className="font-lobster text-xl">Carregando...</p>
  </div>
);

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.LESSON_EDITOR);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col font-sans text-slate-700 selection:bg-yellow-200">
      {/* Studio Header */}
      <nav className="bg-white/95 backdrop-blur-sm border-b-4 border-sky-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            {/* Brand - Big & Fun */}
            <div
              className="flex items-center gap-4 cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() => window.location.reload()}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-300 rounded-full blur opacity-50 animate-pulse"></div>
                <img
                  src={STARKIDS_LOGO_URL}
                  alt="Starkids Logo"
                  className="relative h-20 w-auto drop-shadow-md"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="font-lobster text-4xl text-sky-500 drop-shadow-sm tracking-wide">
                  Starkids
                </h1>
                <span className="text-xs font-bold tracking-[0.3em] text-yellow-500 uppercase ml-1">
                  Studio
                </span>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2 bg-sky-50 p-2 rounded-2xl border-2 border-sky-100 flex-wrap justify-center">
              <button
                onClick={() => setActiveTab(Tab.LESSON_EDITOR)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl font-lobster text-sm md:text-base transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1 whitespace-nowrap ${activeTab === Tab.LESSON_EDITOR
                  ? "bg-orange-400 border-orange-600 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-400 hover:text-orange-400 hover:border-orange-200"
                  }`}
              >
                <FileText
                  size={18}
                  className={activeTab === Tab.LESSON_EDITOR ? "animate-bounce" : ""}
                />
                Aulas
              </button>

              <button
                onClick={() => setActiveTab(Tab.PIANO)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl font-lobster text-sm md:text-base transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1 whitespace-nowrap ${activeTab === Tab.PIANO
                  ? "bg-sky-400 border-sky-600 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-400 hover:text-sky-400 hover:border-sky-200"
                  }`}
              >
                <Music
                  size={18}
                  className={activeTab === Tab.PIANO ? "animate-bounce" : ""}
                />
                Piano
              </button>

              <button
                onClick={() => setActiveTab(Tab.GUITAR)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl font-lobster text-sm md:text-base transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1 whitespace-nowrap ${activeTab === Tab.GUITAR
                  ? "bg-orange-400 border-orange-600 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-400 hover:text-orange-400 hover:border-orange-200"
                  }`}
              >
                <Guitar
                  size={18}
                  className={activeTab === Tab.GUITAR ? "animate-bounce" : ""}
                />
                Guitarra
              </button>

              <button
                onClick={() => setActiveTab(Tab.SCALES)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl font-lobster text-sm md:text-base transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1 whitespace-nowrap ${activeTab === Tab.SCALES
                  ? "bg-purple-400 border-purple-600 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-400 hover:text-purple-400 hover:border-purple-200"
                  }`}
              >
                <ListMusic
                  size={18}
                  className={activeTab === Tab.SCALES ? "animate-bounce" : ""}
                />
                Escalas
              </button>

              <button
                onClick={() => setActiveTab(Tab.SHEET_MUSIC)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl font-lobster text-sm md:text-base transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1 whitespace-nowrap ${activeTab === Tab.SHEET_MUSIC
                  ? "bg-pink-400 border-pink-600 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-400 hover:text-pink-400 hover:border-pink-200"
                  }`}
              >
                <FileMusic
                  size={18}
                  className={activeTab === Tab.SHEET_MUSIC ? "animate-bounce" : ""}
                />
                Partituras
              </button>

              <button
                onClick={() => setActiveTab(Tab.DESIGN)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl font-lobster text-sm md:text-base transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1 whitespace-nowrap ${activeTab === Tab.DESIGN
                  ? "bg-orange-400 border-orange-600 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-400 hover:text-orange-400 hover:border-orange-200"
                  }`}
              >
                <Palette
                  size={18}
                  className={activeTab === Tab.DESIGN ? "animate-bounce" : ""}
                />
                Design
              </button>

              <button
                onClick={() => setActiveTab(Tab.PODCASTS)}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl font-lobster text-sm md:text-base transition-all duration-200 border-b-4 active:border-b-0 active:translate-y-1 whitespace-nowrap ${activeTab === Tab.PODCASTS
                  ? "bg-indigo-400 border-indigo-600 text-white shadow-lg"
                  : "bg-white border-slate-200 text-slate-400 hover:text-indigo-400 hover:border-indigo-200"
                  }`}
              >
                <Mic
                  size={18}
                  className={activeTab === Tab.PODCASTS ? "animate-bounce" : ""}
                />
                Podcasts
              </button>


            </div>

            {/* Empty div to balance flex layout */}
            <div className="hidden lg:block w-20"></div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow w-full mx-auto p-4 md:p-10 flex flex-col items-center">
        <div className="w-full animate-fade-in-up">
          <Suspense fallback={<LoadingSpinner />}>
            {activeTab === Tab.PIANO && <PianoGenerator />}
            {activeTab === Tab.GUITAR && <GuitarGenerator />}
            {activeTab === Tab.SCALES && <ScaleGenerator />}
            {activeTab === Tab.SHEET_MUSIC && <SheetMusicGenerator />}
            {activeTab === Tab.LESSON_EDITOR && <LessonEditor />}
          </Suspense>
          {activeTab === Tab.DESIGN && (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl p-8 shadow-xl border-4 border-orange-100">
              <img
                src="sleeping_star.png"
                alt="Em desenvolvimento"
                className="h-64 w-auto mb-6"
              />
              <p className="text-xl font-poppins text-slate-500 font-medium">
                Em desenvolvimento...
              </p>
            </div>
          )}
          {activeTab === Tab.PODCASTS && (
            <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl p-8 shadow-xl border-4 border-indigo-100">
              <img
                src="sleeping_star.png"
                alt="Em desenvolvimento"
                className="h-64 w-auto mb-6"
              />
              <p className="text-xl font-poppins text-slate-500 font-medium">
                Em desenvolvimento...
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
