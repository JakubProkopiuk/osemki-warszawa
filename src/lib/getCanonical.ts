import type { LocationRecord } from './clinic';
import { getLocationCoordinates, getLocationSearchVolume } from './clinic';

const EARTH_RADIUS = 6371e3;

const toRadians = (value: number) => (value * Math.PI) / 180;

export function getDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const phi1 = toRadians(a.lat);
  const phi2 = toRadians(b.lat);
  const deltaPhi = toRadians(b.lat - a.lat);
  const deltaLambda = toRadians(b.lng - a.lng);

  const h =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS * c;
}

export function getCanonical(
  location: LocationRecord,
  allLocations: LocationRecord[],
): string {
  const currentCoords = getLocationCoordinates(location);
  const currentVolume = getLocationSearchVolume(location);

  const strongerNearby = allLocations
    .filter((candidate) => candidate.slug !== location.slug)
    .map((candidate) => ({
      candidate,
      distance: getDistance(currentCoords, getLocationCoordinates(candidate)),
      volume: getLocationSearchVolume(candidate),
    }))
    .filter(({ distance, volume }) => distance <= 300 && volume > currentVolume)
    .sort((a, b) => b.volume - a.volume || a.distance - b.distance || a.candidate.slug.localeCompare(b.candidate.slug))[0]
    ?.candidate;

  const canonicalSlug = strongerNearby?.slug ?? location.slug;
  return `https://www.osemki-warszawa.pl/${canonicalSlug}`;
}
