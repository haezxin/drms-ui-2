import type { Coordinates } from '../types/mission';

export function formatCoordinates({ lat, lng }: Coordinates): string {
  return `${lat.toFixed(4)}° N · ${lng.toFixed(4)}° E`;
}

export function formatHeading(deg: number): string {
  return `${String(Math.round(deg)).padStart(3, '0')}°`;
}