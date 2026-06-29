import type { LocationRecord } from './clinic';

export function generateMedicalSchema(location: LocationRecord) {
  const url = `https://www.osemki-warszawa.pl/${location.slug}`;
  const faq =
    location.faq && location.faq.length > 0
      ? location.faq
      : [
          {
            question: 'Czy formularz oznacza zapis na zabieg?',
            answer:
              'Nie. Formularz służy wyłącznie do kwalifikacji zgłoszenia i kontaktu zwrotnego. Decyzja o leczeniu zapada po konsultacji.',
          },
          {
            question: 'Czy muszę mieć skierowanie lub RTG?',
            answer:
              'Skierowanie zwykle nie jest konieczne. Jeśli nie masz aktualnego zdjęcia, podczas kontaktu ustalimy, czy diagnostyka będzie potrzebna.',
          },
        ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.osemki-warszawa.pl/#website',
        name: 'Ósemki Ursynów',
        url: 'https://www.osemki-warszawa.pl/',
        inLanguage: 'pl-PL',
      },
      {
        '@type': 'MedicalWebPage',
        '@id': `${url}#webpage`,
        url,
        name: `Kwalifikacja problemu z ósemką - ${location.nazwa_lokalizacji}`,
        description:
          'Niezależna kwalifikacja online dla osób z problemem ósemki w rejonie Ursynowa. Formularz nie jest zapisem na zabieg i nie zastępuje konsultacji lekarskiej.',
        inLanguage: 'pl-PL',
        isPartOf: {
          '@id': 'https://www.osemki-warszawa.pl/#website',
        },
        about: {
          '@id': `${url}#service`,
        },
      },
      {
        '@type': 'Service',
        '@id': `${url}#service`,
        name: 'Kwalifikacja online problemu z ósemką',
        serviceType: 'Online lead qualification',
        areaServed: {
          '@type': 'Place',
          name: 'rejon Metra Ursynów',
        },
        provider: {
          '@type': 'Organization',
          name: 'Ósemki Ursynów',
          url: 'https://www.osemki-warszawa.pl/',
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
            name: 'Ursynów',
            item: 'https://www.osemki-warszawa.pl/ursynow',
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
