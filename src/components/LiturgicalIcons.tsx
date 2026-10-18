/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

// Ornate Eucharistic Chalice with radiant Sacred Host inscribed with JHS
export const HolyChaliceIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 64,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="hostGlow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FFFDF5" />
          <stop offset="60%" stopColor="#FFF4D0" />
          <stop offset="100%" stopColor="#E2BE68" />
        </radialGradient>
        <linearGradient id="goldStem" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9EBB2" />
          <stop offset="35%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#AA7A1E" />
          <stop offset="100%" stopColor="#DFB758" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Radiant sunburst rays around Host */}
      <g stroke="#E5C378" strokeWidth="1.2" opacity="0.85">
        <line x1="50" y1="4" x2="50" y2="14" />
        <line x1="50" y1="46" x2="50" y2="52" />
        <line x1="26" y1="28" x2="33" y2="28" />
        <line x1="67" y1="28" x2="74" y2="28" />
        <line x1="33" y1="11" x2="39" y2="17" />
        <line x1="67" y1="11" x2="61" y2="17" />
        <line x1="33" y1="45" x2="39" y2="39" />
        <line x1="67" y1="45" x2="61" y2="39" />
        {/* Intermediate micro-rays */}
        <line x1="41" y1="7" x2="43" y2="13" opacity="0.6" />
        <line x1="59" y1="7" x2="57" y2="13" opacity="0.6" />
        <line x1="28" y1="20" x2="34" y2="22" opacity="0.6" />
        <line x1="72" y1="20" x2="66" y2="22" opacity="0.6" />
      </g>

      {/* Sacred Host (circle with subtle border) */}
      <circle
        cx="50"
        cy="28"
        r="14"
        fill="url(#hostGlow)"
        stroke="#D4AF37"
        strokeWidth="1.2"
        filter="url(#softGlow)"
      />
      {/* JHS Cross engraving on Host */}
      <path
        d="M50 20 V34 M45 24 H55"
        stroke="#8C6518"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* JHS micro-lettering */}
      <text
        x="50"
        y="35"
        textAnchor="middle"
        fontSize="5.5"
        fontFamily="'Cinzel', serif"
        fontWeight="bold"
        fill="#8C6518"
      >
        JHS
      </text>

      {/* Chalice Cup */}
      <path
        d="M32 50 C32 66, 42 74, 50 74 C58 74, 68 66, 68 50 C68 47, 32 47, 32 50 Z"
        fill="url(#goldStem)"
        stroke="#8F6715"
        strokeWidth="1.2"
      />
      {/* Chalice rim accent */}
      <ellipse cx="50" cy="49" rx="18" ry="2.5" fill="#FFF2BD" opacity="0.7" />

      {/* Chalice Stem & Node */}
      <path
        d="M47 74 H53 V86 H47 Z"
        fill="url(#goldStem)"
        stroke="#8F6715"
        strokeWidth="1"
      />
      {/* Decorative node/knob */}
      <ellipse cx="50" cy="80" rx="6" ry="3.5" fill="#FFF4C4" stroke="#8F6715" strokeWidth="1" />

      {/* Chalice Foot / Base */}
      <path
        d="M47 86 C44 87, 30 92, 28 95 H72 C70 92, 56 87, 53 86 Z"
        fill="url(#goldStem)"
        stroke="#8F6715"
        strokeWidth="1.2"
      />
      <line x1="27" y1="95.5" x2="73" y2="95.5" stroke="#FFF2BD" strokeWidth="1" />
    </svg>
  );
};

// Divine Holy Spirit Dove
export const HolyDoveIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 56,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="doveRays" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9E0" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#DFBF6A" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#DFBF6A" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Aura circle */}
      <circle cx="50" cy="50" r="42" fill="url(#doveRays)" />

      {/* Soft light rays behind dove */}
      <g stroke="#D4AF37" strokeWidth="1" opacity="0.5">
        <line x1="50" y1="12" x2="50" y2="24" />
        <line x1="50" y1="76" x2="50" y2="88" />
        <line x1="12" y1="50" x2="24" y2="50" />
        <line x1="76" y1="50" x2="88" y2="50" />
        <line x1="23" y1="23" x2="31" y2="31" />
        <line x1="77" y1="23" x2="69" y2="31" />
        <line x1="23" y1="77" x2="31" y2="69" />
        <line x1="77" y1="77" x2="69" y2="69" />
      </g>

      {/* Dove body and descending wings */}
      <path
        d="M50 28 C47 28 44 32 45 35 C42 36 34 32 20 28 C26 38 35 44 42 46 C38 52 32 60 28 66 C36 64 43 59 47 54 C47 62 45 70 42 76 C48 72 52 64 53 54 C57 59 64 64 72 66 C68 60 62 52 58 46 C65 44 74 38 80 28 C66 32 58 36 55 35 C56 32 53 28 50 28 Z"
        fill="#FFFFFF"
        stroke="#D4AF37"
        strokeWidth="1.5"
      />
      {/* Olive sprig in beak */}
      <path
        d="M50 28 C50 25 52 23 54 21"
        stroke="#7A9A60"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <ellipse cx="55" cy="20" rx="2" ry="1.2" fill="#88A86C" transform="rotate(30 55 20)" />
      <ellipse cx="52" cy="23" rx="1.8" ry="1" fill="#88A86C" transform="rotate(-20 52 23)" />
    </svg>
  );
};

