'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileCheck,
  LockKeyhole,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { calculateWisdomTeethLead } from '@/lib/flows/scoring';
import type { FlowConfig, LeadScoringResult, TriageAnswers } from '@/lib/flows/types';

type ConversationalFlowProps = {
  config: FlowConfig;
  localArea?: string;
  slug?: string;
  scoreLead?: (answers: TriageAnswers) => LeadScoringResult;
};

const initialAnswers: TriageAnswers = {
  pain_score: 5,
  name: '',
  phone: '',
  consent_contact: false,
};

const CALLBACK_HOURS = 'pon-pt 9:00-20:00';
const PARTNER_LOCATION_COPY = 'gabinecie stomatologicznym w okolicy Metra Ursynów';

const getPainFeedback = (painScore: number) => {
  if (painScore >= 7) return 'Przy takim bólu oznaczymy zgłoszenie jako priorytetowe.';
  if (painScore >= 4) return 'To już poziom, przy którym konsultacja może mieć sens.';
  return 'Wygląda na mniej pilne, ale warto sprawdzić kontekst.';
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').substring(0, 9);
  const matched = digits.match(/(\d{0,3})(\d{0,3})(\d{0,3})/);
  if (!matched) return '';
  return !matched[2] ? matched[1] : `${matched[1]}-${matched[2]}${matched[3] ? `-${matched[3]}` : ''}`;
};

const getUrgencyCopy = (result: LeadScoringResult) => {
  if (result.urgencyBand === 'high') return 'Zgłoszenie priorytetowe';
  if (result.urgencyBand === 'medium') return 'Kontakt planowy';
  return 'Spokojna kwalifikacja';
};

const getUrgencyTone = (result: LeadScoringResult) => {
  if (result.urgencyBand === 'high') {
    return {
      accent: 'emerald',
      bar: 'from-emerald-500 via-amber-400 to-rose-400',
      badge: 'border-amber-300 bg-amber-50 text-amber-800',
      soft: 'border-amber-200 bg-amber-50 text-amber-900',
      ring: 'ring-amber-100',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
    };
  }

  if (result.urgencyBand === 'medium') {
    return {
      accent: 'cyan',
      bar: 'from-emerald-500 via-cyan-400 to-sky-400',
      badge: 'border-cyan-200 bg-cyan-50 text-cyan-800',
      soft: 'border-cyan-100 bg-cyan-50 text-cyan-900',
      ring: 'ring-cyan-100',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
    };
  }

  return {
    accent: 'emerald',
    bar: 'from-emerald-500 via-teal-400 to-cyan-400',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    soft: 'border-emerald-100 bg-emerald-50 text-emerald-900',
    ring: 'ring-emerald-100',
    button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20',
  };
};

const getPainTone = (painScore: number) => {
  if (painScore >= 7) {
    return {
      label: 'zgłoszenie priorytetowe',
      text: 'text-amber-800',
      segment: 'bg-gradient-to-r from-amber-400 to-rose-400',
      panel: 'border-amber-200 bg-amber-50',
    };
  }

  if (painScore >= 4) {
    return {
      label: 'warto skonsultować',
      text: 'text-cyan-800',
      segment: 'bg-gradient-to-r from-emerald-500 to-cyan-400',
      panel: 'border-cyan-100 bg-cyan-50',
    };
  }

  return {
    label: 'spokojna kwalifikacja',
    text: 'text-emerald-800',
    segment: 'bg-gradient-to-r from-emerald-500 to-teal-400',
    panel: 'border-emerald-100 bg-emerald-50',
  };
};

const getOptionAccent = (value: string, urgent?: boolean) => {
  if (urgent) return 'from-amber-50 via-white to-rose-50';
  if (value.includes('ortodont')) return 'from-cyan-50 via-white to-violet-50';
  if (value.includes('RTG') || value.includes('Mam') || value.includes('skierowanie')) {
    return 'from-emerald-50 via-white to-cyan-50';
  }
  if (value.includes('Nie wiem')) return 'from-slate-50 via-white to-cyan-50';
  return 'from-emerald-50 via-white to-white';
};

