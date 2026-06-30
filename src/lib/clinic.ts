export type LocationRecord = {
  slug: string;
  nazwa_lokalizacji: string;
  klinika: string;
  czas_dojazdu: string;
  punkt_orientacyjny?: string;
  komunikacja?: string;
  parking?: string;
  faq?: Array<{ question: string; answer: string }>;
  lat?: number;
  lng?: number;
  searchVolume?: number;
  hubSlug?: string;
  hubName?: string;
  displayName?: string;
};

export type ClinicProfile = {
  clinicName: string;
  hubSlug: string;
  hubName: string;
  openingDate: string;
  latitude: number;
  longitude: number;
};

const URSYNOW_PROFILE: ClinicProfile = {
  clinicName: 'Ósemki Ursynów',
  hubSlug: 'ursynow',
  hubName: 'Ursynów',
  openingDate: '2018-01-01',
  latitude: 52.1509,
  longitude: 21.0485,
};

export function getClinicProfile(): ClinicProfile {
  return URSYNOW_PROFILE;
}

const hashSlug = (slug: string) =>
  slug.split('').reduce((acc, char) => (acc * 33 + char.charCodeAt(0)) >>> 0, 17);

export function getLocationCoordinates(location: LocationRecord): { lat: number; lng: number } {
  if (typeof location.lat === 'number' && typeof location.lng === 'number') {
    return { lat: location.lat, lng: location.lng };
  }

  const clinic = getClinicProfile();
  const hash = hashSlug(location.slug);
  const latOffset = ((hash % 400) - 200) / 10000;
  const lngOffset = ((((hash / 400) | 0) % 400) - 200) / 10000;
  return {
    lat: clinic.latitude + latOffset,
    lng: clinic.longitude + lngOffset,
  };
}

export function getLocationSearchVolume(location: LocationRecord): number {
  if (typeof location.searchVolume === 'number') {
    return location.searchVolume;
  }
  return 200 + (hashSlug(location.slug) % 800);
}
