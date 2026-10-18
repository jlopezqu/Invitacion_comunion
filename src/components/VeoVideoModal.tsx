/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Video,
  Sparkles,
  Download,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { playAngelicChime, playSacredBell } from './CelestialAudio.ts';

interface VeoVideoModalProps {
  onClose: () => void;
}

export const VeoVideoModal: React.FC<VeoVideoModalProps> = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '16:9'>('9:16');
  const [prompt, setPrompt] = useState<string>(
    'Luz divina celestial y destellos dorados con pétalos de rosas blancas flotando en una suave brisa reverente, ambiente emotivo y sagrado de Primera Comunión.'
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('Iniciando...');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const SUGGESTED_PROMPTS = [
    'Luz divina celestial y destellos dorados con pétalos de rosas blancas flotando en una suave brisa reverente, ambiente emotivo y sagrado de Primera Comunión.',
    'Resplandor dorado radiante en templo colonial con sutil efecto cinematográfico y aura luminosa de paz.',
    'Brisa angelical suave, destellos dorados celestiales y palomas de paz volando en cámara lenta con suave haz de luz solar.',
  ];

  // Uplifting loading messages
  useEffect(() => {
    if (!isGenerating) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => {
        const next = prev + 1;
        if (next < 10) {
          setCurrentStepText('Conectando con Veo AI y procesando la imagen...');
        } else if (next < 25) {
          setCurrentStepText('Generando movimiento cinematográfico y rayos de luz divina...');
        } else if (next < 45) {
          setCurrentStepText('Añadiendo partículas doradas sagradas y ambiente celestial...');
        } else if (next < 70) {
          setCurrentStepText('Optimizando fotogramas y texturas de alta fidelidad...');
        } else {
          setCurrentStepText('Finalizando el renderizado sagrado del video...');
        }
        return next;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isGenerating]);

  // Handle Photo Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImage(reader.result);
        playAngelicChime();
      }
    };
    reader.readAsDataURL(file);
  };

  // Start Video Generation Flow
  const handleGenerate = async () => {
    if (!selectedImage && !prompt.trim()) {
      setErrorMessage('Por favor sube una foto o escribe una descripción para el video.');
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setGeneratedVideoUrl(null);
    playSacredBell(440);

    try {
      // Step 1: POST /api/generate-video
      const startRes = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          imageBytes: selectedImage,
          mimeType: imageMimeType,
          aspectRatio: aspectRatio,
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok || !startData.operationName) {
        throw new Error(startData.error || 'No se pudo iniciar la generación del video');
      }

      const operationName = startData.operationName;

      // Step 2: Poll /api/video-status every 5 seconds
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 60; // 5 mins max

      while (!isDone && attempts < maxAttempts) {
        attempts++;
        await new Promise((r) => setTimeout(r, 5000));

        const statusRes = await fetch('/api/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        const statusData = await statusRes.json();
        if (statusData.error) {
          throw new Error(
            typeof statusData.error === 'string'
              ? statusData.error
              : statusData.error.message || 'Error durante la generación de video'
          );
        }

        if (statusData.done) {
          isDone = true;
          break;
        }
      }

      if (!isDone) {
        throw new Error('La generación de video tardó más de lo esperado. Por favor intenta de nuevo.');
      }

      // Step 3: Download video blob via POST /api/video-download
      setCurrentStepText('Descargando el video generado...');
      const downloadRes = await fetch('/api/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!downloadRes.ok) {
        const errorData = await downloadRes.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al descargar el video');
      }

      const videoBlob = await downloadRes.blob();
      const videoObjectUrl = URL.createObjectURL(videoBlob);
      setGeneratedVideoUrl(videoObjectUrl);
      playSacredBell(520);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Error inesperado al generar video';
      setErrorMessage(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#FCFAF5] rounded-2xl border-2 border-[#D4AF37]/60 shadow-2xl p-5 sm:p-7 overflow-hidden my-6">
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#F3E8CE] text-[#7A5B1A] transition-colors"
          aria-label="Cerrar modal de video"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-[#E5C378]/40">
          <div className="p-2.5 rounded-xl bg-[#FAF2DA] text-[#9E7824] border border-[#E5C378]/50">
            <Video size={24} />
          </div>
          <div>
            <span className="font-cinzel text-xs font-bold text-[#9E7824] uppercase tracking-wider block">
              Generación de Video IA (Veo 3.1)
            </span>
            <h2 className="font-cinzel text-xl font-bold text-[#634812]">
              Animar Foto en Video Sagrado
            </h2>
          </div>
        </div>

        {/* CONTENT */}
        {!generatedVideoUrl ? (
          <div className="space-y-5">
            {/* 1. PHOTO UPLOADER */}
            <div>
              <label className="block text-xs font-cinzel uppercase text-[#805910] font-bold tracking-wider mb-2">
                1. Selecciona o sube una foto (Adrián & Gelmun, familia o templo)
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedImage ? (
                <div className="relative w-full max-w-sm mx-auto rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-md group">
                  <img
                    src={selectedImage}
                    alt="Foto seleccionada"
                    className="w-full h-48 sm:h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-white/90 text-xs font-semibold text-[#634812] hover:bg-white"
                    >
                      Cambiar foto
                    </button>
                    <button
                      onClick={() => setSelectedImage(null)}
                      className="px-3 py-1.5 rounded-lg bg-red-600/90 text-xs font-semibold text-white hover:bg-red-700"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-8 px-4 rounded-xl border-2 border-dashed border-[#D4AF37]/60 bg-[#FAF6EC] hover:bg-[#F6EEDC] cursor-pointer transition-all flex flex-col items-center justify-center text-center group"
                >
                  <div className="p-3 rounded-full bg-white text-[#9E7824] shadow-xs group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                  </div>
                  <span className="mt-2 text-sm font-semibold font-cinzel text-[#7E5C14]">
                    Toca para subir una fotografía
                  </span>
                  <span className="text-xs text-[#8A7963] mt-1 font-garamond">
                    PNG, JPG o WEBP (los rostros y detalles se animarán con luz celestial)
                  </span>
                </div>
              )}
            </div>

            {/* 2. ASPECT RATIO SELECTOR */}
            <div>
              <label className="block text-xs font-cinzel uppercase text-[#805910] font-bold tracking-wider mb-2">
                2. Formato del video (Aspect Ratio)
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => setAspectRatio('9:16')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    aspectRatio === '9:16'
                      ? 'border-[#D4AF37] bg-[#FAF2DA] shadow-sm text-[#634812] ring-2 ring-[#D4AF37]/40'
                      : 'border-[#E5C378]/40 bg-white text-[#8A7963] hover:bg-[#FAF6EC]'
                  }`}
                >
                  <span className="font-bold text-xs uppercase font-cinzel">9:16 Vertical</span>
                  <span className="text-[11px] text-[#7F7159]">Estados WhatsApp / Reels</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAspectRatio('16:9')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    aspectRatio === '16:9'
                      ? 'border-[#D4AF37] bg-[#FAF2DA] shadow-sm text-[#634812] ring-2 ring-[#D4AF37]/40'
                      : 'border-[#E5C378]/40 bg-white text-[#8A7963] hover:bg-[#FAF6EC]'
                  }`}
                >
                  <span className="font-bold text-xs uppercase font-cinzel">16:9 Horizontal</span>
                  <span className="text-[11px] text-[#7F7159]">Pantalla completa / TV</span>
                </button>
              </div>
            </div>

            {/* 3. PROMPT & PRESETS */}
            <div>
              <label className="block text-xs font-cinzel uppercase text-[#805910] font-bold tracking-wider mb-1.5">
                3. Efecto o atmósfera sagrada deseada
              </label>

              {/* Suggestions Chips */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SUGGESTED_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPrompt(p)}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-[#E5C378]/60 text-[#7A5B1A] hover:bg-[#FAF2DA] transition-colors text-left truncate max-w-full"
                  >
                    ✨ {p.slice(0, 52)}...
                  </button>
                ))}
              </div>

              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={3}
                placeholder="Describe la atmósfera celestial, destellos o partículas..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#D4AF37]/60 bg-white text-[#4A3B1C] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              />
            </div>

            {/* ERROR DISPLAY */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs flex items-start gap-2">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <div className="flex-1">
                  <span className="font-semibold block">Aviso sobre la generación:</span>
                  <span>{errorMessage}</span>
                </div>
              </div>
            )}

            {/* GENERATING SCREEN */}
            {isGenerating ? (
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#FAF4E2] to-[#F5ECCF] border border-[#D4AF37] text-center space-y-3">
                <div className="inline-flex p-3 rounded-full bg-white text-[#9E7824] shadow-sm animate-spin">
                  <RefreshCw size={26} />
                </div>
                <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#634812]">
                  Generando Video Sagrado con Veo 3.1
                </h4>
                <p className="text-xs text-[#7A5B1A] font-garamond italic">
                  {currentStepText}
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-white/80 text-xs font-mono font-semibold text-[#8A661F]">
                  Tiempo transcurrido: {elapsedSeconds}s
                </div>
                <p className="text-[11px] text-[#8F7D65] max-w-md mx-auto">
                  La síntesis de video con Veo toma aproximadamente entre 30 y 90 segundos. Por favor no cierres esta ventana.
                </p>
              </div>
            ) : (
              <button
                onClick={handleGenerate}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D08D] to-[#B8860B] text-[#3D2C0A] font-cinzel font-bold text-sm uppercase tracking-widest shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                <span>Generar Video con Veo AI</span>
              </button>
            )}
          </div>
        ) : (
          /* GENERATED VIDEO SUCCESS VIEW */
          <div className="space-y-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              <CheckCircle size={15} />
              <span>¡Video sagrado generado con éxito con Veo!</span>
            </div>

            <div className="relative max-w-sm mx-auto rounded-xl overflow-hidden border-2 border-[#D4AF37] shadow-xl bg-black">
              <video
                src={generatedVideoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-auto max-h-[460px] object-contain"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <a
                href={generatedVideoUrl}
                download="primera-comunion-veo-adrian-gelmun.mp4"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white font-cinzel font-bold text-xs uppercase tracking-wider shadow-md hover:brightness-105 transition-all"
              >
                <Download size={16} />
                Descargar Video MP4
              </a>

              <button
                onClick={() => {
                  setGeneratedVideoUrl(null);
                  setSelectedImage(null);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white border border-[#D4AF37] text-[#7A5B1A] font-medium text-xs hover:bg-[#FAF4E2] transition-all"
              >
                <RotateCcw size={15} />
                Crear otro video
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
