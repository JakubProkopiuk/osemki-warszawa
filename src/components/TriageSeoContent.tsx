import Link from 'next/link';
import { AlertTriangle, Clock, FileCheck, MapPin, ShieldCheck } from 'lucide-react';
import { DentalProcessVisualStrip } from './DentalTrustVisuals';
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
      icon: <AlertTriangle className="h-4 w-4" />,
      title: 'Kiedy warto działać szybciej?',
      body: `Silny ból ósemki ${areaPhrase}, opuchlizna albo trudność z otwieraniem ust to sygnały, których nie warto ignorować. Krótka kwalifikacja porządkuje objawy przed rozmową.`,
    },
    {
      icon: <FileCheck className="h-4 w-4" />,
      title: 'Czy potrzebne jest RTG?',
      body: 'Jeśli masz aktualne RTG lub CBCT, warto zaznaczyć to w formularzu. Jeśli nie, podczas kontaktu ustalimy, czy diagnostyka będzie potrzebna przed dalszą decyzją.',
    },
    {
      icon: <Clock className="h-4 w-4" />,
      title: 'Co dzieje się po wysłaniu?',
      body: 'Zgłoszenie trafia do kontaktu zwrotnego w godzinach pracy. Rozmowa pomaga ustalić, czy sensowna jest konsultacja, RTG albo spokojne zaplanowanie kolejnego kroku.',
    },
    {
      icon: <ShieldCheck className="h-4 w-4" />,
      title: 'Czy to zapis na zabieg?',
      body: 'Nie. Formularz służy do kwalifikacji zgłoszenia i przygotowania kontaktu. Koszty, diagnostyka i plan leczenia są omawiane dopiero po ocenie sytuacji.',
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

            {location.slug !== 'home' && location.slug !== 'ursynow' && (
              <div className="mt-6 rounded-3xl border border-cyan-100 bg-cyan-50/50 p-5 shadow-sm">
                <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">
                  Lokalny kontekst: {location.nazwa_lokalizacji}
                </h3>
                <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                  Jeśli jesteś w okolicy {location.nazwa_lokalizacji}, formularz pomaga zebrać informacje przed kontaktem ze współpracującym gabinetem w rejonie Metra Ursynów. W rozmowie można odnieść się do najbliższego punktu orientacyjnego: {location.punkt_orientacyjny || 'Metro Ursynów'}.
                </p>
              </div>
            )}

            <div className="mt-8">
              <DentalProcessVisualStrip />
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {sections.map((section) => (
                <article key={section.title} className="rounded-3xl border border-emerald-100 bg-emerald-50/35 p-5 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                    {section.icon}
                  </div>
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

            <div className="mt-8 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <MapPin className="h-4 w-4" />
              </div>
              <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">Kontakt w rejonie Ursynowa</h3>
              <ul className="mt-4 space-y-2 text-sm font-medium leading-relaxed text-slate-600">
                <li>Obsługa zgłoszeń: pon-pt 9:00-20:00.</li>
                  <li>Lokalizacja wizyty: współpracujący gabinet w okolicy Metra Ursynów.</li>
                <li>Konsultacja, RTG i dalszy krok są ustalane po kontakcie.</li>
                <li>Zgłoszenie nie oznacza automatycznego zapisu na zabieg.</li>
              </ul>
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
