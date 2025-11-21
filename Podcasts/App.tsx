
import React from 'react';
import VideoGallery from './components/VideoGallery';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-skyStart to-skyEnd py-10 px-4">
      {/* Título Simples */}
      <div className="mb-8 text-center">
        <h1 className="font-lobster text-5xl md:text-6xl text-starkids-darkBlue drop-shadow-[2px_2px_0_#fff]">
          Starkids Studio
        </h1>
      </div>

      {/* Conteúdo Principal */}
      <main className="w-full flex justify-center">
        <VideoGallery />
      </main>

      <footer className="mt-12 text-center font-poppins text-white text-sm opacity-80">
        Design by XANDÃO
      </footer>
    </div>
  );
};

export default App;
