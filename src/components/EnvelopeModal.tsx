/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, MailOpen, RotateCcw } from 'lucide-react';
import { playAngelicChime, playSacredBell } from './CelestialAudio.ts';

interface EnvelopeModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onReset: () => void;
  children: React.ReactNode;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({
  isOpen,
  onOpen,
  onReset,
  children,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen || isAnimating) return;
    setIsAnimating(true);
    playSacredBell(440);
    playAngelicChime();

    // Trigger golden sacred sparkles
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#D4AF37', '#F3E5AB', '#FFE082', '#FFFFFF', '#C59E37'],
        shapes: ['circle'],
        scalar: 0.8,
      });
    } catch {
      // Ignore if confetti not supported
    }

    setTimeout(() => {
      onOpen();
      setIsAnimating(false);
    }, 900);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {!isOpen ? (
        <div className="w-full max-w-md mx-auto my-8 px-4 flex flex-col items-center text-center">
          {/* Envelope Graphic */}
          <div
            onClick={handleOpenEnvelope}
            className="relative w-full max-w-sm aspect-[4/3] bg-gradient-to-b from-[#FBF8F0] to-[#EFE7D5] rounded-xl shadow-2xl border-2 border-[#D4AF37]/50 cursor-pointer group hover:scale-[1.02] transition-transform duration-300 p-4 overflow-hidden"
            style={{
              boxShadow: '0 25px 50px -12px rgba(181, 138, 54, 0.35)',
            }}
          >
            {/* Envelope flap triangles */}
            <div
              className={`absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-[#FAF4E5] to-[#EFE4CF] border-b border-[#D4AF37]/40 origin-top transition-transform duration-700 ${
                isAnimating ? '-scale-y-100 opacity-60' : ''
              }`}
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
            />

            {/* Inner liner hint */}
            <div
              className="absolute inset-4 rounded-lg border border-[#D4AF37]/30 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#D4AF37 0.75px, transparent 0.75px)',
                backgroundSize: '16px 16px',
                opacity: 0.25,
              }}
            />

            {/* Gold Wax Seal in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`relative w-20 h-20 rounded-full bg-gradient-to-br from-[#E2BD5B] via-[#C99E33] to-[#8C6518] shadow-lg flex flex-col items-center justify-center border-2 border-[#FFF6D4] transition-all duration-300 ${
                  isAnimating ? 'scale-125 opacity-0' : 'group-hover:scale-105'
                }`}
                style={{
                  boxShadow: '0 8px 20px rgba(140, 101, 24, 0.45)',
                }}
              >
                <div className="w-16 h-16 rounded-full border border-[#FFF2BE]/70 flex flex-col items-center justify-center">
                  <span className="font-cinzel text-xs font-black text-[#FFFDF5] tracking-widest">
                    JHS
                  </span>
                  <span className="text-[9px] font-cinzel text-[#FFF8DE] uppercase tracking-wider">
                    2026
                  </span>
                </div>
              </div>
            </div>

            {/* Recipient note text on envelope */}
            <div className="absolute bottom-5 inset-x-6 text-center pointer-events-none">
              <span className="font-cinzel text-[11px] tracking-[0.25em] text-[#805910] uppercase font-bold block">
                Primera Comunión
              </span>
              <p className="font-script text-2xl text-[#6B4E13] leading-none mt-1">
                Adrián Guillermo & Gelmun Augusto
              </p>
            </div>
          </div>

          {/* Invitation Call-to-action button */}
          <button
            onClick={handleOpenEnvelope}
            className="mt-6 inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#E8D08D] to-[#B8860B] text-[#3D2C0A] font-cinzel font-bold text-sm tracking-widest uppercase shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <MailOpen size={18} />
            <span>Tocar para abrir la invitación</span>
            <Sparkles size={16} />
          </button>
          <p className="text-xs text-[#8A7963] mt-2 font-garamond italic">
            Haz clic en el sello dorado o en el botón para descubrir la tarjeta
          </p>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center animate-fadeIn">
          {/* Button to re-close envelope if user wants to relive the experience */}
          <div className="w-full max-w-2xl flex justify-end px-2 mb-2">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-[#E5C378]/50 text-xs text-[#8F6A1E] hover:bg-[#FAF4DE] transition-all"
              title="Volver a ver con el sobre"
            >
              <RotateCcw size={12} />
              <span>Cerrar sobre</span>
            </button>
          </div>
          {children}
        </div>
      )}
    </div>
  );
};
