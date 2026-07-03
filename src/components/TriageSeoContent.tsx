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
  if (location.slug === 'home' || location.slug === 'ursynow') return 'Kwalifikacja zgłoszenia w sprawie ósemki na Ursynowie';
  return `Kwalifikacja zgłoszenia w sprawie ósemki ${location.nazwa_lokalizacji}`;
};

export default function TriageSeoContent({ location, popularLocations }: TriageSeoContentProps) {
  const areaPhrase = getAreaPhrase(location);
  const relatedLocations = popularLocations.filter((item) => item.slug !== location.slug).slice(0, 12);

  const sections = [
    {
      icon: <AlertTriangle className="h-4 w-4" />,
      title: 'Kiedy warto działać szybciej?',
      body: `Jeśli sprawa z ósemką ${areaPhrase} wymaga szybszego kontaktu, zaznacz to w formularzu. Przy gorączce, narastającej opuchliźnie albo trudnościach z oddychaniem lub połykaniem nie czekaj na formularz.`,
    },
    {
      icon: <FileCheck className="h-4 w-4" />,
      title: 'Czy potrzebne jest RTG?',
      body: 'Jeśli masz aktualne RTG lub CBCT, warto zaznaczyć to w formularzu. Jeśli nie, podczas kontaktu ustalimy, czy diagnostyka będzie potrzebna przed dalszą decyzją.',
    },
    {
      icon: <Clock className="h-4 w-4" />,
      title: 'Co dzieje się po wysłaniu?',
      body: 'Zgłoszenie może zostać przekazane do współpracującego gabinetu na Ursynowie. Recepcja może oddzwonić w godzinach pracy i ustalić możliwy termin kontaktu lub konsultacji.',
    },
    {
      icon: <ShieldCheck className="h-4 w-4" />,
      title: 'Czy to zapis na zabieg?',
      body: 'Nie. Formularz służy do przekazania zgłoszenia i przygotowania kontaktu. Koszty, diagnostyka i plan leczenia są omawiane dopiero po konsultacji z lekarzem.',
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
              Ten krótki formularz jest przygotowany dla osób, które chcą przekazać zgłoszenie w sprawie ósemki do kontaktu zwrotnego z placówką partnerską na Ursynowie.
            </p>

            <div id="jak-dziala" className="mt-6 scroll-mt-24 rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-emerald-700">Transparentny proces</p>
                  <h3 className="mt-2 text-2xl font-black tracking-[-0.035em] text-slate-950">Jak działa ten serwis?</h3>
                </div>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                  Nie jest gabinetem
                </span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {[
                  'Wypełniasz krótki formularz kontaktowy dotyczący konsultacji w sprawie ósemki.',
                  'Zgłoszenie może zostać przekazane do współpracującego gabinetu stomatologicznego na Ursynowie.',
                  'Recepcja może oddzwonić w godzinach pracy i ustalić możliwy termin wizyty.',
                  'Serwis nie świadczy usług medycznych, nie diagnozuje i nie rezerwuje automatycznie zabiegu.',
                ].map((item, index) => (
                  <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 text-sm font-medium leading-relaxed text-slate-600">
                    <span className="mb-3 flex h-7 w-7 items-center justify-center rounded-xl bg-white text-xs font-black text-emerald-700 shadow-sm">
                      {index + 1}
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div id="koszt" className="mt-6 scroll-mt-24 rounded-3xl border border-cyan-100 bg-cyan-50/50 p-5 shadow-sm">
              <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">Co wpływa na koszt?</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">
                Koszt konsultacji lub usunięcia ósemki zależy między innymi od diagnostyki, położenia zęba, stopnia trudności i decyzji lekarza po badaniu. Formularz nie podaje automatycznej wyceny, bo bez konsultacji i analizy RTG/CBCT byłaby ona nieprecyzyjna.
              </p>
            </div>

            <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
              <h3 className="text-lg font-black tracking-[-0.02em] text-amber-950">Kiedy nie czekać na formularz?</h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-amber-900">
                Jeśli pojawia się gorączka, narastająca opuchlizna twarzy lub szyi, trudność z połykaniem, oddychaniem albo brak możliwości otwarcia ust, skontaktuj się pilnie z lekarzem, dentystą dyżurnym lub odpowiednią pomocą medyczną.
              </p>
            </div>

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

          <aside id="faq" className="scroll-mt-24 rounded-[2rem] border border-emerald-100 bg-slate-50 p-5 shadow-sm sm:p-6">
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
