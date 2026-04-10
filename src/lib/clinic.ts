export type LocationRecord = {
  slug: string;
  nazwa_lokalizacji: string;
  klinika: string;
  czas_dojazdu: string;
  punkt_orientacyjny?: string;
  komunikacja?: string;
  parking?: string;
  reviews?: Array<{ author: string; text: string; rating: number }>;
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
  address: string;
  phone: string;
  doctorName: string;
  doctorSpecialty: string;
  hubSlug: string;
  hubName: string;
  openingDate: string;
  latitude: number;
  longitude: number;
};

const CLINIC_PROFILES: Record<'pruszkowska' | 'ken', ClinicProfile> = {
  pruszkowska: {
    clinicName: 'Ochota na Uśmiech – Pruszkowska 6b',
    address: 'ul. Pruszkowska 6b, 02-118 Warszawa',
    phone: '+48221234567',
    doctorName: 'lek. dent. Małgorzata Sturska',
    doctorSpecialty: 'Oral and Maxillofacial Surgery',
    hubSlug: 'ochota',
    hubName: 'Ochota',
    openingDate: '2016-01-01',
    latitude: 52.2092,
    longitude: 20.9692,
  },
  ken: {
    clinicName: 'Ochota na Uśmiech – KEN 96',
    address: 'al. KEN 96, 02-777 Warszawa',
    phone: '+48229876543',
    doctorName: 'lek. dent. Natalia Kowalczyk-Zuchora',
    doctorSpecialty: 'Oral and Maxillofacial Surgery',
    hubSlug: 'ursynow',
    hubName: 'Ursynów',
    openingDate: '2018-01-01',
    latitude: 52.1509,
    longitude: 21.0485,
  },
};

export function getClinicProfile(clinicLabel: string): ClinicProfile {
  if (clinicLabel.toLowerCase().includes('pruszkowska')) {
    return CLINIC_PROFILES.pruszkowska;
  }
  return CLINIC_PROFILES.ken;
}

const hashSlug = (slug: string) =>
  slug.split('').reduce((acc, char) => (acc * 33 + char.charCodeAt(0)) >>> 0, 17);

export function getLocationCoordinates(location: LocationRecord): { lat: number; lng: number } {
  if (typeof location.lat === 'number' && typeof location.lng === 'number') {
    return { lat: location.lat, lng: location.lng };
  }

  const clinic = getClinicProfile(location.klinika);
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
