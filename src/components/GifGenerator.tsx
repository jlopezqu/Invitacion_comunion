/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  Sparkles,
  Share2,
  FileImage,
  RefreshCw,
  Video,
  CheckCircle,
  Send,
  X,
} from 'lucide-react';
import { playSacredBell } from './CelestialAudio.ts';
import {
  generateCompleteWhatsAppInvitationText,
  generateCompleteShareWhatsAppUrl,
} from '../utils/invitation.ts';
import {
  GIF_WIDTH,
  GIF_HEIGHT,
  GIF_TOTAL_FRAMES,
  renderInvitationFrame,
  generateInvitationGifBlob,
} from '../utils/gifRenderer.ts';

interface GifGeneratorProps {
  onClose?: () => void;
}

export const GifGenerator: React.FC<GifGeneratorProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedGifBlob, setGeneratedGifBlob] = useState<Blob | null>(null);
  const [generatedGifUrl, setGeneratedGifUrl] = useState<string | null>(null);
  const [generatedGifSize, setGeneratedGifSize] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('Listo para generar GIF');
  const [isRecordingVideo, setIsRecordingVideo] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  // Live Canvas Animation loop
  useEffect(() => {
    let animId: number;
    let startTimestamp: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = (timestamp - startTimestamp) % 1800;
      const frameRatio = elapsed / 1800;

      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          renderInvitationFrame(
            ctx,
            Math.floor(frameRatio * GIF_TOTAL_FRAMES),
            GIF_TOTAL_FRAMES
          );
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Generate Real Animated GIF File
  const handleGenerateGif = async (): Promise<Blob | null> => {
    if (isGenerating) return null;
    setIsGenerating(true);
    setProgress(0);
    setStatusMessage('Iniciando codificación de fotogramas sacros...');
    playSacredBell(440);

    try {
      const blob = await generateInvitationGifBlob((pct, f, total) => {
        setProgress(pct);
        setStatusMessage(`Procesando fotograma ${f} de ${total}...`);
      });

      const url = URL.createObjectURL(blob);
      setGeneratedGifBlob(blob);
      setGeneratedGifUrl(url);
      setGeneratedGifSize((blob.size / (1024 * 1024)).toFixed(2) + ' MB');
      setStatusMessage('¡GIF animado generado exitosamente!');
      playSacredBell(520);
      return blob;
    } catch (err) {
      console.error(err);
      setStatusMessage('Error al codificar el GIF. Intenta de nuevo.');
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  // Share GIF file + complete invitation text directly via native Share Sheet (WhatsApp)
  const handleShareGifDirectToWhatsApp = async () => {
    let blob = generatedGifBlob;
    if (!blob) {
      blob = await handleGenerateGif();
    }
    if (!blob) return;

    const fullText = generateCompleteWhatsAppInvitationText();
    const gifFile = new File(
      [blob],
      'invitacion-primera-comunion-adrian-gelmun.gif',
      { type: 'image/gif' }
    );

    if (
      typeof navigator !== 'undefined' &&
      navigator.share &&
      navigator.canShare &&
      navigator.canShare({ files: [gifFile] })
    ) {
      try {
        await navigator.share({
          files: [gifFile],
          title: 'Primera Comunión - Adrián Guillermo & Gelmun Augusto',
          text: fullText,
        });
        return;
      } catch {
        // Fallback if user cancelled share sheet
      }
    }

    // Fallback: download the GIF file and open WhatsApp with the full invitation text
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invitacion-primera-comunion-adrian-gelmun.gif';
    a.click();

    window.open(generateCompleteShareWhatsAppUrl(), '_blank');
  };

  // Download High-Resolution Static PNG
  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    playSacredBell(480);
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invitacion-primera-comunion-adrian-gelmun.png';
    a.click();
  };

  // Record short MP4/WebM video from canvas
  const handleRecordVideo = async () => {
    if (!canvasRef.current || isRecordingVideo) return;
    setIsRecordingVideo(true);
    setStatusMessage('Grabando bucle de video sagrado...');
    playSacredBell(440);

    try {
      const stream = canvasRef.current.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/mp4')
        ? 'video/mp4'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideoUrl(videoUrl);
        setIsRecordingVideo(false);
        setStatusMessage('¡Video generado listo para descargar!');
      };

      recorder.start();
      setTimeout(() => {
        recorder.stop();
      }, 3600);
    } catch (err) {
      console.error(err);
      setIsRecordingVideo(false);
      setStatusMessage('No se pudo grabar el video en este navegador.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 p-4 sm:p-6 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-[#D4AF37]/50 shadow-2xl">
      {/* Modal/Section Header */}
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5C378]/40">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#FAF4DE] text-[#9E7824]">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#6D4E12]">
              Exportador de Invitación GIF Animada
            </h2>
            <p className="text-xs text-[#7F7159] font-garamond">
              Envía la tarjeta animada directamente por WhatsApp sin enlaces que fallen
            </p>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#F6EEDC] text-[#805910] transition-colors"
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Main Grid: Preview on Left, Controls & Output on Right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* LEFT: Live Canvas Animation */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-cinzel uppercase tracking-wider text-[#8A661F] mb-2 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Previsualización en tiempo real (480 x 680 px)
          </span>

          <div className="relative rounded-xl overflow-hidden shadow-xl border-2 border-[#D4AF37]/60 max-w-[320px] sm:max-w-[360px] w-full aspect-[480/680] bg-[#FAF7EF]">
            <canvas
              ref={canvasRef}
              width={GIF_WIDTH}
              height={GIF_HEIGHT}
              className="w-full h-full object-contain"
            />
          </div>

          <p className="text-[11px] text-[#8A7963] mt-2 font-garamond italic text-center">
            Incluye texto litúrgico completo, cáliz sacro, destello dorado en los nombres y WhatsApp 321 438 6084.
          </p>
        </div>

        {/* RIGHT: Export Actions & Generated GIF Display */}
        <div className="flex flex-col space-y-4">
          <div className="p-4 rounded-xl bg-[#FAF6EC] border border-[#E5C378]/50 space-y-3">
            <h3 className="font-cinzel text-sm font-bold text-[#7E5C14] uppercase tracking-wide">
              Enviar o Descargar Invitación
            </h3>

            {isGenerating && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-[#8A661F] font-medium">
                  <span>{statusMessage}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E8DCBF] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* 1-Click Direct WhatsApp Share (GIF File + Full Text) */}
            <button
              onClick={handleShareGifDirectToWhatsApp}
              disabled={isGenerating}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-cinzel font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send size={18} />
              <span>Enviar GIF + Texto por WhatsApp</span>
            </button>

            {/* Primary Action Button: Generate GIF */}
            <button
              onClick={handleGenerateGif}
              disabled={isGenerating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E8D08D] to-[#B8860B] text-[#3D2C0A] font-cinzel font-bold text-xs sm:text-sm tracking-wider uppercase shadow-sm hover:shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw size={17} className="animate-spin" />
                  <span>Codificando GIF...</span>
                </>
              ) : (
                <>
                  <Sparkles size={17} />
                  <span>Crear y Descargar Archivo .GIF</span>
                </>
              )}
            </button>

            {/* Secondary Buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleDownloadPng}
                className="py-2.5 px-3 rounded-xl bg-white border border-[#D4AF37]/60 text-[#7A5B1A] font-medium text-xs hover:bg-[#FAF4E2] transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <FileImage size={15} />
                <span>Descargar PNG</span>
              </button>

              <button
                onClick={handleRecordVideo}
                disabled={isRecordingVideo}
                className="py-2.5 px-3 rounded-xl bg-white border border-[#D4AF37]/60 text-[#7A5B1A] font-medium text-xs hover:bg-[#FAF4E2] transition-all flex items-center justify-center gap-1.5 shadow-2xs disabled:opacity-50"
              >
                <Video size={15} />
                <span>{isRecordingVideo ? 'Grabando...' : 'Grabar Video MP4'}</span>
              </button>
            </div>
          </div>

          {/* Generated GIF Result Card */}
          {generatedGifUrl && (
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-300 space-y-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-xs uppercase tracking-wide">
                <CheckCircle size={16} />
                <span>¡GIF Listo para Compartir! ({generatedGifSize})</span>
              </div>

              <div className="max-w-[200px] mx-auto rounded-lg overflow-hidden border border-emerald-300 shadow-sm">
                <img
                  src={generatedGifUrl}
                  alt="Invitación Primera Comunión GIF Animado"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <a
                  href={generatedGifUrl}
                  download="invitacion-primera-comunion-adrian-gelmun.gif"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-xs shadow-sm transition-all"
                >
                  <Download size={15} />
                  Guardar Archivo .GIF
                </a>

                <button
                  onClick={handleShareGifDirectToWhatsApp}
                  className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-medium text-xs shadow-sm transition-all"
                >
                  <Share2 size={15} />
                  Enviar a WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* Recorded Video Result */}
          {recordedVideoUrl && (
            <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-300 space-y-3">
              <span className="text-xs font-semibold text-amber-900 block">
                Video grabado desde la tarjeta:
              </span>
              <video
                src={recordedVideoUrl}
                controls
                autoPlay
                loop
                className="w-full max-h-48 rounded-lg border border-amber-300"
              />
              <a
                href={recordedVideoUrl}
                download="invitacion-primera-comunion.mp4"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#805910] text-white text-xs font-medium hover:bg-[#68470B] transition-all"
              >
                <Download size={15} />
                Descargar Video MP4
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
