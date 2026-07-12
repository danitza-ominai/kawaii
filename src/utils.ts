import { AvatarConfig } from './types';

/**
 * Calculates the best recommended clothing size based on avatar measurements and target audience.
 */
export function calculateRecommendedSize(config: AvatarConfig | null): string {
  if (!config) return 'M'; // Default fallback

  const { ageType, bust, waist, hips } = config;

  if (ageType === 'daughter') {
    // Girls sizing (8-14 years in Ecuador)
    // Sizing breaks: Niña 8-10, Niña 10-12, Niña 12-14
    if (bust <= 70 && waist <= 60) {
      return 'Niña 8-10';
    } else if (bust <= 77 && waist <= 65) {
      return 'Niña 10-12';
    } else {
      return 'Niña 12-14';
    }
  } else {
    // Adult sizes: S, M, L
    // We compare with the upper bounds of standard Ecuadorian/Latam sizes
    // S: Busto ~ 80-86, Cintura ~ 60-66
    // M: Busto ~ 87-93, Cintura ~ 67-73
    // L: Busto ~ 94-100, Cintura ~ 74-80
    if (bust <= 86 && waist <= 66) {
      return 'S';
    } else if (bust <= 94 && waist <= 74) {
      return 'M';
    } else {
      return 'L';
    }
  }
}

/**
 * Formats a currency value in USD.
 */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat('es-EC', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}

/**
 * Generates an estimated delivery date in Spanish (Ecuador).
 * It calculates the delivery as "este miércoles 16 de julio" or similar based on current local time plus 3 days.
 */
export function getEstimatedDeliveryDate(currentDateStr: string = '2026-07-12T12:42:34-07:00'): string {
  const current = new Date(currentDateStr);
  // Add 3 days for standard shipping in Ecuador (Servientrega / Urbano)
  const delivery = new Date(current);
  delivery.setDate(current.getDate() + 3);

  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const dayName = days[delivery.getDay()];
  const dayNum = delivery.getDate();
  const monthName = months[delivery.getMonth()];

  return `${dayName} ${dayNum} de ${monthName}`;
}
