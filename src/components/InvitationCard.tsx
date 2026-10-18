/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Heart,
  Send,
  CalendarPlus,
  Share2,
  Sparkles,
  Navigation,
  Volume2,
  VolumeX,
  Download,
  RefreshCw,
} from 'lucide-react';
import {
  HolyChaliceIcon,
  HolyDoveIcon,
  OrnateCrossIcon,
  WheatAndVineIcon,
  CornerFiligree,
} from './LiturgicalIcons.tsx';
import {
  calculateCountdown,
  generateGoogleCalendarUrl,
  generateIcsContent,
  generateWhatsAppRsvpUrl,
  getChurchMapsUrl,
  generateCompleteWhatsAppInvitationText,
  generateCompleteShareWhatsAppUrl,
  COMMUNION_EVENT,
  RSVP_PHONE_DISPLAY,
  RSVP_PHONE_NATIONAL,
} from '../utils/invitation.ts';
import { generateInvitationGifBlob } from '../utils/gifRenderer.ts';
import {
  playSacredBell,
  playAngelicChime,
  setAudioMuted,
  getAudioMuted,
} from './CelestialAudio.ts';

interface InvitationCardProps {
  guestName?: string;
  onOpenGifGenerator?: () => void;
  onOpenVeoModal?: () => void;
}

