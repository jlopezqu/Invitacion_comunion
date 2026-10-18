/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface EventInfo {
  childrenNames: string[];
  dateString: string;
  timeString: string;
  churchName: string;
  townName: string;
  department: string;
  receptionNote: string;
  targetIsoDate: string; // "2026-12-08T12:00:00-05:00" (Colombia Time)
}

export const COMMUNION_EVENT: EventInfo = {
  childrenNames: ['Adrián Guillermo', 'Gelmun Augusto'],
  dateString: 'Martes 8 de diciembre de 2026',
  timeString: '12:00 m.',
  churchName: 'Parroquia de San Pedro Apóstol',
  townName: 'Chiquiza',
  department: 'Boyacá',
  receptionNote: 'Al terminar la misa, comida en casa para seguir celebrando juntos en un ambiente de familia.',
  targetIsoDate: '2026-12-08T12:00:00-05:00',
};

export interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  totalSecondsRemaining: number;
}

export function calculateCountdown(targetDate: Date, currentDate: Date = new Date()): CountdownResult {
  const diffMs = targetDate.getTime() - currentDate.getTime();
  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isPast: true,
      totalSecondsRemaining: 0,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isPast: false,
    totalSecondsRemaining: totalSeconds,
  };
}

export function generateGoogleCalendarUrl(event: EventInfo = COMMUNION_EVENT): string {
  // Colombia is UTC-5; 12:00 PM COT is 17:00 UTC. Dec 8, 2026.
  const startUtc = '20261208T170000Z';
  const endUtc = '20261208T220000Z';
  const title = encodeURIComponent(
    `Primera Comunión de ${event.childrenNames.join(' y ')} López Bernal`
  );
  const location = encodeURIComponent(
    `${event.churchName}, ${event.townName}, ${event.department}`
  );
  const details = encodeURIComponent(
    `¡Un día muy especial para nuestra familia!\nPrimera Comunión de ${event.childrenNames.join(
      ' y '
    )} López Bernal.\n\nLugar: ${event.churchName}, ${event.townName}, ${event.department}.\nHora: ${event.timeString}.\n${event.receptionNote}`
  );

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtc}/${endUtc}&details=${details}&location=${location}`;
}

export function generateIcsContent(event: EventInfo = COMMUNION_EVENT): string {
  const startUtc = '20261208T170000Z';
  const endUtc = '20261208T220000Z';
  const summary = `Primera Comunión de ${event.childrenNames.join(' y ')} López Bernal`;
  const location = `${event.churchName}, ${event.townName}, ${event.department}`;
  const description = `¡Un día muy especial! Primera Comunión de ${event.childrenNames.join(' y ')} López Bernal en ${location}. ${event.receptionNote}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Primera Comunión//Adrian y Gelmun//ES',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `DTSTART:${startUtc}`,
    `DTEND:${endUtc}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export const RSVP_PHONE_RAW = '573214386084';
export const RSVP_PHONE_DISPLAY = '+57 321 438 6084';
export const RSVP_PHONE_NATIONAL = '321 438 6084';

export function generateWhatsAppRsvpUrl(
  guestName: string = '',
  attending: boolean = true,
  numGuests: number = 1,
  phoneNumber: string = RSVP_PHONE_RAW
): string {
  const greeting = guestName.trim()
    ? `¡Hola! Soy ${guestName.trim()}. `
    : '¡Hola! ';
  const status = attending
    ? `Confirmo con mucha alegría mi asistencia a la Primera Comunión de Adrián Guillermo y Gelmun Augusto López Bernal (${numGuests} persona${numGuests > 1 ? 's' : ''}). ¡Nos vemos el 8 de diciembre!`
    : 'Lamento mucho no poder acompañarlos físicamente en la Primera Comunión de Adrián Guillermo y Gelmun Augusto, pero estarán en mis oraciones y en mi corazón. ¡Felicidades!';

  const text = encodeURIComponent(`${greeting}${status}`);
  return `https://wa.me/${phoneNumber}?text=${text}`;
}

export const PUBLIC_SHARED_URL =
  'https://ais-pre-unv4trezslwixivcw35pil-645845983563.us-west2.run.app';

export function getPublicShareUrl(currentHref?: string): string {
  const urlToParse =
    currentHref || (typeof window !== 'undefined' ? window.location.href : '');

  if (urlToParse) {
    if (urlToParse.includes('ais-dev-')) {
      return urlToParse.replace('ais-dev-', 'ais-pre-').split('?')[0];
    }
    if (
      urlToParse.includes('aistudio.google.com') ||
      urlToParse.includes('localhost') ||
      urlToParse.includes('127.0.0.1')
    ) {
      return PUBLIC_SHARED_URL;
    }
    try {
      const parsed = new URL(urlToParse);
      return `${parsed.origin}${parsed.pathname}`;
    } catch {
      return PUBLIC_SHARED_URL;
    }
  }
  return PUBLIC_SHARED_URL;
}

export function getChurchMapsUrl(): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Parroquia San Pedro Apostol Chiquiza Boyaca Colombia'
  )}`;
}

export function generateCompleteWhatsAppInvitationText(guestName: string = ''): string {
  const greeting = guestName.trim()
    ? `✨ *¡Hola, ${guestName.trim()}!* ✨\n*¡Un día muy especial para nuestra familia!*\n\n`
    : `✨ *¡Un día muy especial para nuestra familia!* ✨\n\n`;

  const rsvpLink = `https://wa.me/${RSVP_PHONE_RAW}?text=${encodeURIComponent(
    '¡Hola! Confirmo con mucha alegría mi asistencia a la Primera Comunión de Adrián Guillermo y Gelmun Augusto López Bernal el martes 8 de diciembre.'
  )}`;

  return (
    `${greeting}` +
    `Con el corazón lleno de alegría y gratitud con Dios, queremos invitarte a compartir con nosotros la *Primera Comunión* de:\n\n` +
    `🕊️ *ADRIÁN GUILLERMO Y GELMUN AUGUSTO LÓPEZ BERNAL* 🕊️\n\n` +
    `Será un momento único, en el que recibirán por primera vez a Jesús en su corazón, y nos haría muy felices que los acompañes en este paso tan importante de su vida.\n\n` +
    `📅 *Fecha:* Martes 8 de diciembre de 2026\n` +
    `🕛 *Hora:* 12:00 m.\n` +
    `⛪ *Lugar:* Parroquia de San Pedro Apóstol, Chiquiza, Boyacá\n` +
    `📍 *Ver ubicación en Google Maps:*\n${getChurchMapsUrl()}\n\n` +
    `🍽️ *Recepción:* Al terminar la misa, nos encantaría que nos acompañes a una comida en casa para seguir celebrando juntos en un ambiente de familia.\n\n` +
    `🙏 _Tu compañía y tus oraciones harán este día aún más bonito. ¡Te esperamos con mucho cariño!_\n\n` +
    `📲 *Confirmar asistencia por WhatsApp (${RSVP_PHONE_NATIONAL}):*\n${rsvpLink}`
  );
}

export function generateCompleteShareWhatsAppUrl(guestName: string = ''): string {
  return `https://wa.me/?text=${encodeURIComponent(generateCompleteWhatsAppInvitationText(guestName))}`;
}

