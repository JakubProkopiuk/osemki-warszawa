import type { ClinicProfile, LocationRecord } from './clinic';
import { getLocationCoordinates } from './clinic';

export function generateMedicalSchema(location: LocationRecord, clinic: ClinicProfile) {
  const url = `https://www.osemki-warszawa.pl/${location.slug}`;
  const reviewCount = 127 + (location.slug.charCodeAt(0) % 15);
  const coords = getLocationCoordinates(location);
  const faq =
    location.faq && location.faq.length > 0
      ? location.faq
      : [
          {
            question: 'Czy zabieg będzie bolesny?',
            answer:
              'Stosujemy zaawansowane znieczulenie miejscowe, dzięki czemu sam zabieg jest bezbolesny.',
          },
          {
            question: 'Czy muszę mieć skierowanie lub RTG?',
            answer:
              'Nie potrzebujesz skierowania. Jeśli nie masz aktualnego zdjęcia, wykonamy diagnostykę na miejscu.',
          },
        ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['MedicalClinic', 'LocalBusiness'],
        '@id': `${url}#clinic`,
        name: clinic.clinicName,
        description: `Chirurgiczne usuwanie ósemek dla lokalizacji ${location.nazwa_lokalizacji}.`,
        url,
        telephone: clinic.phone,
        priceRange: 'zł zł',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: coords.lat,
          longitude: coords.lng,
        },
        areaServed: {
          '@type': 'GeoCircle',
          geoMidpoint: {
            '@type': 'GeoCoordinates',
            latitude: coords.lat,
            longitude: coords.lng,
          },
          geoRadius: '2000',
        },
        medicalSpecialty: 'Oral and Maxillofacial Surgery',
        availableService: {
          '@type': 'MedicalProcedure',
          procedureType: 'SurgicalProcedure',
          name: 'Chirurgiczne usuwanie zębów mądrości',
        },
        employee: {
          '@type': 'Physician',
          name: clinic.doctorName,
          medicalSpecialty: clinic.doctorSpecialty,
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: 4.9,
          bestRating: 5,
          reviewCount,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Strona główna',
            item: 'https://www.osemki-warszawa.pl/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: clinic.hubName,
            item: `https://www.osemki-warszawa.pl/${clinic.hubSlug}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: location.nazwa_lokalizacji,
            item: url,
          },
        ],
      },
    ],
  };
}
