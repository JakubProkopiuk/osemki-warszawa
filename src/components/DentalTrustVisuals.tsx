import Image from 'next/image';

type DentalClinicVisualProps = {
  compact?: boolean;
};

type TriageStepVisualProps = {
  stepId: string;
  compact?: boolean;
};

const visualByStep: Record<string, { src: string; alt: string; label: string }> = {
  symptom: {
    src: '/visuals/quiz-symptom.jpeg',
    alt: 'Ilustracja anatomiczna ósemki w kości szczęki',
    label: 'Objawy ósemki',
  },
  tooth_area: {
    src: '/visuals/quiz-symptom.jpeg',
    alt: 'Ilustracja anatomiczna ósemki w kości szczęki',
    label: 'Lokalizacja bólu',
  },
  pain_score: {
    src: '/visuals/quiz-symptom.jpeg',
    alt: 'Ilustracja anatomiczna ósemki w kości szczęki',
    label: 'Natężenie bólu',
  },
  swelling_or_limited_opening: {
    src: '/visuals/quiz-symptom.jpeg',
    alt: 'Ilustracja anatomiczna ósemki w kości szczęki',
    label: 'Sygnały pilniejsze',
  },
  has_rtg: {
    src: '/visuals/quiz-xray.jpeg',
    alt: 'Monitor diagnostyczny z obrazem RTG i CBCT szczęki',
    label: 'RTG / CBCT',
  },
  main_objection: {
    src: '/visuals/success-checklist.jpeg',
    alt: 'Nowoczesne stanowisko konsultacji stomatologicznej bez widocznego brandingu',
    label: 'Rozmowa przed decyzją',
  },
  preferred_contact_time: {
    src: '/visuals/callback-visual.jpeg',
    alt: 'Medyczna ilustracja kontaktu zwrotnego z pacjentem',
    label: 'Kontakt zwrotny',
  },
  lead_capture: {
    src: '/visuals/callback-visual.jpeg',
    alt: 'Medyczna ilustracja kontaktu zwrotnego z pacjentem',
    label: 'Kontakt zwrotny',
  },
};

export function DentalClinicVisual({ compact = false }: DentalClinicVisualProps) {
  return (
    <div className={`relative overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/55 to-cyan-50 p-3 shadow-xl shadow-emerald-900/5 ${compact ? 'min-h-44' : 'min-h-64'}`}>
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-200/45 blur-2xl" />
      <div className="absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-cyan-200/40 blur-2xl" />

      <div className={`relative overflow-hidden rounded-[1.35rem] bg-emerald-950 ${compact ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
        <Image
          src="/visuals/hero-dental-suite.jpeg"
          alt="Nowoczesny gabinet stomatologiczny w jasnej, sterylnej aranżacji bez widocznego brandingu"
          fill
          sizes={compact ? '(max-width: 1024px) 90vw, 340px' : '(max-width: 1024px) 90vw, 520px'}
          className="object-cover"
          priority={!compact}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/55 via-transparent to-white/5" />
        <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/20 bg-white/90 p-3 shadow-lg backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-black uppercase tracking-widest text-emerald-800">Rejon Metra Ursynów</p>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">Zdjęcie ilustracyjne</span>
          </div>
          <p className="mt-1 text-sm font-bold leading-snug text-slate-800">Konsultacja, diagnostyka i kolejny krok ustalane po kontakcie.</p>
        </div>
      </div>

      <div className="relative mt-4 grid gap-2 sm:grid-cols-3">
        {[
          'Konsultacja',
          'RTG / CBCT',
          'Kolejny krok',
        ].map((label) => (
          <div key={label} className="rounded-2xl border border-white bg-white/85 px-3 py-2 text-center text-xs font-black text-emerald-800 shadow-sm">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TriageStepVisual({ stepId, compact = false }: TriageStepVisualProps) {
  const visual = visualByStep[stepId] ?? visualByStep.symptom;

  return (
    <div className={`relative overflow-hidden rounded-[1.35rem] border border-emerald-100 bg-emerald-50 shadow-sm ${compact ? 'h-24 w-32' : 'h-36 w-44'}`}>
      <Image
        src={visual.src}
        alt={visual.alt}
        fill
        sizes={compact ? '128px' : '176px'}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/55 via-transparent to-transparent" />
      <span className="absolute bottom-2 left-2 right-2 rounded-full bg-white/90 px-2 py-1 text-center text-[10px] font-black uppercase tracking-widest text-emerald-800 shadow-sm backdrop-blur">
        {visual.label}
      </span>
      {!compact && (
        <span className="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500 shadow-sm backdrop-blur">
          Ilustracja
        </span>
      )}
    </div>
  );
}

export function SuccessVisual() {
  return (
    <div className="mx-auto mb-7 max-w-sm overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-emerald-50 p-2 shadow-xl shadow-emerald-900/5">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[1.15rem] bg-emerald-950">
        <Image
          src="/visuals/success-checklist.jpeg"
          alt="Nowoczesne stanowisko konsultacji stomatologicznej przygotowane do omówienia kolejnego kroku"
          fill
          sizes="(max-width: 640px) 90vw, 384px"
          className="object-cover"
        />
        <span className="absolute right-3 top-3 rounded-full bg-white/85 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500 shadow-sm backdrop-blur">
          Zdjęcie ilustracyjne
        </span>
      </div>
    </div>
  );
}

export function DentalProcessVisualStrip() {
  const items = [
    {
      title: 'Wywiad objawów',
      text: 'Ogólny powód zgłoszenia, RTG i preferowany kontakt.',
      icon: (
        <path d="M22 74h76M22 102h54M22 130h64M142 72l16 16 32-38" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      ),
    },
    {
      title: 'Ocena pilności',
      text: 'Preferencja szybkiego kontaktu jest oznaczana w zgłoszeniu.',
      icon: (
        <path d="M105 36 30 164h150L105 36Zm0 45v35m0 30h.1" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      ),
    },
    {
      title: 'Kontakt zwrotny',
      text: 'Placówka partnerska może oddzwonić i ustalić możliwy termin.',
      icon: (
        <path d="M52 58h106c15 0 27 12 27 27v42c0 15-12 27-27 27H91l-39 30v-30H42c-15 0-27-12-27-27V85c0-15 12-27 27-27Z" stroke="currentColor" strokeWidth="10" strokeLinejoin="round" />
      ),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <svg viewBox="0 0 210 210" aria-hidden="true" className="h-9 w-9 fill-none">
              {item.icon}
            </svg>
          </div>
          <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">{item.title}</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
