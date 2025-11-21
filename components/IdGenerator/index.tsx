import React, { useState, useRef } from 'react';
import { Camera, Download, Music, User, Link as LinkIcon, Award } from 'lucide-react';
import html2canvas from 'html2canvas';

type Instrument = 'Piano' | 'Violão' | 'Ukulele' | 'Bateria' | 'Canto';
type Level = 'Iniciante' | 'Intermediário' | 'Avançado' | 'Star';

export const IdGenerator: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [instrument, setInstrument] = useState<Instrument>('Violão');
  const [level, setLevel] = useState<Level>('Iniciante');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [qrLink, setQrLink] = useState<string>('https://starkids.music');
  const [isGenerating, setIsGenerating] = useState(false);

  const badgeRef = useRef<HTMLDivElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setPhotoUrl(url);
    }
  };

  const handleDownload = async () => {
    if (!badgeRef.current) return;
    setIsGenerating(true);

    try {
      const canvas = await html2canvas(badgeRef.current, {
        scale: 3, // High resolution for printing
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });

      const link = document.createElement('a');
      link.download = `Carteirinha_${name.replace(/\s+/g, '_') || 'Starkids'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Erro ao gerar imagem:", err);
      alert("Erro ao gerar a imagem. Tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Visual helper for instrument icon
  const getInstrumentEmoji = (inst: Instrument) => {
    switch (inst) {
      case 'Piano': return '🎹';
      case 'Violão': return '🎸';
      case 'Ukulele': return '🌴';
      case 'Bateria': return '🥁';
      case 'Canto': return '🎤';
      default: return '🎵';
    }
  };

  // Visual helper for level color
  const getLevelColor = (lvl: Level) => {
    switch (lvl) {
      case 'Iniciante': return 'bg-starkids-green';
      case 'Intermediário': return 'bg-starkids-blue';
      case 'Avançado': return 'bg-starkids-purple';
      case 'Star': return 'bg-starkids-orange';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-6xl mx-auto pt-32">

      {/* --- LEFT PANEL: INPUTS --- */}
      <div className="w-full lg:w-1/3 bg-white p-6 md:p-8 rounded-[30px] shadow-xl border-4 border-white">
        <h2 className="font-lobster text-3xl text-starkids-darkBlue mb-6 flex items-center gap-2 text-sky-600">
          <User className="w-8 h-8" />
          Dados do Aluno
        </h2>

        <div className="space-y-5 font-poppins">
          {/* Name Input */}
          <div>
            <label className="block text-sky-600 font-semibold mb-2 text-sm uppercase tracking-wide">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Sofia Martins"
              className="w-full px-4 py-3 rounded-xl border-2 border-sky-200 bg-sky-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-lg text-slate-700 placeholder-sky-300"
            />
          </div>

          {/* Instrument & Level Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sky-600 font-semibold mb-2 text-sm uppercase tracking-wide">Instrumento</label>
              <div className="relative">
                <select
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value as Instrument)}
                  className="w-full appearance-none px-4 py-3 rounded-xl border-2 border-sky-200 bg-sky-50 focus:border-sky-500 outline-none text-gray-700 cursor-pointer"
                >
                  <option value="Violão">Violão</option>
                  <option value="Piano">Piano</option>
                  <option value="Ukulele">Ukulele</option>
                  <option value="Bateria">Bateria</option>
                  <option value="Canto">Canto</option>
                </select>
                <Music className="absolute right-3 top-3.5 w-5 h-5 text-sky-500 pointer-events-none opacity-50" />
              </div>
            </div>

            <div>
              <label className="block text-sky-600 font-semibold mb-2 text-sm uppercase tracking-wide">Nível</label>
              <div className="relative">
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as Level)}
                  className="w-full appearance-none px-4 py-3 rounded-xl border-2 border-sky-200 bg-sky-50 focus:border-sky-500 outline-none text-gray-700 cursor-pointer"
                >
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Interm.</option>
                  <option value="Avançado">Avançado</option>
                  <option value="Star">Star</option>
                </select>
                <Award className="absolute right-3 top-3.5 w-5 h-5 text-sky-500 pointer-events-none opacity-50" />
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sky-600 font-semibold mb-2 text-sm uppercase tracking-wide">Foto do Aluno</label>
            <div className="relative group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="w-full h-32 rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 flex flex-col items-center justify-center group-hover:bg-sky-100 transition-colors">
                {photoUrl ? (
                  <div className="flex items-center gap-3">
                    <img src={photoUrl} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                    <span className="text-sky-600 font-medium">Trocar foto</span>
                  </div>
                ) : (
                  <>
                    <Camera className="w-8 h-8 text-sky-400 mb-2" />
                    <span className="text-sky-500 font-medium">Clique para enviar</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* QR Code Link */}
          <div>
            <label className="block text-sky-600 font-semibold mb-2 text-sm uppercase tracking-wide">Link do QR Code</label>
            <div className="relative">
              <input
                type="text"
                value={qrLink}
                onChange={(e) => setQrLink(e.target.value)}
                placeholder="https://..."
                className="w-full px-4 py-3 rounded-xl border-2 border-sky-200 bg-sky-50 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-sm text-gray-600 pl-10"
              />
              <LinkIcon className="absolute left-3 top-3.5 w-5 h-5 text-sky-500 pointer-events-none opacity-50" />
            </div>
            <p className="text-xs text-gray-400 mt-1 ml-1">Deixe vazio para ocultar o QR Code.</p>
          </div>

          {/* Action Button */}
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="w-full mt-4 bg-orange-500 hover:bg-orange-600 text-white font-lobster text-xl py-4 rounded-full shadow-[0_4px_0_#e65100] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <span>Gerando...</span>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Baixar Carteirinha
              </>
            )}
          </button>
        </div>
      </div>

      {/* --- RIGHT PANEL: PREVIEW AREA --- */}
      <div className="w-full lg:w-2/3 flex flex-col items-center">
        <div className="bg-white p-2 rounded-xl shadow-2xl border-4 border-white/50 backdrop-blur-sm inline-block transform hover:scale-[1.01] transition-transform duration-500">

          {/* 
              BADGE CONTAINER
              Credit Card Ratio: 85.6mm x 53.98mm (~1.58 aspect ratio)
              We'll use px dimensions: 600px x 378px
            */}
          <div
            id="badge-capture"
            ref={badgeRef}
            className="relative overflow-hidden shadow-inner"
            style={{
              width: '600px',
              height: '378px',
              borderRadius: '24px'
            }}
          >
            {/* Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#039be5] to-[#8a2be2] z-0"></div>
            <div className="absolute inset-0 bg-stars opacity-30 z-0"></div>

            {/* Decorative Circles */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-400 opacity-20 rounded-full blur-3xl mix-blend-overlay"></div>

            {/* Header Logo */}
            <div className="absolute top-6 left-0 right-0 text-center z-10">
              <div className="font-lobster text-4xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.2)] tracking-wide">
                Starkids Music
              </div>
              <div className="text-white/80 text-xs font-poppins tracking-[0.3em] uppercase text-[10px] mt-1 font-bold">
                Carteira do Estudante
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="absolute top-24 left-8 right-8 bottom-6 flex justify-between items-end z-10">

              {/* Left Column: Photo & Basic Info */}
              <div className="flex flex-col h-full justify-end pb-2">
                {/* Photo Frame - Starburst Effect behind circle */}
                <div className="absolute top-0 left-0">
                  <div className="relative w-32 h-32">
                    {/* Decorative Ring */}
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-pulse opacity-50"></div>

                    {/* Photo Container */}
                    <div className="absolute inset-1 bg-white rounded-full overflow-hidden border-4 border-white shadow-lg">
                      {photoUrl ? (
                        <img src={photoUrl} alt="Aluno" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>

                    {/* Star Badge Icon overlay */}
                    <div className="absolute -bottom-2 -right-2 bg-orange-500 text-white p-2 rounded-full border-2 border-white shadow-md">
                      <Music className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Text Details */}
                <div className="mt-36 ml-2">
                  <h3 className="font-lobster text-4xl text-white drop-shadow-md leading-tight mb-1" style={{ textShadow: '2px 2px 0px #0277bd' }}>
                    {name || 'Nome do Aluno'}
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white font-poppins font-semibold text-sm border border-white/30 flex items-center gap-1 shadow-sm">
                      <span>{getInstrumentEmoji(instrument)}</span>
                      {instrument}
                    </div>

                    <div className={`${getLevelColor(level)} px-3 py-1 rounded-full text-white font-poppins font-semibold text-sm border border-white/20 shadow-sm`}>
                      {level}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: QR & Year */}
              <div className="flex flex-col items-end justify-end h-full pb-2">
                {qrLink && (
                  <div className="bg-white p-2 rounded-xl shadow-lg transform rotate-2 border-2 border-white/80">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&color=0277bd&data=${encodeURIComponent(qrLink)}`}
                      alt="QR Code"
                      className="w-20 h-20 rounded-lg mix-blend-multiply"
                    />
                  </div>
                )}

                <div className="mt-4 text-right">
                  <div className="font-poppins text-white/70 text-[10px] uppercase tracking-widest">Válido até</div>
                  <div className="font-lobster text-2xl text-white drop-shadow-sm">
                    Dez / 2025
                  </div>
                </div>
              </div>

            </div>

            {/* Shine Overlay */}
            <div className="absolute -inset-full top-0 block w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 z-20 left-3/4" />
          </div>
        </div>

        <p className="mt-4 text-sky-800/60 font-poppins text-sm text-center max-w-md">
          💡 A carteirinha é gerada em alta resolução. O preview acima é apenas uma visualização. Clique em "Baixar" para obter o arquivo PNG pronto para impressão.
        </p>
      </div>
    </div>
  );
};