// Ornate Baroque Latin Cross
export const OrnateCrossIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 48,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="crossGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F9ECC0" />
          <stop offset="40%" stopColor="#D4AF37" />
          <stop offset="70%" stopColor="#9C711C" />
          <stop offset="100%" stopColor="#F4E5B0" />
        </linearGradient>
      </defs>

      {/* Center radiant halo */}
      <circle cx="40" cy="38" r="16" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" opacity="0.7" />

      {/* Vertical beam */}
      <path
        d="M37 12 C37 8 43 8 43 12 V34 H58 C62 34 62 42 58 42 H43 V84 C43 88 37 88 37 84 V42 H22 C18 42 18 34 22 34 H37 V12 Z"
        fill="url(#crossGold)"
        stroke="#805910"
        strokeWidth="1.2"
      />

      {/* Flory / Trefoil ends decoration */}
      <circle cx="40" cy="9" r="2.5" fill="#FFEAA8" stroke="#805910" strokeWidth="0.8" />
      <circle cx="61" cy="38" r="2.5" fill="#FFEAA8" stroke="#805910" strokeWidth="0.8" />
      <circle cx="19" cy="38" r="2.5" fill="#FFEAA8" stroke="#805910" strokeWidth="0.8" />
      <circle cx="40" cy="87" r="2.5" fill="#FFEAA8" stroke="#805910" strokeWidth="0.8" />

      {/* Central diamond gem */}
      <polygon
        points="40,32 46,38 40,44 34,38"
        fill="#FFFFFF"
        stroke="#805910"
        strokeWidth="0.8"
      />
    </svg>
  );
};

// Wheat ears and grapevine leaves (Espigas y vides)
export const WheatAndVineIcon: React.FC<{ className?: string; size?: number }> = ({
  className = '',
  size = 50,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left wheat ear */}
      <g stroke="#C59E37" strokeWidth="1.2" fill="#F4DE9C">
        <path d="M60 28 C45 28 30 24 15 15" strokeWidth="1.5" fill="none" />
        <ellipse cx="20" cy="16" rx="4" ry="2" transform="rotate(-30 20 16)" />
        <ellipse cx="28" cy="19" rx="4" ry="2" transform="rotate(-20 28 19)" />
        <ellipse cx="36" cy="22" rx="4" ry="2" transform="rotate(-15 36 22)" />
        <ellipse cx="44" cy="25" rx="4" ry="2" transform="rotate(-10 44 25)" />
        <line x1="18" y1="14" x2="10" y2="8" strokeWidth="0.9" />
        <line x1="26" y1="17" x2="19" y2="11" strokeWidth="0.9" />
        <line x1="34" y1="20" x2="28" y2="14" strokeWidth="0.9" />
      </g>

      {/* Center cluster of grapes */}
      <g fill="#A78546" stroke="#684D19" strokeWidth="0.7">
        <circle cx="60" cy="18" r="3" fill="#DDBF70" />
        <circle cx="56" cy="22" r="3" fill="#C9A653" />
        <circle cx="64" cy="22" r="3" fill="#C9A653" />
        <circle cx="52" cy="26" r="2.8" fill="#B38E3F" />
        <circle cx="60" cy="26" r="2.8" fill="#B38E3F" />
        <circle cx="68" cy="26" r="2.8" fill="#B38E3F" />
        <circle cx="56" cy="30" r="2.5" fill="#99752A" />
        <circle cx="64" cy="30" r="2.5" fill="#99752A" />
        <circle cx="60" cy="34" r="2.2" fill="#8A661F" />
      </g>

      {/* Right wheat ear */}
      <g stroke="#C59E37" strokeWidth="1.2" fill="#F4DE9C">
        <path d="M60 28 C75 28 90 24 105 15" strokeWidth="1.5" fill="none" />
        <ellipse cx="100" cy="16" rx="4" ry="2" transform="rotate(30 100 16)" />
        <ellipse cx="92" cy="19" rx="4" ry="2" transform="rotate(20 92 19)" />
        <ellipse cx="84" cy="22" rx="4" ry="2" transform="rotate(15 84 22)" />
        <ellipse cx="76" cy="25" rx="4" ry="2" transform="rotate(10 76 25)" />
        <line x1="102" y1="14" x2="110" y2="8" strokeWidth="0.9" />
        <line x1="94" y1="17" x2="101" y2="11" strokeWidth="0.9" />
        <line x1="86" y1="20" x2="92" y2="14" strokeWidth="0.9" />
      </g>
    </svg>
  );
};

// Filigree lace corner ornament
export const CornerFiligree: React.FC<{
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}> = ({ className = '', position = 'top-left' }) => {
  const getTransform = () => {
    switch (position) {
      case 'top-right':
        return 'scale(-1, 1)';
      case 'bottom-left':
        return 'scale(1, -1)';
      case 'bottom-right':
        return 'scale(-1, -1)';
      default:
        return 'scale(1, 1)';
    }
  };

  return (
    <div
      className={`absolute w-14 h-14 pointer-events-none ${className}`}
      style={{ transform: getTransform(), transformOrigin: 'center' }}
    >
      <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path
          d="M4 4 H32 C40 4 48 10 52 18 C46 16 38 18 34 24 C30 20 22 20 18 24 C14 28 14 36 18 40 C10 44 4 36 4 28 V4 Z"
          fill="none"
          stroke="#D4AF37"
          strokeWidth="1.2"
          opacity="0.85"
        />
        <path
          d="M8 8 H24 C28 8 32 12 34 16 C30 18 26 22 26 26 C22 24 18 24 16 26 C12 28 12 32 14 34 C10 32 8 28 8 24 V8 Z"
          fill="#FAF4DC"
          fillOpacity="0.4"
          stroke="#C59E37"
          strokeWidth="0.9"
        />
        <circle cx="12" cy="12" r="2.5" fill="#D4AF37" />
        <circle cx="22" cy="12" r="1.5" fill="#D4AF37" />
        <circle cx="12" cy="22" r="1.5" fill="#D4AF37" />
      </svg>
    </div>
  );
};