export const InvitationCard: React.FC<InvitationCardProps> = ({
  guestName = '',
  onOpenGifGenerator,
  onOpenVeoModal,
}) => {
  const [currentGuest, setCurrentGuest] = useState(guestName);
  const [isEditingGuest, setIsEditingGuest] = useState(false);
  const [targetDate] = useState(() => new Date('2026-12-08T12:00:00-05:00'));
  const [countdown, setCountdown] = useState(() => calculateCountdown(targetDate));
  const [isMuted, setIsMutedState] = useState(getAudioMuted());
  const [copiedLink, setCopiedLink] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isPreparingGif, setIsPreparingGif] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMutedState(nextMuted);
    setAudioMuted(nextMuted);
    if (!nextMuted) {
      playSacredBell();
    }
  };

  const handleDownloadIcs = () => {
    playSacredBell(520);
    const icsData = generateIcsContent(COMMUNION_EVENT);
    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'primera-comunion-adrian-gelmun.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareOrCopyLink = () => {
    playAngelicChime();
    setShowShareModal(true);
  };

  const handleShareGifAndTextToWhatsApp = async () => {
    if (isPreparingGif) return;
    setIsPreparingGif(true);
    playSacredBell(480);

    try {
      const gifBlob = await generateInvitationGifBlob();
      const fullText = generateCompleteWhatsAppInvitationText(currentGuest);
      const gifFile = new File(
        [gifBlob],
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
            title: 'Primera Comunión de Adrián Guillermo y Gelmun Augusto',
            text: fullText,
          });
          setIsPreparingGif(false);
          return;
        } catch {
          // Proceed to fallback if cancelled
        }
      }

      // Fallback: download the GIF and open WhatsApp with the full formatted invitation text
      const url = URL.createObjectURL(gifBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invitacion-primera-comunion-adrian-gelmun.gif';
      a.click();

      window.open(generateCompleteShareWhatsAppUrl(currentGuest), '_blank');
    } catch (err) {
      console.error(err);
      window.open(generateCompleteShareWhatsAppUrl(currentGuest), '_blank');
    } finally {
      setIsPreparingGif(false);
    }
  };

  const handleDownloadDirectGif = async () => {
    if (isPreparingGif) return;
    setIsPreparingGif(true);
    playSacredBell(480);
    try {
      const gifBlob = await generateInvitationGifBlob();
      const url = URL.createObjectURL(gifBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'invitacion-primera-comunion-adrian-gelmun.gif';
      a.click();
    } finally {
      setIsPreparingGif(false);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto my-4 transition-all duration-300">
      {/* Main Sacred Card Container */}
      <article
        id="communion-invitation-card"
        className="relative bg-card-parchment rounded-2xl p-6 sm:p-10 shadow-2xl border-2 border-[#D4AF37]/50 overflow-hidden text-center"
        style={{
          boxShadow: '0 20px 45px -15px rgba(181, 138, 54, 0.25), 0 0 0 1px rgba(212, 175, 55, 0.3)',
        }}
      >
        {/* Subtle Watermark Texture / Radiant Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#AA7A1E 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ornate corner filigrees */}
        <CornerFiligree position="top-left" className="top-2 left-2" />
        <CornerFiligree position="top-right" className="top-2 right-2" />
        <CornerFiligree position="bottom-left" className="bottom-2 left-2" />
        <CornerFiligree position="bottom-right" className="bottom-2 right-2" />

        {/* Inner Gold Inset Border */}
        <div className="absolute inset-3 sm:inset-4 rounded-xl border border-[#D4AF37]/35 pointer-events-none" />
        <div className="absolute inset-4 sm:inset-5 rounded-lg border border-[#E5C378]/20 pointer-events-none" />

        {/* Floating Sacred Particles / Sparkles in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <span className="absolute top-16 left-12 w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-ping opacity-60" />
          <span className="absolute top-28 right-16 w-1 h-1 rounded-full bg-[#E5C378] animate-pulse opacity-70" />
          <span className="absolute bottom-24 left-16 w-2 h-2 rounded-full bg-[#E5C378]/40 animate-divine" />
          <span className="absolute bottom-40 right-12 w-1.5 h-1.5 rounded-full bg-[#E5C378] animate-ping opacity-50" />
        </div>

        {/* HEADER: Liturgical Emblems */}
        <div className="relative z-10 flex flex-col items-center justify-center pt-2 pb-4">
          <div className="relative group cursor-pointer" onClick={() => playAngelicChime()}>
            {/* Glowing aura around chalice */}
            <div className="absolute -inset-2 bg-gradient-to-r from-[#FDE8B3]/40 via-[#FDF3D8]/60 to-[#FDE8B3]/40 rounded-full blur-md animate-divine" />
            <HolyChaliceIcon size={76} className="relative z-10 drop-shadow-sm transition-transform duration-300 group-hover:scale-105" />
          </div>

          <WheatAndVineIcon size={96} className="mt-1 opacity-90" />

          {/* Heading */}
          <span className="inline-block mt-3 px-4 py-1 text-xs tracking-[0.25em] font-cinzel text-[#8A661F] uppercase font-semibold border-b border-[#D4AF37]/40">
            Sacramento de la Eucaristía
          </span>

          <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-garamond font-semibold tracking-wide text-gold-foil leading-tight">
            ¡Un día muy especial para nuestra familia!
          </h1>
        </div>

        {/* Personalization Banner (Optional Guest Greeting) */}
        <div className="relative z-10 mb-4">
          {isEditingGuest ? (
            <div className="flex items-center justify-center gap-2 max-w-sm mx-auto">
              <input
                type="text"
                value={currentGuest}
                onChange={(e) => setCurrentGuest(e.target.value)}
                placeholder="Ej. Familia Rodríguez o Queridos Padrinos"
                className="w-full text-center text-sm px-3 py-1.5 rounded-lg border border-[#D4AF37] bg-white/90 text-[#4A3B1C] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              />
              <button
                onClick={() => setIsEditingGuest(false)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#D4AF37] text-white hover:bg-[#B8860B] transition-colors"
              >
                Listo
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingGuest(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF3DE]/70 border border-[#E5C378]/50 text-xs text-[#8A661F] cursor-pointer hover:bg-[#FAF3DE] transition-all"
              title="Haz clic para personalizar el nombre del invitado"
            >
              <Sparkles size={12} className="text-[#B8860B]" />
              <span>
                {currentGuest.trim() ? `Para: ${currentGuest}` : 'Personalizar nombre de invitado'}
              </span>
            </div>
          )}
        </div>

        {/* INVITATION INTRO TEXT */}
        <div className="relative z-10 space-y-4 px-2 sm:px-6">
          <p className="font-garamond text-base sm:text-lg text-[#554937] leading-relaxed italic">
            Con el corazón lleno de alegría y gratitud con Dios, queremos invitarte a compartir con nosotros la Primera Comunión de:
          </p>

          {/* Children's Names */}
          <div className="py-2.5 my-2 border-y border-[#E5C378]/40 bg-gradient-to-r from-transparent via-[#FBF7EC] to-transparent">
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-gold-foil tracking-wide uppercase drop-shadow-sm">
              Adrián Guillermo
            </h2>
            <div className="flex items-center justify-center gap-3 my-1">
              <span className="h-[1px] w-12 bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="font-script text-2xl sm:text-3xl text-[#9E7824]">y</span>
              <span className="h-[1px] w-12 bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-gold-foil tracking-wide uppercase drop-shadow-sm">
              Gelmun Augusto
            </h2>
            <p className="font-cinzel text-sm sm:text-base tracking-[0.2em] text-[#7A5B1A] font-semibold mt-1">
              LÓPEZ BERNAL
            </p>
          </div>

          {/* Spiritual Reflection */}
          <p className="font-garamond text-base sm:text-lg text-[#4A3E2D] leading-relaxed font-normal">
            Será un momento único, en el que recibirán por primera vez a Jesús en su corazón, y nos haría muy felices que los acompañes en este paso tan importante de su vida.
          </p>
        </div>

        {/* LITURGICAL CEREMONY DETAILS BADGE */}
        <div className="relative z-10 my-6 mx-auto max-w-lg rounded-xl p-5 bg-gradient-to-b from-[#FFFDF9] to-[#FBF8EF] border border-[#D4AF37]/50 shadow-md">
          <div className="flex items-center justify-center gap-2 mb-3">
            <OrnateCrossIcon size={24} />
            <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#7E5C14] tracking-widest uppercase">
              Celebración Eucarística
            </h3>
            <OrnateCrossIcon size={24} />
          </div>

          <div className="space-y-3.5 text-left divide-y divide-[#EADDC2]/60">
            {/* Date */}
            <div className="flex items-center gap-3 pt-1">
              <div className="p-2 rounded-lg bg-[#FAF3DE] text-[#9E7824] border border-[#E5C378]/50">
                <Calendar size={20} />
              </div>
              <div>
                <span className="block text-xs font-cinzel uppercase text-[#8F6A1E] font-semibold">Fecha</span>
                <span className="font-garamond text-lg font-semibold text-[#3A3121]">
                  Martes 8 de diciembre de 2026
                </span>
                <span className="block text-xs text-[#7F7159] italic">
                  Solemnidad de la Inmaculada Concepción
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3 pt-3">
              <div className="p-2 rounded-lg bg-[#FAF3DE] text-[#9E7824] border border-[#E5C378]/50">
                <Clock size={20} />
              </div>
              <div>
                <span className="block text-xs font-cinzel uppercase text-[#8F6A1E] font-semibold">Hora</span>
                <span className="font-garamond text-lg font-semibold text-[#3A3121]">
                  12:00 m. (Mediodía)
                </span>
              </div>
            </div>

            {/* Church Location */}
            <div className="flex items-start gap-3 pt-3">
              <div className="p-2 rounded-lg bg-[#FAF3DE] text-[#9E7824] border border-[#E5C378]/50 mt-0.5">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                <span className="block text-xs font-cinzel uppercase text-[#8F6A1E] font-semibold">Templo Parroquial</span>
                <span className="font-garamond text-lg font-semibold text-[#3A3121] block">
                  Parroquia de San Pedro Apóstol
                </span>
                <span className="block text-sm text-[#665742]">
                  Chiquiza, Boyacá, Colombia
                </span>
                <a
                  href={getChurchMapsUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-1 text-xs text-[#9E7824] hover:text-[#5E430B] font-semibold underline underline-offset-2"
                >
                  <Navigation size={12} />
                  Ver ubicación en Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* RECEPTION NOTE & CLOSING */}
        <div className="relative z-10 px-2 sm:px-6 space-y-4">
          <div className="p-4 rounded-xl bg-[#FAF6EC]/80 border border-[#E5C378]/40">
            <div className="flex items-center justify-center gap-2 mb-1 text-[#9E7824]">
              <Heart size={16} className="fill-[#9E7824]/20" />
              <span className="font-cinzel text-xs uppercase tracking-wider font-bold">Recepción</span>
            </div>
            <p className="font-garamond text-base sm:text-lg text-[#4E412F] leading-relaxed">
              Al terminar la misa, nos encantaría que nos acompañes a una comida en casa para seguir celebrando juntos en un ambiente de familia.
            </p>
          </div>

          <p className="font-garamond text-base sm:text-lg font-medium text-[#443828] italic leading-relaxed pt-1">
            Tu compañía y tus oraciones harán este día aún más bonito. ¡Te esperamos con mucho cariño!
          </p>

          {/* Holy Dove Emblem */}
          <div className="pt-2 flex justify-center">
            <HolyDoveIcon size={46} className="opacity-80" />
          </div>
        </div>

        {/* REAL-TIME COUNTDOWN */}
        <div className="relative z-10 mt-8 pt-5 border-t border-[#E5C378]/40">
          <span className="block font-cinzel text-xs uppercase tracking-[0.2em] text-[#8F6A1E] mb-2 font-semibold">
            Cuenta Regresiva para el Gran Día
          </span>
          <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
            <div className="p-2 sm:p-2.5 rounded-lg bg-white/80 border border-[#E5C378]/40 shadow-xs">
              <span className="block text-xl sm:text-2xl font-bold font-cinzel text-[#8A661F]">
                {countdown.days}
              </span>
              <span className="text-[10px] sm:text-xs text-[#7A6E59] uppercase font-medium">Días</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-white/80 border border-[#E5C378]/40 shadow-xs">
              <span className="block text-xl sm:text-2xl font-bold font-cinzel text-[#8A661F]">
                {countdown.hours}
              </span>
              <span className="text-[10px] sm:text-xs text-[#7A6E59] uppercase font-medium">Horas</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-white/80 border border-[#E5C378]/40 shadow-xs">
              <span className="block text-xl sm:text-2xl font-bold font-cinzel text-[#8A661F]">
                {countdown.minutes}
              </span>
              <span className="text-[10px] sm:text-xs text-[#7A6E59] uppercase font-medium">Min</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-lg bg-white/80 border border-[#E5C378]/40 shadow-xs">
              <span className="block text-xl sm:text-2xl font-bold font-cinzel text-[#8A661F]">
                {countdown.seconds}
              </span>
              <span className="text-[10px] sm:text-xs text-[#7A6E59] uppercase font-medium">Seg</span>
            </div>
          </div>
        </div>

        {/* PRIMARY ACTIONS & SHARING BUTTONS */}
        <div className="relative z-10 mt-8 flex flex-col items-center justify-center gap-2">
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* WhatsApp RSVP */}
            <a
              href={generateWhatsAppRsvpUrl(currentGuest, true, 2)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playSacredBell(480)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-medium text-sm shadow-md hover:shadow-lg hover:brightness-105 transition-all"
            >
              <Send size={16} />
              Confirmar Asistencia por WhatsApp
            </a>

            {/* Add to Calendar */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={generateGoogleCalendarUrl(COMMUNION_EVENT)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playSacredBell(500)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white border border-[#D4AF37]/60 text-[#8C6819] font-medium text-sm hover:bg-[#FDF9EE] transition-all shadow-xs"
              >
                <CalendarPlus size={16} />
                Google Calendar
              </a>
              <button
                onClick={handleDownloadIcs}
                title="Descargar para Apple / Outlook Calendar (.ics)"
                className="p-3 rounded-xl bg-white border border-[#D4AF37]/60 text-[#8C6819] hover:bg-[#FDF9EE] transition-all shadow-xs text-xs font-semibold"
              >
                .ICS
              </button>
            </div>
          </div>

          {/* Direct Phone Number Indicator */}
          <div className="inline-flex items-center gap-1.5 text-xs text-[#7A6643] pt-1">
            <span>WhatsApp para confirmación:</span>
            <a
              href={`https://wa.me/573214386084`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold font-mono text-[#1E7E34] hover:underline"
            >
              {RSVP_PHONE_NATIONAL}
            </a>
            <span className="text-[11px] text-[#9E8E75]">({RSVP_PHONE_DISPLAY})</span>
          </div>
        </div>

        {/* SECONDARY ROW: Quick utilities */}
        <div className="relative z-10 mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs">
          <button
            onClick={handleShareOrCopyLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold bg-[#E8F8EE] text-[#146C32] border border-[#25D366]/40 hover:bg-[#D5F2E0] transition-colors"
          >
            <Share2 size={14} />
            <span>Compartir Invitación a Invitados</span>
          </button>

          {onOpenGifGenerator && (
            <button
              onClick={onOpenGifGenerator}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold bg-[#F5ECDB] text-[#7A5B1A] hover:bg-[#EADDC2] transition-colors"
            >
              <Sparkles size={14} className="text-[#B8860B]" />
              <span>Exportar GIF Animado</span>
            </button>
          )}

          {onOpenVeoModal && (
            <button
              onClick={onOpenVeoModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold bg-[#FAF1D6] text-[#805910] hover:bg-[#F5E6BF] transition-colors border border-[#E5C378]/60"
            >
              <span>Animar con Veo AI 🎬</span>
            </button>
          )}
        </div>
      </article>

      {/* MODAL PARA ENVIAR LA INVITACIÓN SIN ERRORES DE ENLACE */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#FCFAF5] rounded-2xl border-2 border-[#D4AF37] shadow-2xl p-6 text-center space-y-4 animate-fadeIn">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-[#F3E8CE] text-[#7A5B1A]"
              aria-label="Cerrar modal"
            >
              ✕
            </button>

            <div className="inline-flex p-3 rounded-full bg-[#FAF2DA] text-[#9E7824] border border-[#E5C378]/60">
              <Share2 size={24} />
            </div>

            <div>
              <h3 className="font-cinzel text-lg font-bold text-[#6D4E12]">
                Enviar Invitación a tus Invitados
              </h3>
              <p className="text-xs text-[#7A6E59] font-garamond mt-1">
                Envía directamente la tarjeta animada GIF + todos los datos, ubicación en Google Maps y botón de confirmación al WhatsApp <strong>321 438 6084</strong> (sin enlaces externos ni errores 403/404).
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              {/* Opción 1: Enviar GIF + Texto nativo */}
              <button
                onClick={handleShareGifAndTextToWhatsApp}
                disabled={isPreparingGif}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:brightness-105 transition-all disabled:opacity-60"
              >
                {isPreparingGif ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Preparando tarjeta GIF animada...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Enviar Tarjeta GIF + Texto por WhatsApp</span>
                  </>
                )}
              </button>

              {/* Opción 2: Enviar solo el mensaje completo formateado por WhatsApp */}
              <a
                href={generateCompleteShareWhatsAppUrl(currentGuest)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#FAF2DA] hover:bg-[#F3E5BE] border border-[#D4AF37] text-[#634812] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 size={15} />
                <span>Enviar Invitación en Texto Completo por WhatsApp</span>
              </a>

              {/* Opción 3: Descargar el archivo .GIF directamente */}
              <button
                onClick={handleDownloadDirectGif}
                disabled={isPreparingGif}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-[#FAF6EC] border border-[#D4AF37]/60 text-[#7A5B1A] font-medium text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={15} />
                <span>Descargar Archivo .GIF en mi Teléfono</span>
              </button>

              {/* Opción 4: Copiar el texto completo de la invitación */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    generateCompleteWhatsAppInvitationText(currentGuest)
                  );
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2500);
                }}
                className="w-full py-2 px-3 rounded-lg text-xs text-[#8A661F] hover:bg-[#FAF4E2] font-medium transition-colors"
              >
                {copiedLink
                  ? '✓ ¡Texto completo copiado al portapapeles!'
                  : 'Copiar texto completo de la invitación'}
              </button>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-1.5 text-xs text-[#8A7963] hover:text-[#5E430B]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
