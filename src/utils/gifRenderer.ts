/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GIFEncoder, quantize, applyPalette } from 'gifenc';

export const GIF_WIDTH = 480;
export const GIF_HEIGHT = 680;
export const GIF_TOTAL_FRAMES = 18;
export const GIF_FRAME_DELAY = 90;

export function renderInvitationFrame(
  ctx: CanvasRenderingContext2D,
  frameIndex: number,
  totalFrames: number = GIF_TOTAL_FRAMES
) {
  const WIDTH = GIF_WIDTH;
  const HEIGHT = GIF_HEIGHT;
  const t = frameIndex / totalFrames;

  // 1. Parchment Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  bgGrad.addColorStop(0, '#FFFFFF');
  bgGrad.addColorStop(0.3, '#FAF7EF');
  bgGrad.addColorStop(0.7, '#F6EEDC');
  bgGrad.addColorStop(1, '#FAF7EF');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Subtle paper vignette
  const radGrad = ctx.createRadialGradient(WIDTH / 2, HEIGHT / 2, 80, WIDTH / 2, HEIGHT / 2, 340);
  radGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  radGrad.addColorStop(1, 'rgba(212, 175, 55, 0.08)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // 2. Outer and Inner Golden Borders
  ctx.save();
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 16, WIDTH - 32, HEIGHT - 32);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 1;
  ctx.strokeRect(22, 22, WIDTH - 44, HEIGHT - 44);

  // Corner ornaments
  const drawCorner = (cx: number, cy: number, rot: number) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(24, 0);
    ctx.arc(14, 14, 10, -Math.PI / 2, Math.PI, true);
    ctx.stroke();
    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.arc(8, 8, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  };
  drawCorner(16, 16, 0);
  drawCorner(WIDTH - 16, 16, Math.PI / 2);
  drawCorner(WIDTH - 16, HEIGHT - 16, Math.PI);
  drawCorner(16, HEIGHT - 16, -Math.PI / 2);
  ctx.restore();

  // 3. Floating Gold Particles / Dust
  ctx.save();
  const numParticles = 24;
  for (let i = 0; i < numParticles; i++) {
    const seedX = (Math.sin(i * 99.7) * 0.5 + 0.5) * (WIDTH - 60) + 30;
    const speedY = ((i % 3) + 1) * 30;
    const currentY = (i * 35 + t * speedY * (i % 2 === 0 ? 1 : -1) + HEIGHT) % HEIGHT;
    const twinkle = Math.sin((t + i / numParticles) * Math.PI * 2) * 0.5 + 0.5;
    const radius = (i % 3 === 0 ? 2 : 1.2) * (0.6 + 0.4 * twinkle);

    ctx.fillStyle = `rgba(212, 175, 55, ${0.25 + 0.55 * twinkle})`;
    ctx.beginPath();
    ctx.arc(seedX, currentY, radius, 0, Math.PI * 2);
    ctx.fill();

    if (i % 5 === 0 && twinkle > 0.6) {
      ctx.strokeStyle = `rgba(255, 235, 170, ${twinkle * 0.8})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(seedX - 4, currentY);
      ctx.lineTo(seedX + 4, currentY);
      ctx.moveTo(seedX, currentY - 4);
      ctx.lineTo(seedX, currentY + 4);
      ctx.stroke();
    }
  }
  ctx.restore();

  // 4. Sacred Emblem: Holy Chalice & Radiant Host with animated rays
  const chaliceX = WIDTH / 2;
  const chaliceY = 78;

  ctx.save();
  const pulse = Math.sin(t * Math.PI * 2) * 0.2 + 0.8;
  const auraGrad = ctx.createRadialGradient(
    chaliceX,
    chaliceY - 14,
    4,
    chaliceX,
    chaliceY - 14,
    38 * pulse
  );
  auraGrad.addColorStop(0, 'rgba(255, 250, 215, 0.9)');
  auraGrad.addColorStop(0.4, 'rgba(229, 195, 120, 0.4)');
  auraGrad.addColorStop(1, 'rgba(212, 175, 55, 0)');
  ctx.fillStyle = auraGrad;
  ctx.beginPath();
  ctx.arc(chaliceX, chaliceY - 14, 40 * pulse, 0, Math.PI * 2);
  ctx.fill();

  const rayCount = 16;
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.7)';
  ctx.lineWidth = 1;
  for (let r = 0; r < rayCount; r++) {
    const angle = (r / rayCount) * Math.PI * 2 + t * 0.2;
    const innerR = 17;
    const outerR = 25 + (r % 2 === 0 ? 6 : 2) * pulse;
    ctx.beginPath();
    ctx.moveTo(chaliceX + Math.cos(angle) * innerR, chaliceY - 14 + Math.sin(angle) * innerR);
    ctx.lineTo(chaliceX + Math.cos(angle) * outerR, chaliceY - 14 + Math.sin(angle) * outerR);
    ctx.stroke();
  }

  // Host (Wafer)
  ctx.fillStyle = '#FFFDF5';
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(chaliceX, chaliceY - 14, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // JHS on Host
  ctx.fillStyle = '#8C6518';
  ctx.font = 'bold 7px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('JHS', chaliceX, chaliceY - 14);

  // Chalice Cup
  ctx.fillStyle = '#D4AF37';
  ctx.strokeStyle = '#8F6715';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(chaliceX, chaliceY + 4, 16, 0, Math.PI, false);
  ctx.fill();
  ctx.stroke();

  // Chalice Stem & Base
  ctx.fillRect(chaliceX - 2.5, chaliceY + 4, 5, 14);
  ctx.beginPath();
  ctx.ellipse(chaliceX, chaliceY + 12, 5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(chaliceX - 16, chaliceY + 22);
  ctx.lineTo(chaliceX + 16, chaliceY + 22);
  ctx.lineTo(chaliceX + 3, chaliceY + 18);
  ctx.lineTo(chaliceX - 3, chaliceY + 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // 5. Typography: Heading
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  ctx.fillStyle = '#8A661F';
  ctx.font = 'bold 9px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('PRIMERA COMUNIÓN', chaliceX, 114);

  ctx.fillStyle = '#5A4210';
  ctx.font = 'italic 600 18px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('¡Un día muy especial para nuestra familia!', chaliceX, 132);

  ctx.fillStyle = '#5A4C3A';
  ctx.font = 'italic 12px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Con el corazón lleno de alegría y gratitud con Dios,', chaliceX, 164);
  ctx.fillText('queremos invitarte a compartir con nosotros la', chaliceX, 180);
  ctx.fillText('Primera Comunión de:', chaliceX, 196);

  // 6. Names with Animated Golden Shimmer Pass
  const shimmerOffset = t * (WIDTH + 200) - 100;

  const drawShimmerText = (text: string, yPos: number, fontSize: number) => {
    ctx.save();
    ctx.font = `bold ${fontSize}px "Cinzel", Georgia, serif`;
    ctx.letterSpacing = '1px';

    ctx.fillStyle = '#8B641B';
    ctx.fillText(text, chaliceX, yPos);

    const textWidth = ctx.measureText(text).width;
    const textLeft = chaliceX - textWidth / 2;
    const textRight = chaliceX + textWidth / 2;

    if (shimmerOffset > textLeft - 80 && shimmerOffset < textRight + 80) {
      const gleam = ctx.createLinearGradient(shimmerOffset - 40, yPos, shimmerOffset + 40, yPos);
      gleam.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gleam.addColorStop(0.5, 'rgba(255, 250, 210, 0.9)');
      gleam.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gleam;
      ctx.fillText(text, chaliceX, yPos);
    }
    ctx.restore();
  };

  drawShimmerText('ADRIÁN GUILLERMO', 222, 19);

  ctx.fillStyle = '#9E7824';
  ctx.font = 'italic 20px "Great Vibes", cursive, Georgia';
  ctx.fillText('y', chaliceX, 246);

  drawShimmerText('GELMUN AUGUSTO', 270, 19);

  ctx.fillStyle = '#735316';
  ctx.font = 'bold 11px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('LÓPEZ BERNAL', chaliceX, 298);

  // 7. Devotional Reflection
  ctx.fillStyle = '#4A3E2D';
  ctx.font = '11.5px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Será un momento único, en el que recibirán por primera vez', chaliceX, 326);
  ctx.fillText('a Jesús en su corazón, y nos haría muy felices que los', chaliceX, 342);
  ctx.fillText('acompañes en este paso tan importante de su vida.', chaliceX, 358);

  // 8. Event Details Box
  const boxW = WIDTH - 80;
  const boxH = 120;
  const boxX = 40;
  const boxY = 384;

  ctx.fillStyle = 'rgba(255, 253, 246, 0.9)';
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#805910';
  ctx.font = 'bold 9.5px "Cinzel", Georgia, serif';
  ctx.letterSpacing = '1px';
  ctx.fillText('— CELEBRACIÓN SAGRADA —', chaliceX, boxY + 12);

  ctx.fillStyle = '#2F271B';
  ctx.font = 'bold 13px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('📅 Martes 8 de diciembre de 2026', chaliceX, boxY + 34);

  ctx.fillStyle = '#554937';
  ctx.font = '12px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('🕛 12:00 m.', chaliceX, boxY + 54);

  ctx.fillStyle = '#302617';
  ctx.font = 'bold 13px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('⛪ Parroquia de San Pedro Apóstol', chaliceX, boxY + 76);

  ctx.fillStyle = '#786852';
  ctx.font = 'italic 11px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Chiquiza, Boyacá • WhatsApp: 321 438 6084', chaliceX, boxY + 95);

  // 9. Reception Note
  ctx.fillStyle = '#4E412F';
  ctx.font = 'italic 11.5px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Al terminar la misa, nos encantaría que nos acompañes a una', chaliceX, 520);
  ctx.fillText('comida en casa para seguir celebrando juntos en familia.', chaliceX, 536);

  // 10. Warm Closing
  ctx.fillStyle = '#3F3323';
  ctx.font = 'italic 600 12.5px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('Tu compañía y tus oraciones harán este día aún más bonito.', chaliceX, 568);

  ctx.fillStyle = '#8B641B';
  ctx.font = 'bold 13.5px "Cormorant Garamond", Georgia, serif';
  ctx.fillText('¡Te esperamos con mucho cariño!', chaliceX, 588);

  // 11. Small Holy Dove at bottom
  const doveY = 628;
  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  ctx.arc(chaliceX, doveY, 14, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(chaliceX, doveY, 13, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#D4AF37';
  ctx.beginPath();
  ctx.moveTo(chaliceX - 8, doveY + 1);
  ctx.quadraticCurveTo(chaliceX, doveY - 6, chaliceX + 8, doveY + 1);
  ctx.quadraticCurveTo(chaliceX, doveY - 1, chaliceX - 8, doveY + 1);
  ctx.fill();

  ctx.restore();
}

export async function generateInvitationGifBlob(
  onProgress?: (percent: number, frame: number, total: number) => void
): Promise<Blob> {
  const offscreen = document.createElement('canvas');
  offscreen.width = GIF_WIDTH;
  offscreen.height = GIF_HEIGHT;
  const ctx = offscreen.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    throw new Error('No se pudo inicializar el lienzo 2D');
  }

  const gif = GIFEncoder();

  for (let f = 0; f < GIF_TOTAL_FRAMES; f++) {
    renderInvitationFrame(ctx, f, GIF_TOTAL_FRAMES);
    const imgData = ctx.getImageData(0, 0, GIF_WIDTH, GIF_HEIGHT).data;
    const palette = quantize(imgData, 256);
    const index = applyPalette(imgData, palette);

    gif.writeFrame(index, GIF_WIDTH, GIF_HEIGHT, {
      palette,
      delay: GIF_FRAME_DELAY,
    });

    if (onProgress) {
      onProgress(Math.round(((f + 1) / GIF_TOTAL_FRAMES) * 100), f + 1, GIF_TOTAL_FRAMES);
    }
    await new Promise((r) => setTimeout(r, 8));
  }

  gif.finish();
  const bytes = gif.bytes();
  return new Blob([bytes as unknown as BlobPart], { type: 'image/gif' });
}
