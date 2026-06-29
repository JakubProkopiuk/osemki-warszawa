import type { FlowConfig } from './types';

export const wisdomTeethFlow: FlowConfig = {
  service: 'wisdom_teeth',
  variant: 'clinical_triage',
  domain: 'osemki-warszawa.pl',
  location: 'Ursynów',
  webhookUrl: 'https://hook.eu1.make.com/k73x9s65dxykfhry5uyodhl6bg2kvkx7',
  intro: {
    eyebrow: 'Szybka kwalifikacja',
    title: 'Boli ósemka na Ursynowie?',
    localTitle: (localArea) => `Boli ósemka w okolicy ${localArea}?`,
    description:
      'Odpowiedz na kilka pytań i sprawdź, czy warto zacząć od konsultacji, RTG albo kontaktu z koordynatorem.',
    cta: 'Rozpocznij kwalifikację',
  },
  steps: [
    {
      id: 'symptom',
      type: 'choice',
      eyebrow: '1 / objawy',
      question: 'Co się dzieje z ósemką?',
      helper: 'Wybierz odpowiedź najbliższą Twojej sytuacji.',
      options: [
        {
          value: 'Boli',
          label: 'Boli',
          description: 'Ćmienie, pulsowanie albo ból przy nagryzaniu.',
          feedback: 'Rozumiem. Sprawdźmy, jak pilna może być sytuacja.',
        },
        {
          value: 'Jest opuchlizna',
          label: 'Jest opuchlizna',
          description: 'Obrzęk, stan zapalny lub narastający dyskomfort.',
          feedback: 'Opuchlizna może wymagać szybszej oceny. Oznaczymy to jako ważne.',
          urgent: true,
        },
        {
          value: 'Mam zalecenie od ortodonty',
          label: 'Mam zalecenie od ortodonty',
          description: 'Ósemki mogą przeszkadzać w leczeniu ortodontycznym.',
          feedback: 'Dobrze, to pomaga zaplanować dalszy krok.',
        },
        {
          value: 'Chcę sprawdzić ósemki',
          label: 'Chcę sprawdzić ósemki',
          description: 'Nie boli, ale chcesz ocenić sytuację.',
          feedback: 'Jasne, kwalifikacja pomoże ustalić, czy potrzebne jest RTG.',
        },
        {
          value: 'Nie wiem, ale coś jest nie tak',
          label: 'Nie wiem, ale coś jest nie tak',
          description: 'Czujesz dyskomfort, ale nie masz pewności, czy to ósemka.',
          feedback: 'W porządku. Przejdziemy przez kilka prostych pytań.',
        },
      ],
    },
    {
      id: 'tooth_area',
      type: 'choice',
      eyebrow: '2 / lokalizacja',
      question: 'Gdzie dokładnie czujesz problem?',
      helper: 'Jeśli nie masz pewności, wybierz ostatnią opcję.',
      options: [
        { value: 'Lewa góra', label: 'Lewa góra', feedback: 'Dzięki. Lokalizacja pomaga lepiej przygotować rozmowę.' },
        { value: 'Prawa góra', label: 'Prawa góra', feedback: 'Dzięki. Lokalizacja pomaga lepiej przygotować rozmowę.' },
        { value: 'Lewa dół', label: 'Lewa dół', feedback: 'Dzięki. Dolne ósemki zwykle warto dobrze ocenić na RTG.' },
        { value: 'Prawa dół', label: 'Prawa dół', feedback: 'Dzięki. Dolne ósemki zwykle warto dobrze ocenić na RTG.' },
        { value: 'Nie wiem', label: 'Nie wiem', feedback: 'W porządku. Koordynator dopyta o szczegóły podczas rozmowy.' },
      ],
    },
    {
      id: 'pain_score',
      type: 'slider',
      eyebrow: '3 / natężenie',
      question: 'W skali od 1 do 10, jak mocny jest ból?',
      helper: '1 oznacza lekki dyskomfort, 10 bardzo silny ból.',
      min: 1,
      max: 10,
    },
    {
      id: 'swelling_or_limited_opening',
      type: 'choice',
      eyebrow: '4 / sygnały pilniejsze',
      question: 'Czy masz opuchliznę albo trudność z otwieraniem ust?',
      helper: 'Te objawy mogą podnieść priorytet zgłoszenia.',
      options: [
        {
          value: 'Tak, jest opuchlizna',
          label: 'Tak, jest opuchlizna',
          feedback: 'To ważna informacja. Zgłoszenie dostanie wyższy priorytet.',
          urgent: true,
        },
        {
          value: 'Tak, trudno otworzyć usta',
          label: 'Tak, trudno otworzyć usta',
          feedback: 'To ważna informacja. Zgłoszenie dostanie wyższy priorytet.',
          urgent: true,
        },
        { value: 'Nie', label: 'Nie', feedback: 'Dobrze, przejdźmy dalej.' },
        { value: 'Nie wiem', label: 'Nie wiem', feedback: 'W porządku, koordynator dopyta o szczegóły podczas rozmowy.' },
      ],
    },
    {
      id: 'has_rtg',
      type: 'choice',
      eyebrow: '5 / diagnostyka',
      question: 'Czy masz aktualne RTG albo CBCT?',
      helper: 'Jeśli nie masz, nic nie szkodzi. Ustalimy, czy diagnostyka będzie potrzebna.',
      options: [
        { value: 'Mam', label: 'Mam', feedback: 'Świetnie, to może przyspieszyć ocenę sytuacji.' },
        { value: 'Nie mam', label: 'Nie mam', feedback: 'W porządku. Podczas kontaktu ustalimy, czy diagnostyka będzie potrzebna.' },
        { value: 'Nie wiem, czy aktualne', label: 'Nie wiem, czy aktualne', feedback: 'Koordynator pomoże ustalić, czy zdjęcie jest wystarczające.' },
        { value: 'Mam skierowanie', label: 'Mam skierowanie', feedback: 'To dobra informacja do przekazania przy rozmowie.' },
      ],
    },
    {
      id: 'main_objection',
      type: 'choice',
      eyebrow: '6 / blokada',
      question: 'Co najbardziej powstrzymuje Cię przed kontaktem?',
      helper: 'Dzięki temu rozmowa może być konkretniejsza.',
      skipWhenUrgent: true,
      options: [
        { value: 'Strach przed bólem', label: 'Strach przed bólem', feedback: 'To częsta obawa. Warto omówić znieczulenie i przebieg wizyty.' },
        { value: 'Koszt', label: 'Koszt', feedback: 'Jasna wycena przed decyzją to ważny element rozmowy.' },
        { value: 'Czas gojenia', label: 'Czas gojenia', feedback: 'Dobrze, że o tym myślisz. Koordynator przekaże, jak wygląda dalsza ścieżka.' },
        { value: 'Brak czasu', label: 'Brak czasu', feedback: 'Rozumiem. Dlatego zaczynamy od krótkiego kontaktu telefonicznego.' },
        { value: 'Nie wiem, od czego zacząć', label: 'Nie wiem, od czego zacząć', feedback: 'Właśnie po to jest ta kwalifikacja.' },
      ],
    },
    {
      id: 'preferred_contact_time',
      type: 'choice',
      eyebrow: '7 / kontakt',
      question: 'Kiedy najlepiej do Ciebie zadzwonić?',
      helper: 'Zgłoszenia obsługujemy telefonicznie od poniedziałku do piątku w godzinach 9:00-20:00.',
      options: [
        { value: 'Jak najszybciej', label: 'Jak najszybciej', urgent: true },
        { value: 'Dziś', label: 'Dziś' },
        { value: 'Jutro', label: 'Jutro' },
        { value: 'W tym tygodniu', label: 'W tym tygodniu' },
      ],
    },
    {
      id: 'lead_capture',
      type: 'lead',
      eyebrow: 'ostatni krok',
      question: 'Zostaw numer. Oddzwonimy i powiemy, co dalej.',
      helper: 'Kontaktujemy się od poniedziałku do piątku w godzinach 9:00-20:00.',
    },
  ],
  finalMessages: {
    high: {
      title: 'Zgłoszenie priorytetowe przyjęte',
      body:
        'Zgłoszenie oznaczymy jako priorytetowe. Koordynator oddzwoni w pierwszej kolejności w godzinach pracy: pon-pt 9:00-20:00.',
    },
    medium: {
      title: 'Zgłoszenie zapisane',
      body:
        'Koordynator oddzwoni w wybranym terminie lub w najbliższym dostępnym oknie kontaktu w godzinach pracy: pon-pt 9:00-20:00.',
    },
    low: {
      title: 'Dziękujemy, zgłoszenie zapisane',
      body:
        'Nie wygląda to na sytuację bardzo pilną, ale warto sprawdzić temat, jeśli objawy wracają albo masz zalecenie od ortodonty. Kontakt odbywa się w godzinach pracy: pon-pt 9:00-20:00.',
    },
  },
};
