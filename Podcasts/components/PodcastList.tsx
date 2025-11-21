import React from 'react';
import { PODCAST_EPISODES } from '../constants';
import { getDirectDriveLink } from '../utils';

const PodcastList: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 animate-slide-up">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-[50px] shadow-xl border-4 border-white">
        <div className="text-center mb-8">
          <h2 className="font-lobster text-4xl md:text-5xl text-starkids-darkBlue drop-shadow-[2px_2px_0_#fff] mb-2">
            Aulas Gravadas & Podcasts
          </h2>
          <p className="font-poppins text-starkids-blue text-lg">
            Ouça online ou baixe para estudar onde quiser!
          </p>
        </div>

        <div className="space-y-6">
          {PODCAST_EPISODES.map((episode) => {
            const directLink = getDirectDriveLink(episode.driveLink);
            
            return (
              <div 
                key={episode.id} 
                className="bg-skyStart/30 p-6 rounded-[30px] border-2 border-starkids-lightBlue hover:bg-white transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Icon / Visual */}
                  <div className="hidden md:flex shrink-0 w-20 h-20 bg-starkids-purple text-white rounded-full items-center justify-center text-3xl shadow-starkid shadow-purple-800">
                    🎧
                  </div>

                  {/* Content */}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                      <h3 className="font-lobster text-2xl text-starkids-darkBlue">
                        {episode.title}
                      </h3>
                      <span className="font-poppins text-sm bg-starkids-yellow text-starkids-darkBlue px-3 py-1 rounded-full font-semibold shadow-sm">
                        ⏱ {episode.duration}
                      </span>
                    </div>
                    
                    <p className="font-poppins text-gray-600 mb-4 leading-relaxed">
                      {episode.description}
                    </p>

                    {/* Player & Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                      <audio 
                        controls 
                        className="w-full sm:flex-1 h-10 rounded-full shadow-sm focus:outline-none"
                        style={{ 
                          borderRadius: '25px',
                          backgroundColor: '#f1f3f4' 
                        }}
                      >
                        <source src={directLink} type="audio/mpeg" />
                        Seu navegador não suporta o elemento de áudio.
                      </audio>

                      <a 
                        href={directLink} 
                        download 
                        className="font-lobster text-lg px-6 py-2 rounded-full text-white bg-starkids-orange shadow-starkid shadow-starkids-orangeShadow transition-all duration-200 transform hover:-translate-y-1 active:translate-y-1 active:shadow-none flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
                      >
                        ⬇️ Baixar
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="text-center font-poppins text-starkids-darkBlue/80 italic text-sm">
        * Para baixar, clique no botão ou use o menu do player.
      </div>
    </div>
  );
};

export default PodcastList;