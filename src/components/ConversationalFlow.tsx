'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
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
const PARTNER_LOCATION_COPY = 'gabinecie partnerskim w rejonie Metra Ursynów';

const getPainFeedback = (painScore: number) => {
  if (painScore >= 7) return 'Przy takim bólu oznaczymy zgłoszenie jako pilniejsze.';
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
  if (result.urgencyBand === 'high') return 'Pilniejszy kontakt';
  if (result.urgencyBand === 'medium') return 'Kontakt planowy';
  return 'Spokojna kwalifikacja';
};

const getUrgencyTone = (result: LeadScoringResult) => {
  if (result.urgencyBand === 'high') {
    return {
      glow: 'shadow-red-500/20',
      bar: 'from-red-400 via-rose-300 to-orange-200',
      badge: 'border-red-300/25 bg-red-400/10 text-red-100',
      soft: 'border-red-300/20 bg-red-400/10 text-red-100',
      dot: 'bg-red-300',
    };
  }

  if (result.urgencyBand === 'medium') {
    return {
      glow: 'shadow-cyan-500/20',
      bar: 'from-cyan-300 via-sky-300 to-emerald-200',
      badge: 'border-cyan-300/25 bg-cyan-300/10 text-cyan-100',
      soft: 'border-cyan-300/20 bg-cyan-300/10 text-cyan-100',
      dot: 'bg-cyan-300',
    };
  }

  return {
    glow: 'shadow-slate-900/40',
    bar: 'from-slate-300 via-cyan-200 to-slate-100',
    badge: 'border-white/15 bg-white/8 text-slate-200',
    soft: 'border-white/10 bg-white/[0.045] text-slate-200',
    dot: 'bg-slate-300',
  };
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
          slug,
          created_at: new Date().toISOString(),
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
    ? `Zgłoszenie oznaczone jako priorytetowe. Koordynator oddzwoni w pierwszej kolejności w godzinach pracy: ${CALLBACK_HOURS}. Jeśli wysyłasz formularz poza tym czasem, wrócimy do Ciebie w najbliższym dniu roboczym.`
    : `Zgłoszenie zapisane. Koordynator oddzwoni w wybranym terminie lub w najbliższym dostępnym oknie kontaktu w godzinach pracy: ${CALLBACK_HOURS}.`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#02070a] text-white antialiased">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(34,211,238,0.30),transparent_28%),radial-gradient(circle_at_83%_18%,rgba(244,63,94,0.22),transparent_24%),radial-gradient(circle_at_42%_82%,rgba(14,165,233,0.12),transparent_34%),linear-gradient(135deg,#02070a_0%,#061018_46%,#030507_100%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.07)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute left-1/2 top-1/2 h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/10 bg-cyan-300/[0.015] blur-[1px]" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 md:px-8 md:py-7">
        <header className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-cyan-200/20 bg-cyan-200/10 shadow-lg shadow-cyan-500/10">
              <span className="text-lg font-black tracking-tighter text-cyan-100">8U</span>
              <div className="absolute inset-x-0 bottom-0 h-px bg-cyan-200/50" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.34em] text-cyan-200">Ósemki Ursynów</p>
              <p className="mt-1 hidden text-xs font-semibold text-slate-500 sm:block">
                Krótki wywiad kwalifikacyjny przed kontaktem w godzinach {CALLBACK_HOURS}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.045] px-3 py-2 text-xs font-bold text-slate-300 backdrop-blur-xl">
            <MapPin className="h-3.5 w-3.5 text-cyan-200" />
            {isLocalEntry ? localArea : 'Ursynów'}
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[0.86fr,1.14fr] md:py-10">
          <aside className="hidden lg:block">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-cyan-100 shadow-lg shadow-cyan-500/10">
              <ShieldCheck className="h-4 w-4" />
              {config.intro.eyebrow}
            </div>

            <h1 className="max-w-xl text-6xl font-black leading-[0.88] tracking-[-0.055em] text-white xl:text-7xl">
              {isLocalEntry ? config.intro.localTitle(localArea) : config.intro.title}
            </h1>

            <p className="mt-6 max-w-lg text-lg font-medium leading-relaxed text-slate-300">
              {config.intro.description}
            </p>

            <div className="mt-8 grid max-w-lg grid-cols-3 gap-3">
              {[
                ['01', 'Objawy'],
                ['02', 'Pilność'],
                ['03', 'Kontakt'],
              ].map(([number, label]) => (
                <div key={number} className="rounded-3xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl">
                  <p className="text-[11px] font-black text-cyan-200">{number}</p>
                  <p className="mt-2 text-sm font-black text-white">{label}</p>
                </div>
              ))}
            </div>

            <div className={`mt-5 max-w-lg rounded-[2rem] border bg-white/[0.045] p-5 shadow-2xl backdrop-blur-xl ${urgencyTone.glow}`}>
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-slate-500">Live triage status</p>
                  <p className="mt-1 text-sm font-semibold text-slate-300">Aktualizuje się po każdej odpowiedzi</p>
                </div>
                <span className={`rounded-full border px-3 py-1.5 text-xs font-black ${urgencyTone.badge}`}>
                  {getUrgencyCopy(scoring)}
                </span>
              </div>

              <div className="mb-5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  className={`h-2 rounded-full bg-gradient-to-r ${urgencyTone.bar}`}
                  animate={{ width: `${Math.min(scoring.leadScore, 100)}%` }}
                  transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {isUrgent && (
                  <span className="rounded-full border border-rose-400/40 bg-rose-950/40 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-rose-400">
                    Pilne
                  </span>
                )}
                {summary.length > 0 ? (
                  summary.map((item) => (
                    <span key={item.label} className="rounded-full border border-white/5 bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-slate-300">
                      <span className="text-slate-500">{item.label}:</span> {item.value}
                    </span>
                  ))
                ) : (
                  <div className="rounded-full border border-dashed border-white/10 bg-slate-800 px-4 py-2 text-xs font-semibold leading-relaxed text-slate-500">
                    Odpowiedzi pojawią się tutaj w trakcie kwalifikacji.
                  </div>
                )}
              </div>
            </div>
          </aside>

          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-5 lg:hidden">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-cyan-100">
                <ShieldCheck className="h-4 w-4" />
                {config.intro.eyebrow}
              </div>
              <h1 className="text-5xl font-black leading-[0.9] tracking-[-0.055em] text-white sm:text-6xl">
                {isLocalEntry ? config.intro.localTitle(localArea) : config.intro.title}
              </h1>
              <div className="mt-5 flex flex-wrap gap-2">
                {isUrgent && (
                  <span className="rounded-full border border-rose-400/40 bg-rose-950/40 px-3 py-1.5 text-[11px] font-black uppercase tracking-widest text-rose-400">
                    Pilne
                  </span>
                )}
                {summary.map((item) => (
                  <span key={item.label} className="rounded-full border border-white/5 bg-slate-800 px-3 py-1.5 text-[11px] font-bold text-slate-300">
                    <span className="text-slate-500">{item.label}:</span> {item.value}
                  </span>
                ))}
              </div>
            </div>

            <div className={`relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-[#071118]/85 p-4 shadow-2xl backdrop-blur-2xl sm:p-6 md:p-8 ${urgencyTone.glow}`}>
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/45 to-transparent" />
              <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />

              <div className="relative mb-7">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
                    <span className={`h-2 w-2 rounded-full ${urgencyTone.dot}`} />
                    <span>{status === 'success' ? 'Gotowe' : currentStep.eyebrow}</span>
                  </div>
                  <span className={`rounded-full border px-3 py-1.5 text-xs font-black ${urgencyTone.badge}`}>
                    {progress}%
                  </span>
                </div>

                <div className="flex gap-1.5">
                  {visibleSteps.map((step, index) => (
                    <div key={step.id} className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
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
                    className="relative py-10 text-center"
                  >
                    <motion.div
                      initial={{ scale: 0.72, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 230, damping: 14 }}
                      className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-emerald-300/25 bg-emerald-400/10 text-emerald-200 shadow-2xl shadow-emerald-500/15"
                    >
                      <CheckCircle2 className="h-10 w-10" />
                    </motion.div>
                    <h2 className="mx-auto max-w-lg text-4xl font-black leading-tight tracking-[-0.035em] text-white">
                      {finalMessage.title}
                    </h2>
                    <p className="mx-auto mt-5 max-w-md text-base font-medium leading-relaxed text-slate-300">
                      {successBody}
                    </p>
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

                    <div className="mb-8">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-cyan-200/15 bg-cyan-200/10 text-sm font-black text-cyan-100">
                          {safeStepIndex + 1}
                        </div>
                        <div className="text-xs font-black uppercase tracking-[0.26em] text-slate-500">
                          One thing per screen
                        </div>
                      </div>
                      <h2 className="max-w-2xl text-4xl font-black leading-[0.98] tracking-[-0.04em] text-white sm:text-5xl">
                        {currentStep.question}
                      </h2>
                      {currentStep.helper && (
                        <p className="mt-4 max-w-xl text-base font-medium leading-relaxed text-slate-400">
                          {currentStep.helper}
                        </p>
                      )}
                    </div>

                    {currentStep.type === 'choice' && currentStep.options && (
                      <div className="grid gap-3">
                        {currentStep.options.map((option, index) => {
                          const selectedValue = answers[currentStep.id as keyof TriageAnswers];
                          const isSelected = selectedValue === option.value;

                          return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleChoice(option.value, option.feedback)}
                            className={`group relative overflow-hidden rounded-[1.35rem] border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-2xl active:scale-95 sm:p-5 ${
                              isSelected
                                ? option.urgent
                                  ? 'border-rose-300/70 bg-rose-400/15 shadow-rose-500/20'
                                  : 'border-cyan-200/70 bg-cyan-300/12 shadow-cyan-500/20'
                                : option.urgent
                                ? 'border-red-300/25 bg-red-400/[0.075] hover:border-red-200/60 hover:shadow-red-500/15'
                                : 'border-white/10 bg-white/[0.035] hover:border-cyan-200/45 hover:bg-white/[0.07] hover:shadow-cyan-500/10'
                            }`}
                          >
                            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-200/0 via-cyan-200/45 to-cyan-200/0 opacity-0 transition group-hover:opacity-100" />
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-4">
                                <span
                                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${
                                    option.urgent
                                      ? 'border-red-200/25 bg-red-300/10 text-red-100'
                                      : 'border-cyan-200/15 bg-cyan-200/10 text-cyan-100'
                                  }`}
                                >
                                  {index + 1}
                                </span>
                                <span>
                                  <span className="block text-lg font-black leading-tight text-white">{option.label}</span>
                                  {option.description && (
                                    <span className="mt-1.5 block text-sm font-medium leading-relaxed text-slate-400">
                                      {option.description}
                                    </span>
                                  )}
                                  {option.urgent && (
                                    <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-red-300/20 bg-red-400/10 px-2.5 py-1 text-[11px] font-black uppercase tracking-widest text-red-100">
                                      <AlertTriangle className="h-3 w-3" />
                                      sygnał pilniejszy
                                    </span>
                                  )}
                                </span>
                              </div>
                              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-slate-600 transition group-hover:translate-x-1 group-hover:text-cyan-100" />
                            </div>
                          </button>
                          );
                        })}
                      </div>
                    )}

                    {currentStep.type === 'slider' && (
                      <div className="space-y-5">
                        <div className="rounded-[1.8rem] border border-white/10 bg-black/25 p-5 sm:p-6">
                          <div className="mb-6 flex items-end justify-between gap-5">
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Skala bólu</p>
                              <p className="mt-2 text-sm font-semibold text-slate-400">lekki - średni - silny</p>
                            </div>
                            <span className="text-7xl font-black tracking-[-0.06em] text-white">{answers.pain_score}</span>
                          </div>
                          <input
                            type="range"
                            min={currentStep.min ?? 1}
                            max={currentStep.max ?? 10}
                            value={answers.pain_score}
                            onChange={(event) => setAnswer('pain_score', Number(event.target.value))}
                            className="w-full accent-cyan-300"
                          />
                          <div className="mt-4 flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-600">
                            <span>1</span>
                            <span>5</span>
                            <span>10</span>
                          </div>
                          {answers.pain_score >= 7 && (
                            <div className="mt-5 flex gap-3 rounded-2xl border border-red-300/20 bg-red-400/10 p-4 text-sm font-bold text-red-100">
                              <AlertTriangle className="h-5 w-5 shrink-0" />
                              Taki poziom bólu oznaczymy w zgłoszeniu jako pilniejszy.
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleSliderContinue}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-200 px-5 py-4 text-sm font-black text-slate-950 shadow-xl shadow-cyan-500/15 transition hover:bg-white"
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
                              ? 'border-amber-400/30 bg-amber-900/45 text-amber-100'
                              : urgencyTone.soft
                          }`}
                        >
                          <p className={`flex items-center gap-2 text-sm font-black ${isUrgent ? 'text-amber-400' : 'text-white'}`}>
                            {isUrgent ? <AlertTriangle className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
                            {isUrgent ? 'Sprawa priorytetowa.' : getUrgencyCopy(scoring)}
                          </p>
                          <p className={`mt-2 text-sm font-medium leading-relaxed ${isUrgent ? 'text-amber-100' : 'text-slate-300'}`}>
                            {isUrgent
                              ? `Zgłoszenie oznaczymy jako priorytetowe. Jeśli wysyłasz formularz w godzinach pracy (${CALLBACK_HOURS}), oddzwonimy w pierwszej kolejności. Poza godzinami pracy wrócimy do Ciebie w najbliższym dniu roboczym.`
                              : `To nie jest zapis na zabieg. Oddzwonimy z informacją, jaki kolejny krok ma sens, w godzinach pracy: ${CALLBACK_HOURS}.`}
                          </p>
                        </div>

                        <div className="grid gap-2 rounded-[1.35rem] border border-white/10 bg-white/[0.035] p-4 text-sm font-medium leading-relaxed text-slate-300">
                          <p>
                            Kwalifikacja online dotyczy wizyt w {PARTNER_LOCATION_COPY}. Nie pokazujemy adresu ani numeru telefonu na stronie, żeby nie mieszać tego serwisu z oficjalną stroną gabinetu.
                          </p>
                          <p>
                            Formularz nie jest zapisem na zabieg i nie zastępuje konsultacji lekarskiej.
                          </p>
                          <p className="text-amber-100/90">
                            Jeśli objawy szybko się nasilają lub stan budzi poważny niepokój, skorzystaj z pilnej pomocy medycznej.
                          </p>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Imię</label>
                          <input
                            required
                            value={answers.name}
                            onChange={(event) => setAnswer('name', event.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-base font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/80 focus:bg-white/[0.08]"
                            placeholder="np. Anna"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Telefon</label>
                          <input
                            required
                            type="tel"
                            value={answers.phone}
                            onChange={(event) => setAnswer('phone', formatPhone(event.target.value))}
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-base font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-200/80 focus:bg-white/[0.08]"
                            placeholder="Twój numer telefonu"
                          />
                        </div>

                        <label className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-sm font-medium leading-relaxed text-slate-300">
                          <input
                            type="checkbox"
                            checked={answers.consent_contact}
                            onChange={(event) => setAnswer('consent_contact', event.target.checked)}
                            className="mt-1 h-4 w-4 shrink-0 accent-cyan-300"
                          />
                          Wyrażam zgodę na kontakt telefoniczny w celu obsługi tego zgłoszenia.
                        </label>

                        {formError && <p className="text-sm font-bold text-red-200">{formError}</p>}
                        {status === 'error' && (
                          <p className="text-sm font-bold text-red-200">
                            Nie udało się wysłać zgłoszenia. Spróbuj ponownie za chwilę albo zadzwoń bezpośrednio.
                          </p>
                        )}

                        <button
                          disabled={status === 'loading'}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-200 px-5 py-4 text-sm font-black text-slate-950 shadow-xl shadow-cyan-500/15 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {status === 'loading' ? 'Wysyłanie...' : 'Poproś o kontakt'}
                          <ArrowRight className="h-4 w-4" />
                        </button>

                        <p className="flex items-center justify-center gap-1.5 text-center text-xs font-medium leading-relaxed text-slate-500">
                          <LockKeyhole className="h-3.5 w-3.5" />
                          Twoje dane są bezpieczne i służą wyłącznie do obsługi tego zgłoszenia.
                        </p>
                      </form>
                    )}

                    {safeStepIndex > 0 && currentStep.type !== 'lead' && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 transition hover:text-slate-300"
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

        <footer className="pb-4 text-center text-[11px] font-semibold leading-relaxed text-slate-600">
          Kwalifikacja online nie zastępuje konsultacji lekarskiej. Dotyczy wizyt w {PARTNER_LOCATION_COPY}. Kontakt: {CALLBACK_HOURS}.
        </footer>
      </main>
    </div>
  );
}
