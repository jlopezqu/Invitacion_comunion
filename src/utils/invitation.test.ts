import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCountdown,
  generateGoogleCalendarUrl,
  generateIcsContent,
  generateWhatsAppRsvpUrl,
  getPublicShareUrl,
  generateCompleteWhatsAppInvitationText,
  COMMUNION_EVENT,
} from './invitation.ts';

test('calculateCountdown calculates days, hours, minutes and seconds accurately', () => {
  const target = new Date('2026-12-08T12:00:00Z');
  // 10 days, 2 hours, 30 minutes, 15 seconds before
  const current = new Date('2026-11-28T09:29:45Z');
  const res = calculateCountdown(target, current);

  assert.equal(res.days, 10);
  assert.equal(res.hours, 2);
  assert.equal(res.minutes, 30);
  assert.equal(res.seconds, 15);
  assert.equal(res.isPast, false);
});

test('calculateCountdown handles past dates gracefully', () => {
  const target = new Date('2026-12-08T12:00:00Z');
  const current = new Date('2026-12-09T12:00:00Z');
  const res = calculateCountdown(target, current);

  assert.equal(res.isPast, true);
  assert.equal(res.days, 0);
  assert.equal(res.totalSecondsRemaining, 0);
});

test('generateGoogleCalendarUrl encodes correct parameters', () => {
  const url = generateGoogleCalendarUrl(COMMUNION_EVENT);
  assert.match(url, /calendar\.google\.com/);
  assert.match(url, /Adri%C3%A1n%20Guillermo/);
  assert.match(url, /Chiquiza/);
  assert.match(url, /20261208T170000Z/);
});

test('generateIcsContent produces valid VCALENDAR format', () => {
  const ics = generateIcsContent(COMMUNION_EVENT);
  assert.match(ics, /BEGIN:VCALENDAR/);
  assert.match(ics, /SUMMARY:Primera Comunión de Adrián Guillermo y Gelmun Augusto López Bernal/);
  assert.match(ics, /END:VCALENDAR/);
});

test('generateWhatsAppRsvpUrl produces valid wa.me link with destination phone and customized text', () => {
  const urlAttending = generateWhatsAppRsvpUrl('Familia Gómez', true, 3);
  assert.match(urlAttending, /wa\.me\/573214386084\?text=/);
  assert.match(urlAttending, /Familia%20G%C3%B3mez/);
  assert.match(urlAttending, /3%20personas/);

  const urlDecline = generateWhatsAppRsvpUrl('Tía Carmen', false);
  assert.match(urlDecline, /wa\.me\/573214386084\?text=/);
  assert.match(urlDecline, /oraciones/);
});

test('getPublicShareUrl converts ais-dev URLs to public ais-pre URLs', () => {
  const devUrl =
    'https://ais-dev-unv4trezslwixivcw35pil-645845983563.us-west2.run.app/some-page?autostart=1';
  const publicUrl = getPublicShareUrl(devUrl);
  assert.equal(
    publicUrl,
    'https://ais-pre-unv4trezslwixivcw35pil-645845983563.us-west2.run.app/some-page'
  );

  const authBridgeUrl =
    'https://aistudio.google.com/applet-auth-bridge?applet_id=9351f493-9860-413e-87f6-6402694d0be3';
  assert.equal(
    getPublicShareUrl(authBridgeUrl),
    'https://ais-pre-unv4trezslwixivcw35pil-645845983563.us-west2.run.app'
  );
});

test('generateCompleteWhatsAppInvitationText contains full invitation and valid Maps/RSVP links without broken app URLs', () => {
  const text = generateCompleteWhatsAppInvitationText('Queridos Padrinos');
  assert.match(text, /Queridos Padrinos/);
  assert.match(text, /ADRIÁN GUILLERMO Y GELMUN AUGUSTO LÓPEZ BERNAL/);
  assert.match(text, /Martes 8 de diciembre de 2026/);
  assert.match(text, /Parroquia de San Pedro Apóstol/);
  assert.match(text, /wa\.me\/573214386084/);
  assert.match(text, /google\.com\/maps/);
  assert.equal(text.includes('ais-pre-'), false);
  assert.equal(text.includes('aistudio.google.com'), false);
});