export default function ConversationalFlow({
  config,
  localArea = config.location,
  slug = 'ursynow',
  scoreLead = calculateWisdomTeethLead,
}: ConversationalFlowProps) {
  const [answers, setAnswers] = useState<TriageAnswers>(initialAnswers);
  const [stepIndex, setStepIndex] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formError, setFormError] = useState<string | null>(null);

  const getVisibleSteps = (candidateAnswers: TriageAnswers) => {
    const candidateScoring = scoreLead(candidateAnswers);

    return config.steps.filter(
      (step) =>
        !(step.skipWhenUrgent && candidateScoring.urgencyBand === 'high') &&
        !(step.id === 'swelling_or_limited_opening' && candidateAnswers.symptom === 'Jest opuchlizna'),
    );
  };

  const scoring = scoreLead(answers);
  const visibleSteps = getVisibleSteps(answers);
  const safeStepIndex = Math.min(stepIndex, visibleSteps.length - 1);
  const currentStep = visibleSteps[safeStepIndex];
  const progress = status === 'success' ? 100 : Math.round(((safeStepIndex + 1) / visibleSteps.length) * 100);
  const isLocalEntry = localArea !== config.location;
  const finalMessage = config.finalMessages[scoring.urgencyBand];
  const urgencyTone = getUrgencyTone(scoring);
  const isUrgent = scoring.urgencyBand === 'high';
  const painTone = getPainTone(answers.pain_score);

  const handleNext = (nextAnswers = answers, fromStepId = currentStep.id) => {
    const nextVisibleSteps = getVisibleSteps(nextAnswers);
    const currentVisibleIndex = nextVisibleSteps.findIndex((step) => step.id === fromStepId);
    const nextIndex = currentVisibleIndex === -1 ? safeStepIndex + 1 : currentVisibleIndex + 1;
    setStepIndex(Math.min(nextIndex, nextVisibleSteps.length - 1));
  };

  const handleBack = () => {
    setFeedback(null);
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const setAnswer = <Key extends keyof TriageAnswers>(key: Key, value: TriageAnswers[Key]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleChoice = (value: string, optionFeedback?: string) => {
    const nextAnswers = { ...answers, [currentStep.id]: value } as TriageAnswers;

    if (currentStep.id === 'symptom') {
      nextAnswers.swelling_or_limited_opening =
        value === 'Jest opuchlizna' ? 'Tak, jest opuchlizna' : undefined;
    }

    setAnswers(nextAnswers);
    setFeedback(optionFeedback ?? null);
    window.setTimeout(() => {
      setFeedback(null);
      handleNext(nextAnswers, currentStep.id);
    }, 300);
  };

  const handleSliderContinue = () => {
    setFeedback(getPainFeedback(answers.pain_score));
    window.setTimeout(() => {
      setFeedback(null);
      handleNext(answers, currentStep.id);
    }, 520);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const rawPhone = answers.phone.replace(/-/g, '');
    if (rawPhone.length !== 9) {
      setFormError('Podaj poprawny numer telefonu (9 cyfr).');
      return;
    }

    if (!answers.consent_contact) {
      setFormError('Zaznacz zgodę na kontakt telefoniczny w sprawie zgłoszenia.');
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const result = scoreLead(answers);
    const contactTime = answers.preferred_contact_time ?? 'brak preferencji';
    const symptom = answers.symptom ?? 'brak informacji';
    const toothArea = answers.tooth_area ?? 'brak informacji';
    const rtg = answers.has_rtg ?? 'brak informacji';
    const mainObjection = answers.main_objection ?? 'pominięto lub brak informacji';
    const trelloCardTitle = `${result.urgencyBand === 'high' ? 'PRIORYTET | ' : ''}Ósemka | Ból ${answers.pain_score}/10 | ${answers.name} | ${contactTime}`;
    const trelloDescription = [
      `PACJENT: ${answers.name}`,
      `TEL: ${rawPhone}`,
      '',
      `OBJAW: ${symptom}`,
      `MIEJSCE: ${toothArea}`,
      `BÓL: ${answers.pain_score}/10`,
      `OPUCHLIZNA / OTWIERANIE UST: ${answers.swelling_or_limited_opening ?? 'brak informacji'}`,
      `RTG: ${rtg}`,
      `OBAWA: ${mainObjection}`,
      `PREFEROWANY KONTAKT: ${contactTime}`,
      '',
      `PILNOŚĆ: ${result.urgencyBand}`,
      `LEAD SCORE: ${result.leadScore}`,
      `ŹRÓDŁO: conversational_flow`,
      `URL: ${window.location.href}`,
      `DATA: ${new Date().toLocaleString('pl-PL')}`,
    ].join('\n');

    setStatus('loading');
    try {
      const response = await fetch(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'conversational_flow',
          service: config.service,
          domain: window.location.hostname || config.domain,
          landing_url: window.location.href,
          flow_variant: config.variant,
          location: config.location,
          local_area: localArea,
          symptom: answers.symptom ?? null,
          tooth_area: answers.tooth_area ?? null,
          pain_score: answers.pain_score,
          swelling_or_limited_opening: answers.swelling_or_limited_opening ?? null,
          has_rtg: answers.has_rtg ?? null,
          main_objection: answers.main_objection ?? null,
          preferred_contact_time: answers.preferred_contact_time ?? null,
          name: answers.name,
          phone: rawPhone,
          lead_score: result.leadScore,
          urgency_band: result.urgencyBand,
          lead_priority: result.leadPriority,
          urgent_label: result.urgentLabel,
          consent_contact: answers.consent_contact,
          callback_hours: CALLBACK_HOURS,
          partner_location: PARTNER_LOCATION_COPY,
          trello_card_title: trelloCardTitle,
          trello_title: trelloCardTitle,
          trello_description: trelloDescription,
          reason: answers.symptom ?? null,
          toothArea: answers.tooth_area ?? null,
          painScore: answers.pain_score,
          pain: answers.pain_score,
          hasRTG: answers.has_rtg ?? null,
          biggestFear: answers.main_objection ?? null,
          preferredContactTime: answers.preferred_contact_time ?? null,
          leadScore: result.leadScore,
          leadPriority: result.leadPriority,
          urgentLabel: result.urgentLabel,
          slug,
          created_at: new Date().toISOString(),
          timestamp: new Date().toLocaleString('pl-PL'),
          user_agent: window.navigator.userAgent,
          utm_source: params.get('utm_source'),
          utm_medium: params.get('utm_medium'),
          utm_campaign: params.get('utm_campaign'),
          utm_content: params.get('utm_content'),
          utm_term: params.get('utm_term'),
        }),
      });

      setStatus(response.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const summary = [
    { label: 'Objaw', value: answers.symptom },
    { label: 'Miejsce', value: answers.tooth_area },
    { label: 'Ból', value: safeStepIndex >= 2 ? `${answers.pain_score}/10` : null },
    { label: 'RTG', value: answers.has_rtg },
    { label: 'Kontakt', value: answers.preferred_contact_time },
  ].filter((item): item is { label: string; value: string } => Boolean(item.value));

  const successBody = isUrgent
    ? `Oddzwonimy w pierwszej kolejności w godzinach pracy: ${CALLBACK_HOURS}. Jeśli wysyłasz formularz poza tym czasem, wrócimy do Ciebie w najbliższym dniu roboczym.`
    : `Oddzwonimy w wybranym terminie lub w najbliższym dostępnym oknie kontaktu w godzinach pracy: ${CALLBACK_HOURS}.`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7fbf8] text-slate-950 antialiased">
      <div className="absolute inset-x-0 top-0 h-2 bg-emerald-700" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_20%,rgba(16,185,129,0.13),transparent_32%),radial-gradient(circle_at_86%_8%,rgba(20,184,166,0.16),transparent_30%),linear-gradient(180deg,#ffffff_0%,#f7fbf8_52%,#eef8f4_100%)]" />
      <div className="absolute right-[-12rem] top-24 hidden h-[34rem] w-[34rem] rounded-full bg-emerald-100 lg:block" />
      <div className="absolute right-[8rem] top-40 hidden h-[21rem] w-[21rem] rounded-full border-[10px] border-emerald-700 bg-white shadow-2xl shadow-emerald-900/10 lg:block" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 md:px-8 md:py-7">
        <header className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-emerald-700 shadow-lg shadow-emerald-700/20">
              <span className="text-base font-black tracking-tighter text-white">8U</span>
              <div className="absolute bottom-0 left-0 h-1 w-full bg-cyan-300" />
            </div>
            <div>
              <p className="text-sm font-black leading-none tracking-tight text-slate-950">Ósemki Ursynów</p>
              <p className="mt-1 hidden text-xs font-semibold text-slate-500 sm:block">
                Kwalifikacja online, kontakt {CALLBACK_HOURS}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm">
            <MapPin className="h-3.5 w-3.5 text-emerald-700" />
            {isLocalEntry ? localArea : 'Ursynów'}
          </div>
        </header>

        <section className="grid flex-1 items-start gap-6 py-6 lg:grid-cols-[0.92fr,1.08fr] lg:items-center lg:gap-10 md:py-10">
          <aside className="order-1 lg:order-none">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-2 text-xs font-black uppercase tracking-widest text-emerald-800 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              {config.intro.eyebrow}
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[0.92] tracking-[-0.055em] text-slate-950 sm:text-6xl xl:text-7xl">
              {isLocalEntry ? config.intro.localTitle(localArea) : config.intro.title}
            </h1>

            <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-slate-700 sm:text-xl">
              {config.intro.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-2.5">
              {[
                'Kontakt pon-pt 9:00-20:00',
                'Okolice Metra Ursynów',
                'Bez zobowiązania do zabiegu',
                'Kwalifikacja online',
              ].map((chip) => (
                <span key={chip} className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm">
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-8 grid max-w-xl gap-4 sm:grid-cols-[0.95fr,1.05fr]">
              <div className="relative min-h-64 overflow-hidden rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/5">
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-100" />
                <div className="absolute bottom-6 right-8 h-20 w-20 rounded-full bg-cyan-100 blur-xl" />
                <div className="relative flex h-44 items-center justify-center">
                  <motion.div
                    className="relative h-36 w-36 rounded-[46%_54%_42%_58%] border-[7px] border-emerald-700 bg-gradient-to-br from-white via-emerald-50 to-cyan-50 shadow-2xl shadow-emerald-900/10"
                    animate={{ y: [0, -8, 0], rotate: [0, 4, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="absolute left-10 top-8 h-10 w-10 rounded-full bg-cyan-200/70 blur-sm" />
                    <div className="absolute bottom-8 right-8 h-12 w-12 rounded-full bg-emerald-200/70 blur-sm" />
                  </motion.div>
                </div>
                <p className="relative text-xs font-black uppercase tracking-widest text-emerald-800">Nowoczesna kwalifikacja</p>
                <p className="relative mt-2 text-sm font-semibold leading-relaxed text-slate-600">
                  Prosty wywiad pomaga ustalić, czy potrzebna może być konsultacja, RTG lub szybszy kontakt.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  { icon: <FileCheck className="h-4 w-4" />, title: 'Najpierw odpowiedzi', text: 'Bez długiego formularza na start.' },
                  { icon: <Clock className="h-4 w-4" />, title: 'Kontakt w godzinach pracy', text: CALLBACK_HOURS },
                  { icon: <ShieldCheck className="h-4 w-4" />, title: 'Bez rezerwacji zabiegu', text: 'To tylko prośba o kontakt.' },
                ].map((item) => (
                  <div key={item.title} className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      {item.icon}
                    </div>
                    <p className="text-sm font-black text-slate-950">{item.title}</p>
                    <p className="mt-1 text-sm font-medium leading-relaxed text-slate-500">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 max-w-xl rounded-[1.5rem] border border-emerald-100 bg-white/90 p-5 shadow-sm backdrop-blur">
              <div className="mb-4 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Twoje odpowiedzi</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">Pomagają przygotować kontakt zwrotny</p>
                </div>
                <span className={`rounded-full border px-3 py-1.5 text-xs font-black ${urgencyTone.badge}`}>
                  {getUrgencyCopy(scoring)}
                </span>
              </div>

              <div className="mb-4 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${urgencyTone.bar}`}
                  animate={{ width: `${Math.min(scoring.leadScore, 100)}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {isUrgent && (
                  <span className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-rose-600">
                    Pilne
                  </span>
                )}
                {summary.length > 0 ? (
                  summary.map((item) => (
                    <span key={item.label} className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600">
                      <span className="text-slate-400">{item.label}:</span> {item.value}
                    </span>
                  ))
                ) : (
                  <div className="rounded-full border border-dashed border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold leading-relaxed text-slate-400">
                    Odpowiedzi pojawią się tutaj w trakcie kwalifikacji.
                  </div>
                )}
              </div>
            </div>
          </aside>

          <div className="order-2 mx-auto w-full max-w-3xl lg:order-none">
            <div className={`relative overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-white p-4 shadow-2xl shadow-emerald-900/10 sm:rounded-[2rem] sm:p-6 md:p-8 ${urgencyTone.ring} ring-1`}>
              <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-50" />
              <div className="absolute right-14 top-10 h-20 w-20 rounded-full bg-cyan-100 blur-2xl" />

              <div className="relative mb-5 sm:mb-7">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{status === 'success' ? 'Gotowe' : currentStep.eyebrow}</span>
                  </div>
                  <span className={`rounded-full border px-3 py-1.5 text-xs font-black ${urgencyTone.badge}`}>
                    {progress}%
                  </span>
                </div>

                <div className="flex gap-1.5">
                  {visibleSteps.map((step, index) => (
                    <div key={step.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <motion.div
                        className={`h-full rounded-full bg-gradient-to-r ${urgencyTone.bar}`}
                        animate={{ width: index <= safeStepIndex || status === 'success' ? '100%' : '0%' }}
                        transition={{ duration: 0.28 }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.98 }}
                    className="relative py-8 text-center sm:py-10"
                  >
                    <motion.div
                      initial={{ scale: 0.72, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 230, damping: 14 }}
                      className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 shadow-2xl shadow-emerald-900/10"
                    >
                      <CheckCircle2 className="h-10 w-10" />
                    </motion.div>
                    <h2 className="mx-auto max-w-lg text-4xl font-black leading-tight tracking-[-0.035em] text-slate-950">
                      {finalMessage.title}
                    </h2>
                    <p className="mx-auto mt-5 max-w-md text-base font-medium leading-relaxed text-slate-600">
                      {successBody}
                    </p>
                    <div className="mx-auto mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
                      {[
                        ['1', 'Zapisaliśmy zgłoszenie'],
                        ['2', 'Sprawdzimy odpowiedzi'],
                        ['3', 'Oddzwonimy w godzinach pracy'],
                      ].map(([number, label]) => (
                        <div key={label} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 text-left">
                          <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-xs font-black text-emerald-700 shadow-sm">
                            {number}
                          </span>
                          <p className="text-sm font-bold leading-snug text-slate-700">{label}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0, y: 18, scale: 0.985 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -18, scale: 0.985 }}
                    transition={{ duration: 0.22 }}
                    className="relative"
                  >
                    <AnimatePresence>
                      {feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className={`mb-5 rounded-2xl border px-4 py-3 text-sm font-bold ${urgencyTone.soft}`}
                        >
                          {feedback}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mb-6 sm:mb-8">
                      <div className="mb-3 flex items-center gap-3 sm:mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-black text-emerald-700 ring-1 ring-emerald-100">
                          {safeStepIndex + 1}
                        </div>
                        <div className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                          Krok {safeStepIndex + 1} z {visibleSteps.length}
                        </div>
                      </div>
                      <h2 className="max-w-2xl text-3xl font-black leading-[0.98] tracking-[-0.04em] text-slate-950 sm:text-5xl">
                        {currentStep.question}
                      </h2>
                      {currentStep.helper && (
                        <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-slate-500 sm:mt-4 sm:text-base">
                          {currentStep.helper}
                        </p>
                      )}
                    </div>

                    {currentStep.type === 'choice' && currentStep.options && (
                      <div className="grid gap-3">
                        {currentStep.options.map((option, index) => {
                          const selectedValue = answers[currentStep.id as keyof TriageAnswers];
                          const isSelected = selectedValue === option.value;
                          const accent = getOptionAccent(option.value, option.urgent);

                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => handleChoice(option.value, option.feedback)}
                              className={`group relative overflow-hidden rounded-[1.25rem] border p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 sm:p-5 ${
                                isSelected
                                  ? option.urgent
                                    ? 'border-amber-300 bg-amber-50 ring-2 ring-amber-100'
                                    : 'border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100'
                                  : option.urgent
                                    ? 'border-amber-200 bg-gradient-to-br from-amber-50 via-white to-rose-50 hover:border-amber-300'
                                    : 'border-slate-200 bg-white hover:border-emerald-200'
                              }`}
                            >
                              <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-70 transition group-hover:opacity-100`} />
                              <div className="relative flex items-start justify-between gap-4">
                                <div className="flex gap-4">
                                  <span
                                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-black shadow-sm ${
                                      option.urgent
                                        ? 'border-amber-200 bg-white text-amber-700'
                                        : 'border-emerald-100 bg-emerald-50 text-emerald-700'
                                    }`}
                                  >
                                    {index + 1}
                                  </span>
                                  <span>
                                    <span className="block text-lg font-black leading-tight text-slate-950">{option.label}</span>
                                    {option.description && (
                                      <span className="mt-1.5 block text-sm font-medium leading-relaxed text-slate-500">
                                        {option.description}
                                      </span>
                                    )}
                                    {option.urgent && (
                                      <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-black uppercase tracking-widest text-amber-700">
                                        <AlertTriangle className="h-3 w-3" />
                                        sygnał pilniejszy
                                      </span>
                                    )}
                                  </span>
                                </div>
                                <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-700" />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {currentStep.type === 'slider' && (
                      <div className="space-y-5">
                        <div className={`rounded-[1.5rem] border p-5 shadow-sm sm:p-6 ${painTone.panel}`}>
                          <div className="mb-6 flex items-end justify-between gap-5">
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Skala bólu</p>
                              <p className={`mt-2 text-sm font-black uppercase tracking-widest ${painTone.text}`}>{painTone.label}</p>
                            </div>
                            <span className="text-7xl font-black tracking-[-0.06em] text-slate-950">{answers.pain_score}</span>
                          </div>

                          <div className="mb-5 grid grid-cols-10 gap-1.5">
                            {Array.from({ length: 10 }).map((_, index) => (
                              <div
                                key={index}
                                className={`h-2 rounded-full transition-all duration-200 ${
                                  index < answers.pain_score ? painTone.segment : 'bg-white/70'
                                }`}
                              />
                            ))}
                          </div>

                          <input
                            type="range"
                            min={currentStep.min ?? 1}
                            max={currentStep.max ?? 10}
                            value={answers.pain_score}
                            onChange={(event) => setAnswer('pain_score', Number(event.target.value))}
                            className="w-full accent-emerald-600"
                          />
                          <div className="mt-4 flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                            <span>1</span>
                            <span>5</span>
                            <span>10</span>
                          </div>
                          {answers.pain_score >= 7 && (
                            <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200 bg-white p-4 text-sm font-bold text-amber-800">
                              <AlertTriangle className="h-5 w-5 shrink-0" />
                              Przy takim bólu zgłoszenie potraktujemy jako priorytetowe w godzinach kontaktu.
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleSliderContinue}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black shadow-xl transition ${urgencyTone.button}`}
                        >
                          Dalej
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {currentStep.type === 'lead' && (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div
                          className={`rounded-[1.35rem] border p-4 ${
                            isUrgent
                              ? 'border-amber-200 bg-amber-50 text-amber-900'
                              : urgencyTone.soft
                          }`}
                        >
                          <p className={`flex items-center gap-2 text-sm font-black ${isUrgent ? 'text-amber-800' : 'text-slate-950'}`}>
                            {isUrgent ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                            {isUrgent ? 'Sprawa priorytetowa.' : getUrgencyCopy(scoring)}
                          </p>
                          <p className={`mt-2 text-sm font-medium leading-relaxed ${isUrgent ? 'text-amber-900' : 'text-slate-600'}`}>
                            {isUrgent
                              ? `Zgłoszenie priorytetowe. Przy takim bólu lub opuchliźnie warto szybciej ustalić kolejny krok. Oddzwonimy w pierwszej kolejności w godzinach pracy: ${CALLBACK_HOURS}.`
                              : `To nie jest zapis na zabieg. Oddzwonimy z informacją, jaki kolejny krok ma sens, w godzinach pracy: ${CALLBACK_HOURS}.`}
                          </p>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                          {[
                            ['1', 'Oddzwonimy', `Kontakt zwrotny w godzinach ${CALLBACK_HOURS}.`],
                            ['2', 'Ustalimy krok', 'Konsultacja, RTG albo spokojne zaplanowanie rozmowy.'],
                            ['3', 'Bez rezerwacji', 'Formularz nie jest zapisem na zabieg.'],
                          ].map(([number, title, text]) => (
                            <div key={title} className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                              <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white text-xs font-black text-emerald-700 shadow-sm">
                                {number}
                              </span>
                              <p className="text-sm font-black text-slate-950">{title}</p>
                              <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500">{text}</p>
                            </div>
                          ))}
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs font-medium leading-relaxed text-slate-500">
                          Jeśli konsultacja będzie wskazana, wizyta odbywa się w {PARTNER_LOCATION_COPY}. Jeśli masz szybko narastający obrzęk, gorączkę albo trudności z przełykaniem lub oddychaniem, skorzystaj z pilnej pomocy medycznej.
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">Imię</label>
                          <input
                            required
                            value={answers.name}
                            onChange={(event) => setAnswer('name', event.target.value)}
                            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-base font-semibold text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                            placeholder="np. Anna"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-400">Telefon</label>
                          <input
                            required
                            type="tel"
                            value={answers.phone}
                            onChange={(event) => setAnswer('phone', formatPhone(event.target.value))}
                            className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-base font-semibold text-slate-950 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                            placeholder="Twój numer telefonu"
                          />
                        </div>

                        <label className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium leading-relaxed text-slate-600">
                          <input
                            type="checkbox"
                            checked={answers.consent_contact}
                            onChange={(event) => setAnswer('consent_contact', event.target.checked)}
                            className="mt-1 h-4 w-4 shrink-0 accent-emerald-600"
                          />
                          Wyrażam zgodę na kontakt telefoniczny w celu obsługi tego zgłoszenia.
                        </label>

                        {formError && <p className="text-sm font-bold text-rose-600">{formError}</p>}
                        {status === 'error' && (
                          <p className="text-sm font-bold text-rose-600">
                            Nie udało się wysłać zgłoszenia. Spróbuj ponownie za chwilę.
                          </p>
                        )}

                        <button
                          disabled={status === 'loading'}
                          className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-4 text-sm font-black shadow-xl transition disabled:cursor-not-allowed disabled:opacity-60 ${urgencyTone.button}`}
                        >
                          {status === 'loading' ? 'Wysyłanie...' : 'Poproś o kontakt'}
                          <ArrowRight className="h-4 w-4" />
                        </button>

                        <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium leading-relaxed text-slate-400">
                          <LockKeyhole className="h-3.5 w-3.5" />
                          Twoje dane są bezpieczne i służą wyłącznie do obsługi tego zgłoszenia.
                        </p>
                      </form>
                    )}

                    {safeStepIndex > 0 && currentStep.type !== 'lead' && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 transition hover:text-slate-600"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Wstecz
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        <footer className="pb-4 text-center text-[11px] font-semibold leading-relaxed text-slate-400">
          Kwalifikacja online nie zastępuje konsultacji lekarskiej. Kontakt zwrotny: {CALLBACK_HOURS}.
        </footer>
      </main>
    </div>
  );
}
