import React from 'react';
import { AvatarConfig } from '../types';

interface ChibiAvatarProps {
  config: AvatarConfig;
  width?: string | number;
  height?: string | number;
  showClothing?: boolean;
}

export default function ChibiAvatar({
  config,
  width = '100%',
  height = '100%',
  showClothing = true,
}: ChibiAvatarProps) {
  const {
    ageType,
    height: userHeight,
    bust,
    waist,
    hips,
    skinColor,
    hairStyle,
    hairColor,
    accessory,
    activeClothingId,
  } = config;

  // Proportional scale factor calculations based on real standard measurements
  const isGirl = ageType === 'daughter';
  const baseBust = isGirl ? 70 : 88;
  const baseWaist = isGirl ? 58 : 70;
  const baseHips = isGirl ? 74 : 92;
  const baseHeight = isGirl ? 135 : 160;

  // Prevent division by zero and restrict scaling bounds for aesthetic chibi proportions
  const bustScale = Math.max(0.8, Math.min(1.3, bust / baseBust));
  const waistScale = Math.max(0.8, Math.min(1.3, waist / baseWaist));
  const hipsScale = Math.max(0.8, Math.min(1.3, hips / baseHips));
  const heightScale = Math.max(0.8, Math.min(1.2, userHeight / baseHeight));

  // Base coordinates for the 2D Chibi Avatar (Canvas: 200 x 260)
  const headCx = 100;
  const headCy = 75;
  const headR = 40;

  // Neck position
  const neckY = headCy + headR - 6; // ~109
  
  // Dynamic body key points
  const bustY = neckY + 12; // 121
  const bustW = 14 * bustScale; // half width

  const waistY = bustY + 20 * heightScale; // ~141
  const waistW = 11 * waistScale; // half width

  const hipsY = waistY + 20 * heightScale; // ~161
  const hipsW = 15 * hipsScale; // half width

  const crotchY = hipsY + 10; // ~171
  const feetY = crotchY + 35 * heightScale; // ~206

  return (
    <svg
      viewBox="0 0 200 260"
      width={width}
      height={height}
      className="select-none filter drop-shadow-md overflow-visible"
      id="kawaii-chibi-avatar-svg"
    >
      <defs>
        {/* Gradients for cute shading */}
        <radialGradient id="blushGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff7096" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ff7096" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.15" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.1" />
        </filter>
      </defs>

      {/* 1. BACKGROUND SHADOW */}
      <ellipse cx="100" cy={feetY + 4} rx={hipsW + 18} ry="6" fill="#000000" fillOpacity="0.08" />

      {/* 2. BODY LAYERS: ARMS & LEGS */}
      {/* Left Arm */}
      <path
        d={`M ${headCx - 8} ${neckY + 4} Q ${headCx - 24 - bustW} ${bustY + 8} ${headCx - 20 - bustW} ${waistY}`}
        fill="none"
        stroke={skinColor}
        strokeWidth="11"
        strokeLinecap="round"
      />
      {/* Right Arm */}
      <path
        d={`M ${headCx + 8} ${neckY + 4} Q ${headCx + 24 + bustW} ${bustY + 8} ${headCx + 20 + bustW} ${waistY}`}
        fill="none"
        stroke={skinColor}
        strokeWidth="11"
        strokeLinecap="round"
      />

      {/* Left Leg */}
      <path
        d={`M ${headCx - hipsW / 2 - 2} ${hipsY} L ${headCx - hipsW / 2 - 4} ${feetY}`}
        fill="none"
        stroke={skinColor}
        strokeWidth="13"
        strokeLinecap="round"
      />
      {/* Right Leg */}
      <path
        d={`M ${headCx + hipsW / 2 + 2} ${hipsY} L ${headCx + hipsW / 2 + 4} ${feetY}`}
        fill="none"
        stroke={skinColor}
        strokeWidth="13"
        strokeLinecap="round"
      />

      {/* Feet details (shoes/toes chibi) */}
      <ellipse cx={headCx - hipsW / 2 - 4} cy={feetY} rx="8" ry="5.5" fill={skinColor} />
      <ellipse cx={headCx + hipsW / 2 + 4} cy={feetY} rx="8" ry="5.5" fill={skinColor} />

      {/* 3. TORSO */}
      {/* Smoothly connecting Neck -> Bust -> Waist -> Hips */}
      <path
        d={`M ${headCx - 6} ${neckY} 
           C ${headCx - bustW} ${bustY}, ${headCx - waistW} ${waistY}, ${headCx - hipsW} ${hipsY}
           L ${headCx + hipsW} ${hipsY}
           C ${headCx + waistW} ${waistY}, ${headCx + bustW} ${bustY}, ${headCx + 6} ${neckY}
           Z`}
        fill={skinColor}
      />
      <rect x={headCx - 6} y={neckY - 6} width="12" height="10" fill={skinColor} />

      {/* 4. HEAD & FACE FEATURES */}
      {/* Main Face circle */}
      <circle cx={headCx} cy={headCy} r={headR} fill={skinColor} />
      <path d={`M ${headCx - headR} ${headCy + 10} Q ${headCx} ${headCy + headR} ${headCx + headR} ${headCy + 10}`} fill={skinColor} />

      {/* Blush Cheeks */}
      <ellipse cx={headCx - 22} cy={headCy + 12} rx="8" ry="4.5" fill="url(#blushGradient)" />
      <ellipse cx={headCx + 22} cy={headCy + 12} rx="8" ry="4.5" fill="url(#blushGradient)" />

      {/* Chibi Eyes (Big & sparkling) */}
      <g>
        {/* Left Eye */}
        <ellipse cx={headCx - 16} cy={headCy + 5} rx="5" ry="7" fill="#2b2325" />
        <circle cx={headCx - 18} cy={headCy + 3} r="2" fill="#ffffff" />
        <circle cx={headCx - 14} cy={headCy + 8} r="0.8" fill="#ffffff" />
        {/* Left Eyelashes */}
        <path d={`M ${headCx - 22} ${headCy + 2} Q ${headCx - 17} ${headCy - 1} ${headCx - 12} ${headCy + 3}`} fill="none" stroke="#2b2325" strokeWidth="1.5" strokeLinecap="round" />

        {/* Right Eye */}
        <ellipse cx={headCx + 16} cy={headCy + 5} rx="5" ry="7" fill="#2b2325" />
        <circle cx={headCx + 14} cy={headCy + 3} r="2" fill="#ffffff" />
        <circle cx={headCx + 18} cy={headCy + 8} r="0.8" fill="#ffffff" />
        {/* Right Eyelashes */}
        <path d={`M ${headCx + 12} ${headCy + 2} Q ${headCx + 17} ${headCy - 1} ${headCx + 22} ${headCy + 3}`} fill="none" stroke="#2b2325" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      {/* Cute Little Mouth (happy smile: 'w' or happy arc) */}
      <path
        d={`M ${headCx - 3.5} ${headCy + 18} Q ${headCx} ${headCy + 21} ${headCx + 3.5} ${headCy + 18}`}
        fill="none"
        stroke="#2b2325"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Cute Chibi Nose */}
      <path d={`M ${headCx - 1} ${headCy + 12} Q ${headCx} ${headCy + 13} ${headCx + 1} ${headCy + 12}`} fill="none" stroke="#2b2325" strokeWidth="1" />


      {/* 5. HAIRSTYLES (Drawn according to chosen option) */}
      {/* Back Hair */}
      <g>
        {hairStyle === 'twin-tails' && (
          <>
            {/* Left pigtail */}
            <path d={`M ${headCx - 32} ${headCy - 5} C ${headCx - 65} ${headCy - 20}, ${headCx - 60} ${headCy + 35}, ${headCx - 36} ${headCy + 20} Z`} fill={hairColor} filter="url(#shadow)" />
            {/* Right pigtail */}
            <path d={`M ${headCx + 32} ${headCy - 5} C ${headCx + 65} ${headCy - 20}, ${headCx + 60} ${headCy + 35}, ${headCx + 36} ${headCy + 20} Z`} fill={hairColor} filter="url(#shadow)" />
          </>
        )}
        {hairStyle === 'wavy' && (
          <>
            {/* Voluminous back curls */}
            <path d={`M ${headCx - headR - 4} ${headCy} C ${headCx - 65} ${headCy + 30}, ${headCx - 45} ${headCy + 75}, ${headCx - 20} ${headCy + 60} C ${headCx - 35} ${headCy + 40}, ${headCx - headR} ${headCy + 20}, ${headCx - headR} ${headCy} Z`} fill={hairColor} />
            <path d={`M ${headCx + headR + 4} ${headCy} C ${headCx + 65} ${headCy + 30}, ${headCx + 45} ${headCy + 75}, ${headCx + 20} ${headCy + 60} C ${headCx + 35} ${headCy + 40}, ${headCx + headR} ${headCy + 20}, ${headCx + headR} ${headCy} Z`} fill={hairColor} />
          </>
        )}
        {hairStyle === 'bun' && (
          <>
            {/* Cute bun on top */}
            <circle cx={headCx} cy={headCy - headR - 4} r="18" fill={hairColor} filter="url(#shadow)" />
            {/* Small hair tie */}
            <ellipse cx={headCx} cy={headCy - headR + 10} rx="12" ry="4" fill="#ff7096" />
          </>
        )}
      </g>

      {/* Main Hair Cap & Bangs */}
      <g fill={hairColor}>
        {/* Hair Cap */}
        <path d={`M ${headCx - headR - 3} ${headCy + 10} C ${headCx - headR - 6} ${headCy - 35}, ${headCx + headR + 6} ${headCy - 35}, ${headCx + headR + 3} ${headCy + 10} C ${headCx + headR - 3} ${headCy - 12}, ${headCx - headR + 3} ${headCy - 12}, ${headCx - headR - 3} ${headCy + 10} Z`} />
        
        {/* Bangs / Capa superior frontal */}
        {hairStyle === 'bob' ? (
          // Elegant straight bangs (Cleopatra cut style)
          <path d={`M ${headCx - headR - 2} ${headCy} C ${headCx - 30} ${headCy - 15}, ${headCx + 30} ${headCy - 15}, ${headCx + headR + 2} ${headCy} L ${headCx + headR} ${headCy - 15} C ${headCx + 15} ${headCy - 5}, ${headCx - 15} ${headCy - 5}, ${headCx - headR} ${headCy - 15} Z`} />
        ) : (
          // Cute staggered side swept bangs for other hairstyles
          <path d={`M ${headCx - headR - 2} ${headCy - 4} Q ${headCx - 20} ${headCy - 8} ${headCx - 10} ${headCy + 3} Q ${headCx} ${headCy - 12} ${headCx + 15} ${headCy - 2} Q ${headCx + 30} ${headCy - 10} ${headCx + headR + 2} ${headCy - 4} C ${headCx + 35} ${headCy - 35}, ${headCx - 35} ${headCy - 35}, ${headCx - headR - 2} ${headCy - 4} Z`} />
        )}

        {/* Cute side locks */}
        <path d={`M ${headCx - headR} ${headCy} Q ${headCx - headR - 3} ${headCy + 15} ${headCx - headR + 1} ${headCy + 25} Q ${headCx - headR + 6} ${headCy + 15} ${headCx - headR + 4} ${headCy} Z`} />
        <path d={`M ${headCx + headR} ${headCy} Q ${headCx + headR + 3} ${headCy + 15} ${headCx + headR - 1} ${headCy + 25} Q ${headCx + headR - 6} ${headCy + 15} ${headCx + headR - 4} ${headCy} Z`} />
      </g>


      {/* 6. CLOTHING OVERLAY (Virtual Try-On Layer) */}
      {showClothing && activeClothingId && (
        <g filter="url(#shadow)">
          {/* Overlay logic based on product type */}
          {/* We check clothingType for the item. In our list we have:
              'prod-1' (Falda pastel): falda
              'prod-2' (Blusa gato): blusa
              'prod-3' (Vestido Lolita): vestido
              'prod-4' (Hoodie Oso): hoodie
              'prod-5' (Falda Lolita): falda
              'prod-6' (Cardigan): hoodie (acts like top overlay)
              'prod-7' (Vestido marinero): vestido
              'prod-8' (Hoodie nube): hoodie
          */}

          {/* A: BLUSA / TOPS OVERLAYS */}
          {(activeClothingId === 'prod-2') && (
            // Blusa Gato Chibi (Cute top with sailor collar)
            <g>
              {/* Main shirt body */}
              <path
                d={`M ${headCx - 7} ${neckY} 
                   C ${headCx - bustW - 1} ${bustY}, ${headCx - waistW - 1} ${waistY}, ${headCx - waistW - 1} ${waistY + 4}
                   L ${headCx + waistW + 1} ${waistY + 4}
                   C ${headCx + waistW + 1} ${waistY}, ${headCx + bustW + 1} ${bustY}, ${headCx + 7} ${neckY}
                   Z`}
                fill="#FFFFFF"
                stroke="#6C5CE7"
                strokeWidth="1.2"
              />
              {/* Sailor Collar (purple) */}
              <path
                d={`M ${headCx - 8} ${neckY} L ${headCx - bustW - 1} ${bustY - 2} L ${headCx - 4} ${bustY + 3} L ${headCx} ${neckY + 8} L ${headCx + 4} ${bustY + 3} L ${headCx + bustW + 1} ${bustY - 2} L ${headCx + 8} ${neckY} Z`}
                fill="#bba2e8"
              />
              {/* Cute little red ribbon bow */}
              <circle cx={headCx} cy={bustY + 1} r="3" fill="#ff7096" />
              <path d={`M ${headCx - 4} ${bustY + 4} L ${headCx} ${bustY + 1} L ${headCx + 4} ${bustY + 4}`} stroke="#ff7096" strokeWidth="1.5" />
              {/* Sleeves */}
              <path d={`M ${headCx - 7} ${neckY + 3} Q ${headCx - 20 - bustW} ${bustY} ${headCx - 14 - bustW} ${waistY - 2}`} fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />
              <path d={`M ${headCx + 7} ${neckY + 3} Q ${headCx + 20 + bustW} ${bustY} ${headCx + 14 + bustW} ${waistY - 2}`} fill="none" stroke="#FFFFFF" strokeWidth="9" strokeLinecap="round" />
              {/* Sleeve borders lila */}
              <circle cx={headCx - 14 - bustW} cy={waistY - 2} r="4.5" fill="#bba2e8" />
              <circle cx={headCx + 14 + bustW} cy={waistY - 2} r="4.5" fill="#bba2e8" />
            </g>
          )}

          {/* B: FALDA / BOTTOM OVERLAYS */}
          {(activeClothingId === 'prod-1' || activeClothingId === 'prod-5') && (
            // Faldas (Skirt overlay fitting waist & hips)
            <g>
              {/* Waist band */}
              <path
                d={`M ${headCx - waistW - 1} ${waistY - 2} L ${headCx + waistW + 1} ${waistY - 2} L ${headCx + waistW + 1} ${waistY + 2} L ${headCx - waistW - 1} ${waistY + 2} Z`}
                fill={activeClothingId === 'prod-1' ? '#ffb7c5' : '#2b2325'}
              />
              {/* Flared skirt body */}
              <path
                d={`M ${headCx - waistW - 1} ${waistY + 2} 
                   Q ${headCx - hipsW - 8} ${hipsY} ${headCx - hipsW - 10} ${hipsY + 12}
                   Q ${headCx} ${hipsY + 18} ${headCx + hipsW + 10} ${hipsY + 12}
                   Q ${headCx + hipsW + 8} ${hipsY} ${headCx + waistW + 1} ${waistY + 2}
                   Z`}
                fill={activeClothingId === 'prod-1' ? '#e2d2f9' : '#4a3f41'}
                stroke={activeClothingId === 'prod-1' ? '#ffb7c5' : '#FFE494'}
                strokeWidth="1"
              />
              {/* Skirt details: lace ribbon lines */}
              {activeClothingId === 'prod-1' ? (
                <>
                  <path d={`M ${headCx - waistW - 4} ${hipsY - 2} Q ${headCx} ${hipsY + 2} ${headCx + waistW + 4} ${hipsY - 2}`} fill="none" stroke="#FFFFFF" strokeWidth="1.2" strokeDasharray="3,2" />
                  {/* Small bows */}
                  <circle cx={headCx - waistW} cy={waistY + 5} r="2.5" fill="#ffb7c5" />
                  <circle cx={headCx + waistW} cy={waistY + 5} r="2.5" fill="#ffb7c5" />
                </>
              ) : (
                <>
                  {/* Gothic cross or stars pattern */}
                  <circle cx={headCx} cy={hipsY + 4} r="2.5" fill="#FFE494" />
                  <path d={`M ${headCx - 14} ${hipsY} Q ${headCx} ${hipsY + 4} ${headCx + 14} ${hipsY}`} fill="none" stroke="#FFE494" strokeWidth="1" />
                </>
              )}
            </g>
          )}

          {/* C: VESTIDOS (Full dress body overlay) */}
          {(activeClothingId === 'prod-3' || activeClothingId === 'prod-7') && (
            <g>
              {/* Vestidos (Neck down to mid-legs, custom colors) */}
              <path
                d={`M ${headCx - 7} ${neckY}
                   C ${headCx - bustW - 2} ${bustY}, ${headCx - waistW - 2} ${waistY}, ${headCx - hipsW - 10} ${hipsY + 4}
                   Q ${headCx} ${hipsY + 22} ${headCx + hipsW + 10} ${hipsY + 4}
                   C ${headCx + waistW + 2} ${waistY}, ${headCx + bustW + 2} ${bustY}, ${headCx + 7} ${neckY}
                   Z`}
                fill={activeClothingId === 'prod-3' ? '#FFAEC9' : '#ffb7c5'}
                stroke={activeClothingId === 'prod-3' ? '#e2d2f9' : '#1e3a8a'}
                strokeWidth="1"
              />
              {/* Shoulder/Sleeves */}
              <path d={`M ${headCx - 7} ${neckY + 3} Q ${headCx - 20 - bustW} ${bustY} ${headCx - 14 - bustW} ${waistY - 2}`} fill="none" stroke={activeClothingId === 'prod-3' ? '#FFAEC9' : '#ffb7c5'} strokeWidth="9" strokeLinecap="round" />
              <path d={`M ${headCx + 7} ${neckY + 3} Q ${headCx + 20 + bustW} ${bustY} ${headCx + 14 + bustW} ${waistY - 2}`} fill="none" stroke={activeClothingId === 'prod-3' ? '#FFAEC9' : '#ffb7c5'} strokeWidth="9" strokeLinecap="round" />

              {activeClothingId === 'prod-3' ? (
                <>
                  {/* Lolita laces & huge central chest bow */}
                  <path d={`M ${headCx - 10} ${bustY} L ${headCx + 10} ${bustY} L ${headCx} ${waistY - 4} Z`} fill="#FFFFFF" opacity="0.8" />
                  <ellipse cx={headCx} cy={bustY + 3} rx="6" ry="4" fill="#ff7096" />
                  <path d={`M ${headCx - 5} ${bustY + 6} L ${headCx + 5} ${bustY + 6}`} stroke="#FFFFFF" strokeWidth="1.5" />
                  {/* Bottom ruffle line */}
                  <path d={`M ${headCx - hipsW - 8} ${hipsY + 5} Q ${headCx} ${hipsY + 20} ${headCx + hipsW + 8} ${hipsY + 5}`} fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeDasharray="4,2" />
                </>
              ) : (
                <>
                  {/* Sailor collar for Kids dress */}
                  <path d={`M ${headCx - 8} ${neckY} L ${headCx - bustW} ${bustY} L ${headCx} ${bustY + 6} L ${headCx + bustW} ${bustY} L ${headCx + 8} ${neckY} Z`} fill="#1e3a8a" />
                  <circle cx={headCx} cy={bustY + 4} r="3" fill="#ffffff" />
                  {/* Little red bowtie */}
                  <path d={`M ${headCx - 4} ${bustY + 4} L ${headCx + 4} ${bustY + 4} L ${headCx} ${bustY + 1} Z`} fill="#ff7096" />
                </>
              )}
            </g>
          )}

          {/* D: HOODIES / CARDIGANS (Oversized, cozy, thick overlay) */}
          {(activeClothingId === 'prod-4' || activeClothingId === 'prod-6' || activeClothingId === 'prod-8') && (
            <g>
              {/* Cozy fluffy coat covering torso and hips, fluffy arms */}
              {/* Left thick arm */}
              <path
                d={`M ${headCx - 8} ${neckY + 5} Q ${headCx - 26 - bustW} ${bustY + 6} ${headCx - 22 - bustW} ${waistY + 4}`}
                fill="none"
                stroke={activeClothingId === 'prod-4' ? '#8B5A2B' : activeClothingId === 'prod-6' ? '#a3e4d7' : '#9be1ff'}
                strokeWidth="15"
                strokeLinecap="round"
              />
              {/* Right thick arm */}
              <path
                d={`M ${headCx + 8} ${neckY + 5} Q ${headCx + 26 + bustW} ${bustY + 6} ${headCx + 22 + bustW} ${waistY + 4}`}
                fill="none"
                stroke={activeClothingId === 'prod-4' ? '#8B5A2B' : activeClothingId === 'prod-6' ? '#a3e4d7' : '#9be1ff'}
                strokeWidth="15"
                strokeLinecap="round"
              />

              {/* Main fluffy sweater body */}
              <path
                d={`M ${headCx - 8} ${neckY} 
                   C ${headCx - bustW - 5} ${bustY}, ${headCx - waistW - 5} ${waistY}, ${headCx - hipsW - 4} ${hipsY + 4}
                   L ${headCx + hipsW + 4} ${hipsY + 4}
                   C ${headCx + waistW + 5} ${waistY}, ${headCx + bustW + 5} ${bustY}, ${headCx + 8} ${neckY}
                   Z`}
                fill={activeClothingId === 'prod-4' ? '#8B5A2B' : activeClothingId === 'prod-6' ? '#a3e4d7' : '#9be1ff'}
                stroke="#FFFFFF"
                strokeWidth="0.8"
              />

              {/* Specific details */}
              {activeClothingId === 'prod-4' && (
                <>
                  {/* Fluffy Bear Hoodie center pocket */}
                  <path d={`M ${headCx - 14} ${waistY + 2} L ${headCx + 14} ${waistY + 2} L ${headCx + 10} ${hipsY + 2} L ${headCx - 10} ${hipsY + 2} Z`} fill="#A0522D" />
                  {/* Bear paw print on chest */}
                  <circle cx={headCx} cy={bustY + 3} r="3" fill="#FFFFFF" />
                  <circle cx={headCx - 3.5} cy={bustY} r="1.2" fill="#FFFFFF" />
                  <circle cx={headCx} cy={bustY - 1.5} r="1.2" fill="#FFFFFF" />
                  <circle cx={headCx + 3.5} cy={bustY} r="1.2" fill="#FFFFFF" />
                </>
              )}

              {activeClothingId === 'prod-6' && (
                <>
                  {/* Cardigan buttons and V-neck */}
                  <path d={`M ${headCx - 8} ${neckY} L ${headCx} ${bustY + 4} L ${headCx + 8} ${neckY}`} fill="none" stroke="#2b2325" strokeWidth="1" />
                  {/* Golden Star buttons */}
                  <polygon points={`${headCx},${bustY + 8} ${headCx+2},${bustY+11} ${headCx+5},${bustY+11} ${headCx+3},${bustY+13} ${headCx+4},${bustY+16} ${headCx},${bustY+14} ${headCx-4},${bustY+16} ${headCx-3},${bustY+13} ${headCx-5},${bustY+11} ${headCx-2},${bustY+11}`} fill="#FFE494" />
                  <polygon points={`${headCx},${waistY + 4} ${headCx+2},${waistY+7} ${headCx+5},${waistY+7} ${headCx+3},${waistY+9} ${headCx+4},${waistY+12} ${headCx},${waistY+10} ${headCx-4},${waistY+12} ${headCx-3},${waistY+9} ${headCx-5},${waistY+7} ${headCx-2},${waistY+7}`} fill="#FFE494" />
                </>
              )}

              {activeClothingId === 'prod-8' && (
                <>
                  {/* Happy chibi cloud embroidered on chest */}
                  <path d={`M ${headCx - 10} ${bustY + 4} C ${headCx - 14} ${bustY + 4}, ${headCx - 12} ${bustY}, ${headCx - 8} ${bustY} C ${headCx - 6} ${bustY - 3}, ${headCx - 2} ${bustY - 3}, ${headCx} ${bustY} C ${headCx + 2} ${bustY - 3}, ${headCx + 6} ${bustY - 3}, ${headCx + 8} ${bustY} C ${headCx + 12} ${bustY}, ${headCx + 14} ${bustY + 4}, ${headCx + 10} ${bustY + 4} Z`} fill="#FFFFFF" />
                  <circle cx={headCx - 4} cy={bustY + 2} r="0.6" fill="#2b2325" />
                  <circle cx={headCx + 4} cy={bustY + 2} r="0.6" fill="#2b2325" />
                  <path d={`M ${headCx - 1} ${bustY + 3} Q ${headCx} ${bustY + 4} ${headCx + 1} ${bustY + 3}`} fill="none" stroke="#2b2325" strokeWidth="0.5" />
                </>
              )}
            </g>
          )}
        </g>
      )}

      {/* 7. HAIR FRONT ACCESSORY OVERLAYS */}
      {accessory !== 'none' && (
        <g filter="url(#shadow)">
          {accessory === 'ribbon' && (
            // Giant bow accessory on top of head
            <g fill="#ff7096" stroke="#FFFFFF" strokeWidth="0.8">
              <ellipse cx={headCx - 14} cy={headCy - headR + 2} rx="12" ry="7" transform={`rotate(-15, ${headCx - 14}, ${headCy - headR + 2})`} />
              <ellipse cx={headCx + 14} cy={headCy - headR + 2} rx="12" ry="7" transform={`rotate(15, ${headCx + 14}, ${headCy - headR + 2})`} />
              {/* Bow ribbons */}
              <path d={`M ${headCx - 8} ${headCy - headR + 4} L ${headCx - 20} ${headCy - headR + 20} L ${headCx - 12} ${headCy - headR + 14} Z`} />
              <path d={`M ${headCx + 8} ${headCy - headR + 4} L ${headCx + 20} ${headCy - headR + 20} L ${headCx + 12} ${headCy - headR + 14} Z`} />
              <circle cx={headCx} cy={headCy - headR + 2} r="6" fill="#ff4d79" />
            </g>
          )}

          {accessory === 'cat-ears' && (
            // Cute pink and white cat ears sticking out
            <g fill="#FFFFFF" stroke="#2b2325" strokeWidth="1.2">
              {/* Left ear */}
              <path d={`M ${headCx - 28} ${headCy - headR + 12} L ${headCx - 42} ${headCy - headR - 6} L ${headCx - 14} ${headCy - headR + 4} Z`} />
              <path d={`M ${headCx - 26} ${headCy - headR + 9} L ${headCx - 36} ${headCy - headR - 1} L ${headCx - 18} ${headCy - headR + 4} Z`} fill="#ffb7c5" stroke="none" />
              {/* Right ear */}
              <path d={`M ${headCx + 28} ${headCy - headR + 12} L ${headCx + 42} ${headCy - headR - 6} L ${headCx + 14} ${headCy - headR + 4} Z`} />
              <path d={`M ${headCx + 26} ${headCy - headR + 9} L ${headCx + 36} ${headCy - headR - 1} L ${headCx + 18} ${headCy - headR + 4} Z`} fill="#ffb7c5" stroke="none" />
            </g>
          )}

          {accessory === 'glasses' && (
            // Cute heart-shaped glasses over eyes
            <g stroke="#ff4d79" strokeWidth="2.5" fill="#ff7096" fillOpacity="0.3">
              {/* Left Heart lens */}
              <path d={`M ${headCx - 21} ${headCy + 1} 
                       C ${headCx - 26} ${headCy - 4}, ${headCx - 31} ${headCy + 2}, ${headCx - 21} ${headCy + 10} 
                       C ${headCx - 11} ${headCy + 2}, ${headCx - 16} ${headCy - 4}, ${headCx - 21} ${headCy + 1}`} />
              {/* Right Heart lens */}
              <path d={`M ${headCx + 21} ${headCy + 1} 
                       C ${headCx + 16} ${headCy - 4}, ${headCx + 11} ${headCy + 2}, ${headCx + 21} ${headCy + 10} 
                       C ${headCx + 31} ${headCy + 2}, ${headCx + 26} ${headCy - 4}, ${headCx + 21} ${headCy + 1}`} />
              {/* Bridge */}
              <path d={`M ${headCx - 11} ${headCy + 3} Q ${headCx} ${headCy + 2} ${headCx + 11} ${headCy + 3}`} fill="none" stroke="#ff4d79" strokeWidth="2" />
              {/* Frame sides */}
              <path d={`M ${headCx - 29} ${headCy + 3} Q ${headCx - 36} ${headCy} ${headCx - 40} ${headCy + 5}`} fill="none" stroke="#ff4d79" strokeWidth="1.5" />
              <path d={`M ${headCx + 29} ${headCy + 3} Q ${headCx + 36} ${headCy} ${headCx + 40} ${headCy + 5}`} fill="none" stroke="#ff4d79" strokeWidth="1.5" />
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
