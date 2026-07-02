import type { FlowConfig } from './types';

export const wisdomTeethFlow: FlowConfig = {
  service: 'wisdom_teeth',
  variant: 'clinical_triage',
  domain: 'osemki-warszawa.pl',
  location: 'Ursynów',
  webhookUrl: 'https://hook.eu1.make.com/k73x9s65dxykfhry5uyodhl6bg2kvkx7',
  intro: {
    eyebrow: 'Ósemki Ursynów · serwis kwalifikacyjny',
    title: 'Problem z ósemką na Ursynowie?',
    localTitle: (localArea) => `Problem z ósemką w okolicy ${localArea}?`,
    description:
      'Odpowiedz na kilka krótkich pytań. Zgłoszenie może zostać przekazane do współpracującego gabinetu stomatologicznego na Ursynowie w celu kontaktu telefonicznego.',
    cta: 'Rozpocznij kwalifikację',
  },
  steps: [
    {
      id: 'symptom',
      type: 'choice',
      eyebrow: '1 / zgłoszenie',
      question: 'Czego dotyczy zgłoszenie?',
      helper: 'Wybierz najbliższą opcję. Szczegóły medyczne najlepiej omówić bezpośrednio podczas kontaktu.',
      options: [
        {
          value: 'Chcę skonsultować ósemkę',
          label: 'Chcę skonsultować ósemkę',
          description: 'Szukasz kontaktu w sprawie konsultacji lub dalszego kroku.',
          feedback: 'Dobrze. Sprawdźmy, jak przygotować zgłoszenie do kontaktu.',
        },
        {
          value: 'Mam zalecenie lub skierowanie',
          label: 'Mam zalecenie lub skierowanie',
          description: 'Dentysta, ortodonta lub inny specjalista zasugerował konsultację.',
          feedback: 'To ważna informacja do przekazania przy rozmowie.',
        },
        {
          value: 'Mam RTG lub CBCT i chcę omówić dalszy krok',
          label: 'Mam RTG / CBCT',
          description: 'Masz diagnostykę i chcesz ustalić, czy warto umówić konsultację.',
          feedback: 'Dobrze, diagnostyka może pomóc w przygotowaniu rozmowy.',
        },
        {
          value: 'Chcę zapytać o możliwy termin',
          label: 'Chcę zapytać o termin',
          description: 'Interesuje Cię kontakt w sprawie dostępności konsultacji.',
          feedback: 'Jasne. Ustalimy jeszcze preferowany czas kontaktu.',
        },
        {
          value: 'Sprawa wydaje się pilna',
          label: 'Sprawa wydaje się pilna',
          description: 'Chcesz możliwie szybki kontakt w sprawie ósemki.',
          feedback: 'Oznaczymy zgłoszenie jako priorytetowe w godzinach kontaktu.',
          urgent: true,
        },
      ],
    },
    {
      id: 'has_rtg',
      type: 'choice',
      eyebrow: '2 / diagnostyka',
      question: 'Czy masz aktualne RTG albo CBCT?',
      helper: 'Nie przesyłaj zdjęcia przez formularz. Wystarczy zaznaczyć, czy masz diagnostykę.',
      options: [
        { value: 'Mam', label: 'Mam', feedback: 'Świetnie, to może przyspieszyć ocenę sytuacji.' },
        { value: 'Nie mam', label: 'Nie mam', feedback: 'W porządku. Podczas kontaktu ustalimy, czy diagnostyka będzie potrzebna.' },
        { value: 'Nie wiem, czy aktualne', label: 'Nie wiem, czy aktualne', feedback: 'Koordynator pomoże ustalić, czy zdjęcie jest wystarczające.' },
        { value: 'Mam skierowanie', label: 'Mam skierowanie', feedback: 'To dobra informacja do przekazania przy rozmowie.' },
      ],
    },
    {
      id: 'preferred_contact_time',
      type: 'choice',
      eyebrow: '3 / kontakt',
      question: 'Kiedy najlepiej do Ciebie zadzwonić?',
      helper: 'Zgłoszenia obsługiwane są telefonicznie od poniedziałku do piątku w godzinach 9:00-20:00.',
      options: [
        { value: 'Jak najszybciej', label: 'Jak najszybciej', feedback: 'Oznaczymy preferencję szybkiego kontaktu.', urgent: true },
        { value: 'Dziś', label: 'Dziś' },
        { value: 'Jutro', label: 'Jutro' },
        { value: 'W tym tygodniu', label: 'W tym tygodniu' },
      ],
    },
    {
      id: 'lead_capture',
      type: 'lead',
      eyebrow: '4 / ostatni krok',
      question: 'Zostaw numer do kontaktu w sprawie zgłoszenia.',
      helper: 'Zgłoszenie może trafić do współpracującego gabinetu na Ursynowie. Kontakt odbywa się od poniedziałku do piątku w godzinach 9:00-20:00.',
    },
  ],
  finalMessages: {
    high: {
      title: 'Zgłoszenie priorytetowe przyjęte',
      body:
        'Zgłoszenie oznaczymy jako priorytetowe. Może zostać przekazane do współpracującego gabinetu, który oddzwoni w pierwszej kolejności w godzinach pracy: pon-pt 9:00-20:00.',
    },
    medium: {
      title: 'Zgłoszenie zapisane',
      body:
        'Zgłoszenie może zostać przekazane do współpracującego gabinetu, który oddzwoni w wybranym terminie lub w najbliższym dostępnym oknie kontaktu w godzinach pracy: pon-pt 9:00-20:00.',
    },
    low: {
      title: 'Dziękujemy, zgłoszenie zapisane',
      body:
        'Nie wygląda to na sytuację bardzo pilną, ale warto sprawdzić temat, jeśli objawy wracają albo masz zalecenie od ortodonty. Kontakt odbywa się w godzinach pracy: pon-pt 9:00-20:00.',
    },
  },
};
