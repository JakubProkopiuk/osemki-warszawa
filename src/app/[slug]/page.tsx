import { notFound } from 'next/navigation';
import LocationClient from './LocationClient';
import locations from '../../data/locations.json';
import { getClinicProfile, getLocationSearchVolume, type LocationRecord } from '@/lib/clinic';
import { getCanonical } from '@/lib/getCanonical';

export const revalidate = 2_592_000;
export const dynamicParams = true;

type LocationData = LocationRecord;

const allLocations = locations as LocationData[];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const location = allLocations.find((l) => l.slug === resolvedParams.slug);

  if (!location) return { title: 'Lokalizacja nie znaleziona' };

  const isOchota = location.klinika.includes('Pruszkowska');
  const dzielnicaGlowna = isOchota ? 'Ochota' : 'Ursynów';
  const canonical = getCanonical(location, allLocations);
  const landmark = location.punkt_orientacyjny ?? `okolicy ${dzielnicaGlowna}`;
  const travelTime = location.czas_dojazdu || 'kilkanaście minut';
  
  return {
    title: `Usuwanie Ósemek ${location.nazwa_lokalizacji} | Bezboleśnie | Chirurgia ${dzielnicaGlowna}`,
    description: `Boli Cię ząb mądrości w okolicy: ${location.nazwa_lokalizacji}? Profesjonalna chirurgia blisko ${landmark}. Sprawdź wolne terminy i dotrzyj do nas w ${travelTime}!`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `Chirurgiczne Usuwanie Ósemek - ${location.nazwa_lokalizacji}`,
      description: `Bezbolesne zabiegi blisko ${location.punkt_orientacyjny}. Zapisz się już dziś!`,
      url: canonical,
      siteName: 'Ochota na Uśmiech',
      locale: 'pl_PL',
      type: 'website',
    },
  };
}

export async function generateStaticParams() {
  const topLocations = [...allLocations]
    .sort((a, b) => getLocationSearchVolume(b) - getLocationSearchVolume(a))
    .slice(0, 200);

  return topLocations.map((loc) => ({
    slug: loc.slug,
  }));
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const locationData = allLocations.find((loc) => loc.slug === resolvedParams.slug);

  if (!locationData) {
    return notFound();
  }

  const clinicProfile = getClinicProfile(locationData.klinika);
  const enrichedLocation: LocationData = {
    ...locationData,
    hubSlug: locationData.hubSlug ?? clinicProfile.hubSlug,
    hubName: locationData.hubName ?? clinicProfile.hubName,
    displayName: locationData.displayName ?? locationData.nazwa_lokalizacji,
  };

  const isPruszkowska = locationData.klinika.toLowerCase().includes('pruszkowska');
  const clinicName = isPruszkowska
    ? 'Ochota na Uśmiech - Ochota'
    : 'Ochota na Uśmiech - Ursynów';
  const clinicAddress = isPruszkowska
    ? 'ul. Pruszkowska 6b, Warszawa'
    : 'al. KEN 96, Warszawa';

  const faqItems = [
    {
      question: 'Czy zabieg będzie bolesny?',
      answer:
        'Stosujemy zaawansowane znieczulenie miejscowe, dzięki czemu sam zabieg jest całkowicie bezbolesny. Czujesz jedynie delikatny dotyk, bez żadnego dyskomfortu.',
    },
    {
      question: 'Czy muszę mieć skierowanie lub RTG?',
      answer:
        'Nie potrzebujesz skierowania. Jeśli nie posiadasz aktualnego zdjęcia pantomograficznego, wykonamy precyzyjną diagnostykę w naszym gabinecie przed zabiegiem.',
    },
    {
      question: 'Co po zabiegu? Czy dostanę zwolnienie (L4)?',
      answer:
        'Większość pacjentów wraca do normalnych obowiązków już następnego dnia. W razie potrzeby wystawiamy elektroniczne zwolnienie lekarskie (e-ZLA) na czas rekonwalescencji.',
    },
    {
      question: 'Jakie są koszty usunięcia ósemki?',
      answer:
        'Koszt zabiegu jest zawsze ustalany indywidualnie na podstawie zdjęcia RTG i stopnia skomplikowania. Gwarantujemy jednak pełną przejrzystość – dokładną i ostateczną wycenę, bez żadnych "ukrytych kosztów", poznasz zawsze przed podaniem znieczulenia.',
    },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MedicalClinic',
        '@id': `https://www.osemki-warszawa.pl/${enrichedLocation.slug}#clinic`,
        name: clinicName,
        address: {
          '@type': 'PostalAddress',
          streetAddress: clinicAddress,
          addressLocality: 'Warszawa',
          addressCountry: 'PL',
        },
        areaServed: enrichedLocation.nazwa_lokalizacji,
        url: `https://www.osemki-warszawa.pl/${enrichedLocation.slug}`,
        telephone: clinicProfile.phone,
      },
      {
        '@type': 'FAQPage',
        '@id': `https://www.osemki-warszawa.pl/${enrichedLocation.slug}#faq`,
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <LocationClient locationData={enrichedLocation} />
    </>
  );
}
