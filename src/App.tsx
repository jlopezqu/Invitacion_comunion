/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Video,
  Download,
  Share2,
  Calendar,
  Send,
  MapPin,
  Mail,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { InvitationCard } from './components/InvitationCard.tsx';
import { EnvelopeModal } from './components/EnvelopeModal.tsx';
import { GifGenerator } from './components/GifGenerator.tsx';
import { VeoVideoModal } from './components/VeoVideoModal.tsx';
import {
  HolyChaliceIcon,
  HolyDoveIcon,
  OrnateCrossIcon,
} from './components/LiturgicalIcons.tsx';
import {
  generateWhatsAppRsvpUrl,
  getChurchMapsUrl,
} from './utils/invitation.ts';
import {
  playSacredBell,
  setAudioMuted,
  getAudioMuted,
} from './components/CelestialAudio.ts';

export default function App() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'invitation' | 'gif' | 'veo'>('invitation');
  const [showVeoModal, setShowVeoModal] = useState(false);
  const [isMuted, setIsMutedState] = useState(getAudioMuted());

  // Check URL query params for ?autostart=1 (mandated by ultra-mode / fast testing)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1' || params.get('opened') === '1') {
        setIsEnvelopeOpen(true);
      }
      if (params.get('tab') === 'gif') {
        setActiveTab('gif');
      } else if (params.get('tab') === 'veo') {
        setShowVeoModal(true);
      }
    }
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMutedState(next);
    setAudioMuted(next);
    if (!next) {
      playSacredBell(440);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#3D372E] flex flex-col justify-between selection:bg-[#E5C378]/30 font-garamond">
      {/* TOP LITURGICAL NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#D4AF37]/35 shadow-xs">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2 flex items-center justify-between gap-1.5">
          {/* Brand Emblem */}
          <div
            onClick={() => {
              setActiveTab('invitation');
              playSacredBell(440);
            }}
            className="flex items-center gap-1.5 cursor-pointer group shrink-0"
          >
            <HolyChaliceIcon size={26} className="shrink-0 group-hover:scale-110 transition-transform" />
            <div className="leading-tight">
              <span className="font-cinzel text-[9px] sm:text-[11px] font-bold text-[#8A661F] uppercase tracking-wider block">
                Primera Comunión
              </span>
              <span className="font-script text-sm sm:text-base text-[#61450C] leading-none block">
                Adrián & Gelmun
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => {
                setActiveTab('invitation');
                playSacredBell(480);
              }}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-cinzel font-semibold transition-all ${
                activeTab === 'invitation'
                  ? 'bg-[#FAF2DA] text-[#634812] border border-[#D4AF37]/60 shadow-2xs'
                  : 'text-[#7A6E59] hover:text-[#5E430B] hover:bg-[#F6EEDC]'
              }`}
            >
              Tarjeta
            </button>

            <button
              onClick={() => {
                setActiveTab('gif');
                playSacredBell(500);
              }}
              className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-cinzel font-semibold transition-all flex items-center gap-1 ${
                activeTab === 'gif'
                  ? 'bg-[#FAF2DA] text-[#634812] border border-[#D4AF37]/60 shadow-2xs'
                  : 'text-[#7A6E59] hover:text-[#5E430B] hover:bg-[#F6EEDC]'
              }`}
            >
              <Sparkles size={12} className="text-[#B8860B]" />
              <span>GIF</span>
            </button>

            <button
              onClick={() => {
                setShowVeoModal(true);
                playSacredBell(520);
              }}
              className="px-2 sm:px-3 py-1 rounded-lg text-xs font-cinzel font-semibold transition-all bg-gradient-to-r from-[#F9EDCF] to-[#F1DFC0] text-[#6E4E0E] hover:brightness-105 border border-[#D4AF37]/50 shadow-2xs flex items-center gap-1"
            >
              <Video size={12} />
              <span>Veo</span>
            </button>

            <button
              onClick={toggleSound}
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
              className="p-1 sm:p-1.5 rounded-full text-[#8C6819] hover:bg-[#F6EEDC] transition-colors ml-0.5"
              title={isMuted ? 'Activar sonido sacro' : 'Silenciar'}
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>
          </nav>
        </div>
      </header>

      {/* MAIN VIEW CONTENT */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 flex flex-col items-center">
        {activeTab === 'invitation' ? (
          <EnvelopeModal
            isOpen={isEnvelopeOpen}
            onOpen={() => setIsEnvelopeOpen(true)}
            onReset={() => setIsEnvelopeOpen(false)}
          >
            <InvitationCard
              onOpenGifGenerator={() => setActiveTab('gif')}
              onOpenVeoModal={() => setShowVeoModal(true)}
            />
          </EnvelopeModal>
        ) : (
          <div className="w-full">
            <div className="mb-4">
              <button
                onClick={() => setActiveTab('invitation')}
                className="text-xs font-semibold text-[#8A661F] hover:text-[#5E430B] underline flex items-center gap-1"
              >
                ← Volver a la tarjeta interactiva
              </button>
            </div>
            <GifGenerator onClose={() => setActiveTab('invitation')} />
          </div>
        )}
      </main>

      {/* VEO VIDEO GENERATION MODAL */}
      {showVeoModal && (
        <VeoVideoModal onClose={() => setShowVeoModal(false)} />
      )}

      {/* FOOTER */}
      <footer className="w-full bg-[#F5EEDF]/80 border-t border-[#E5C378]/40 py-6 text-center text-xs text-[#7F7159] space-y-2">
        <div className="flex items-center justify-center gap-2">
          <OrnateCrossIcon size={18} />
          <span className="font-cinzel text-xs font-semibold tracking-wider text-[#735316]">
            Adrián Guillermo & Gelmun Augusto López Bernal
          </span>
          <OrnateCrossIcon size={18} />
        </div>
        <p className="font-garamond italic">
          Martes 8 de diciembre de 2026 • Parroquia de San Pedro Apóstol • Chiquiza, Boyacá
        </p>
        <p className="text-[11px] text-[#A69986]">
          Diseño sacro con paleta blanco, oro y tonos pastel • Formato GIF animado y video Veo
        </p>
      </footer>
    </div>
  );
}
