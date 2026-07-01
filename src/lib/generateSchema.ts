import type { LocationRecord } from './clinic';
import { TRIAGE_FAQ_ITEMS } from './triageFaq';

const BASE_URL = 'https://www.osemki-warszawa.pl';

export function generateMedicalSchema(location: LocationRecord) {
  const url = location.slug === 'home' ? `${BASE_URL}/` : `${BASE_URL}/${location.slug}`;
  const faq = location.faq && location.faq.length > 0 ? location.faq : TRIAGE_FAQ_ITEMS;
  const breadcrumbItems =
    location.slug === 'home'
      ? [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Strona główna',
            item: `${BASE_URL}/`,
          },
        ]
      : [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Strona główna',
            item: `${BASE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Ursynów',
            item: `${BASE_URL}/ursynow`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: location.nazwa_lokalizacji,
            item: url,
          },
        ];

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name: 'Ósemki Ursynów',
        url: `${BASE_URL}/`,
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
          '@id': `${BASE_URL}/#website`,
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
          url: `${BASE_URL}/`,
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
        itemListElement: breadcrumbItems,
      },
    ],
  };
}
