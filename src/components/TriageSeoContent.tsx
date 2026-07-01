import Link from 'next/link';
import type { LocationRecord } from '@/lib/clinic';
import { TRIAGE_FAQ_ITEMS } from '@/lib/triageFaq';

type TriageSeoContentProps = {
  location: LocationRecord;
  popularLocations: LocationRecord[];
};

const getAreaPhrase = (location: LocationRecord) => {
  if (location.slug === 'home' || location.slug === 'ursynow') return 'na Ursynowie';
  return `w okolicy ${location.nazwa_lokalizacji}`;
};

const getAreaHeading = (location: LocationRecord) => {
  if (location.slug === 'home' || location.slug === 'ursynow') return 'Kwalifikacja objawów ósemki na Ursynowie';
  return `Kwalifikacja objawów ósemki ${location.nazwa_lokalizacji}`;
};

export default function TriageSeoContent({ location, popularLocations }: TriageSeoContentProps) {
  const areaPhrase = getAreaPhrase(location);
  const relatedLocations = popularLocations.filter((item) => item.slug !== location.slug).slice(0, 12);

  const sections = [
    {
      title: 'Kiedy warto sprawdzić pilność problemu?',
      body: `Ból ósemki ${areaPhrase} może mieć różne przyczyny: wyrzynanie, stan zapalny dziąsła, ucisk na sąsiedni ząb albo problem z zatrzymaną ósemką. Krótka kwalifikacja pomaga zebrać najważniejsze informacje przed rozmową: gdzie boli, jak mocny jest ból, czy pojawia się opuchlizna i czy masz aktualne RTG lub CBCT.`,
    },
    {
      title: 'Co daje kwalifikacja online?',
      body: 'Formularz nie stawia diagnozy i nie zapisuje automatycznie na zabieg. Jego zadaniem jest uporządkowanie zgłoszenia, wskazanie potencjalnej pilności kontaktu i przygotowanie rozmowy z gabinetem stomatologicznym w rejonie Metra Ursynów.',
    },
    {
      title: 'Jakie objawy są najważniejsze?',
      body: 'Największe znaczenie mają: narastający ból, opuchlizna, trudność z otwieraniem ust, ból przy nagryzaniu, nawracające stany zapalne oraz informacja, czy ósemka była już oceniana na zdjęciu. Jeśli objawy szybko się nasilają, nie warto odkładać kontaktu.',
    },
    {
      title: 'Jak wygląda kolejny krok?',
      body: 'Po wysłaniu formularza zgłoszenie trafia do kontaktu zwrotnego w godzinach pracy. Podczas rozmowy można ustalić, czy sensowna jest konsultacja, diagnostyka obrazowa lub inny dalszy krok. Koszty i plan leczenia są omawiane indywidualnie po ocenie sytuacji.',
    },
  ];

  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.05fr,0.95fr] lg:gap-12">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Informacje przed kontaktem</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">
              {getAreaHeading(location)}
            </h2>
            <p className="mt-4 max-w-3xl text-base font-medium leading-relaxed text-slate-600">
              Ten krótki wywiad jest przygotowany dla osób, które chcą ocenić, czy problem z ósemką może wymagać konsultacji, RTG albo pilniejszego kontaktu zwrotnego.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {sections.map((section) => (
                <article key={section.title} className="rounded-3xl border border-emerald-100 bg-emerald-50/35 p-5 shadow-sm">
                  <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">{section.title}</h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{section.body}</p>
                </article>
              ))}
            </div>
          </div>

          <aside className="rounded-[2rem] border border-emerald-100 bg-slate-50 p-5 shadow-sm sm:p-6">
            <h2 className="text-2xl font-black tracking-[-0.03em] text-slate-950">Najczęstsze pytania</h2>
            <div className="mt-5 space-y-3">
              {TRIAGE_FAQ_ITEMS.map((item) => (
                <details key={item.question} className="group rounded-2xl border border-white bg-white p-4 shadow-sm open:border-emerald-100">
                  <summary className="cursor-pointer list-none text-sm font-black leading-snug text-slate-900 marker:hidden">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>

            {relatedLocations.length > 0 && (
              <div className="mt-8 border-t border-emerald-100 pt-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-emerald-800">Popularne lokalizacje</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {relatedLocations.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.slug}`}
                      className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition-colors hover:border-emerald-300 hover:text-emerald-800"
                    >
                      {item.nazwa_lokalizacji}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}
