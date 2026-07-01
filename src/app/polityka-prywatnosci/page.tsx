import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Polityka prywatności | Ósemki Ursynów',
  description:
    'Informacje o przetwarzaniu danych podawanych w formularzu kwalifikacji objawów ósemki na Ursynowie.',
  alternates: {
    canonical: '/polityka-prywatnosci',
  },
};

const sections = [
  {
    title: 'Zakres danych',
    body: 'Formularz może zbierać imię, numer telefonu, wybrane odpowiedzi dotyczące objawów, preferowany czas kontaktu, adres strony, podstawowe dane techniczne przeglądarki oraz parametry kampanii, jeśli użytkownik trafił na stronę z reklamy lub linku oznaczonego UTM.',
  },
  {
    title: 'Cel przetwarzania',
    body: 'Dane są wykorzystywane do obsługi zgłoszenia, przygotowania kontaktu zwrotnego, uporządkowania informacji o objawach oraz ustalenia, jaki kolejny krok może mieć sens: rozmowa, konsultacja lub diagnostyka. Formularz nie zastępuje konsultacji lekarskiej i nie stawia diagnozy.',
  },
  {
    title: 'Informacje o objawach',
    body: 'Odpowiedzi dotyczące bólu, opuchlizny, RTG lub innych objawów mogą dotyczyć zdrowia. Dlatego w formularzu prosimy o osobną zgodę na przetwarzanie tych informacji wyłącznie w celu obsługi zgłoszenia i kontaktu zwrotnego.',
  },
  {
    title: 'Kontakt i przechowywanie',
    body: 'Dane z formularza trafiają do systemu obsługi zgłoszeń i mogą być przekazane osobom obsługującym kontakt zwrotny. Dane nie powinny być wykorzystywane do marketingu bez odrębnej podstawy prawnej lub osobnej zgody.',
  },
  {
    title: 'Analityka',
    body: 'Strona może zbierać zdarzenia analityczne bez danych osobowych, takie jak rozpoczęcie kwalifikacji, odpowiedź na krok quizu, kliknięcie przycisku kontaktu lub status wysłania formularza. Zdarzenia służą do poprawy użyteczności strony.',
  },
  {
    title: 'Prawa użytkownika',
    body: 'Użytkownik może żądać dostępu do danych, ich sprostowania, usunięcia, ograniczenia przetwarzania lub cofnięcia zgody, jeśli przetwarzanie odbywa się na podstawie zgody.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#f7fbf8] px-4 py-10 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5 sm:p-10">
        <Link href="/" className="text-sm font-black uppercase tracking-widest text-emerald-700 hover:text-emerald-800">
          Ósemki Ursynów
        </Link>
        <h1 className="mt-4 text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl">
          Polityka prywatności
        </h1>
        <p className="mt-5 text-base font-medium leading-relaxed text-slate-600">
          Ta strona opisuje podstawowe zasady przetwarzania danych w formularzu kwalifikacji objawów ósemki. Dokument powinien zostać zweryfikowany i uzupełniony o pełne dane administratora przed uruchomieniem szerokich kampanii płatnych.
        </p>

        <div className="mt-8 grid gap-4">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-emerald-100 bg-emerald-50/35 p-5">
              <h2 className="text-xl font-black tracking-[-0.02em] text-slate-950">{section.title}</h2>
              <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-medium leading-relaxed text-amber-900">
          To nie jest porada prawna. Przed skalowaniem ruchu i zbieraniem danych o objawach dokument powinien zostać sprawdzony przez prawnika lub osobę odpowiedzialną za ochronę danych.
        </div>
      </div>
    </main>
  );
}
