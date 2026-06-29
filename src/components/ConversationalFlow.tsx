'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, CheckCircle2, ChevronLeft, Phone, ShieldCheck } from 'lucide-react';
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

  const scoring = scoreLead(answers);
  const visibleSteps = config.steps.filter(
    (step) => !(step.skipWhenUrgent && scoring.urgencyBand === 'high'),
  );
  const safeStepIndex = Math.min(stepIndex, visibleSteps.length - 1);
  const currentStep = visibleSteps[safeStepIndex];
  const progress = status === 'success' ? 100 : Math.round(((safeStepIndex + 1) / visibleSteps.length) * 100);
  const isLocalEntry = localArea !== config.location;
  const finalMessage = config.finalMessages[scoring.urgencyBand];

  const goNext = () => {
    setStepIndex((prev) => Math.min(prev + 1, visibleSteps.length - 1));
  };

  const goBack = () => {
    setFeedback(null);
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const setAnswer = <Key extends keyof TriageAnswers>(key: Key, value: TriageAnswers[Key]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleChoice = (value: string, optionFeedback?: string) => {
    setAnswer(currentStep.id as keyof TriageAnswers, value as never);
    setFeedback(optionFeedback ?? null);
    window.setTimeout(() => {
      setFeedback(null);
      goNext();
    }, optionFeedback ? 520 : 180);
  };

  const handleSliderContinue = () => {
    setFeedback(getPainFeedback(answers.pain_score));
    window.setTimeout(() => {
      setFeedback(null);
      goNext();
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
    ['Objaw', answers.symptom],
    ['Miejsce', answers.tooth_area],
    ['Ból', answers.pain_score ? `${answers.pain_score}/10` : null],
    ['RTG', answers.has_rtg],
    ['Kontakt', answers.preferred_contact_time],
  ].filter(([, value]) => Boolean(value));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#061014] text-white antialiased">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(34,211,238,0.28),transparent_30%),radial-gradient(circle_at_85%_18%,rgba(239,68,68,0.20),transparent_24%),linear-gradient(135deg,#061014_0%,#0b1720_52%,#05080b_100%)]" />
      <div className="absolute left-1/2 top-1/2 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />

      <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 md:px-8 md:py-7">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.32em] text-cyan-300">Ósemki Ursynów</p>
            <p className="mt-1 hidden text-xs font-semibold text-slate-400 sm:block">
              Kwalifikacja online dla wizyt w partnerskim gabinecie przy al. KEN 96
            </p>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 backdrop-blur">
            {isLocalEntry ? localArea : 'Ursynów'}
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[0.82fr,1.18fr] md:py-10">
          <aside className="hidden lg:block">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-cyan-200">
              <ShieldCheck className="h-4 w-4" />
              {config.intro.eyebrow}
            </div>
            <h1 className="max-w-lg text-5xl font-black leading-[0.92] tracking-tight text-white xl:text-6xl">
              {isLocalEntry ? config.intro.localTitle(localArea) : config.intro.title}
            </h1>
            <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-slate-300">
              {config.intro.description}
            </p>

            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Wstępny status</p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-black ${
                    scoring.urgencyBand === 'high'
                      ? 'bg-red-500/15 text-red-200'
                      : scoring.urgencyBand === 'medium'
                        ? 'bg-cyan-400/15 text-cyan-200'
                        : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {getUrgencyCopy(scoring)}
                </span>
              </div>
              <div className="space-y-2">
                {summary.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-4 rounded-2xl bg-black/20 px-4 py-3">
                    <span className="text-xs font-bold text-slate-500">{label}</span>
                    <span className="text-right text-sm font-bold text-slate-200">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div className="mx-auto w-full max-w-2xl">
            <div className="mb-5 lg:hidden">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-xs font-black uppercase tracking-widest text-cyan-200">
                <ShieldCheck className="h-4 w-4" />
                {config.intro.eyebrow}
              </div>
              <h1 className="text-4xl font-black leading-[0.95] tracking-tight text-white sm:text-5xl">
                {isLocalEntry ? config.intro.localTitle(localArea) : config.intro.title}
              </h1>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6 md:p-8">
              <div className="mb-7">
                <div className="mb-3 flex items-center justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                  <span>{status === 'success' ? 'Gotowe' : currentStep.eyebrow}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className={`h-full rounded-full ${scoring.urgencyBand === 'high' ? 'bg-red-400' : 'bg-cyan-300'}`}
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 22 }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    className="py-8 text-center"
                  >
                    <div
                      className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl ${
                        scoring.urgencyBand === 'high' ? 'bg-red-400/15 text-red-200' : 'bg-cyan-300/15 text-cyan-200'
                      }`}
                    >
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h2 className="mx-auto max-w-md text-3xl font-black leading-tight tracking-tight text-white">
                      {finalMessage.title}
                    </h2>
                    <p className="mx-auto mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-300">
                      {finalMessage.body}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentStep.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -18 }}
                    transition={{ duration: 0.22 }}
                  >
                    <AnimatePresence>
                      {feedback && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="mb-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-100"
                        >
                          {feedback}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="mb-7">
                      <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">
                        {currentStep.question}
                      </h2>
                      {currentStep.helper && (
                        <p className="mt-3 text-sm font-medium leading-relaxed text-slate-400 sm:text-base">
                          {currentStep.helper}
                        </p>
                      )}
                    </div>

                    {currentStep.type === 'choice' && currentStep.options && (
                      <div className="grid gap-3">
                        {currentStep.options.map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => handleChoice(option.value, option.feedback)}
                            className={`group rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:bg-white/[0.08] sm:p-5 ${
                              option.urgent
                                ? 'border-red-300/30 bg-red-400/[0.08] hover:border-red-300/60'
                                : 'border-white/10 bg-white/[0.035] hover:border-cyan-300/40'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <span className="block text-base font-black text-white sm:text-lg">{option.label}</span>
                                {option.description && (
                                  <span className="mt-1 block text-sm font-medium leading-relaxed text-slate-400">
                                    {option.description}
                                  </span>
                                )}
                              </div>
                              <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-200" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}

                    {currentStep.type === 'slider' && (
                      <div className="space-y-5">
                        <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-5">
                          <div className="mb-5 flex items-end justify-between">
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest text-slate-500">Skala bólu</p>
                              <p className="mt-1 text-sm font-semibold text-slate-400">lekki - średni - silny</p>
                            </div>
                            <span className="text-6xl font-black tracking-tight text-white">{answers.pain_score}</span>
                          </div>
                          <input
                            type="range"
                            min={currentStep.min ?? 1}
                            max={currentStep.max ?? 10}
                            value={answers.pain_score}
                            onChange={(event) => setAnswer('pain_score', Number(event.target.value))}
                            className="w-full accent-cyan-300"
                          />
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
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-200"
                        >
                          Dalej
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    {currentStep.type === 'lead' && (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div
                          className={`rounded-2xl border p-4 ${
                            scoring.urgencyBand === 'high'
                              ? 'border-red-300/20 bg-red-400/10'
                              : 'border-cyan-300/20 bg-cyan-300/10'
                          }`}
                        >
                          <p className="text-sm font-black text-white">{getUrgencyCopy(scoring)}</p>
                          <p className="mt-1 text-sm font-medium leading-relaxed text-slate-300">
                            To nie jest zapis na zabieg. Oddzwonimy z informacją, jaki kolejny krok ma sens.
                          </p>
                        </div>

                        <div>
                          <label className="mb-2 block text-xs font-black uppercase tracking-widest text-slate-500">Imię</label>
                          <input
                            required
                            value={answers.name}
                            onChange={(event) => setAnswer('name', event.target.value)}
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-base font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70"
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
                            className="w-full rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-base font-semibold text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/70"
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
                          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {status === 'loading' ? 'Wysyłanie...' : 'Poproś o kontakt'}
                          <Phone className="h-4 w-4" />
                        </button>
                      </form>
                    )}

                    {safeStepIndex > 0 && currentStep.type !== 'lead' && (
                      <button
                        type="button"
                        onClick={goBack}
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
          Kwalifikacja online nie zastępuje konsultacji lekarskiej. Wizyty odbywają się w partnerskim gabinecie stomatologicznym na Ursynowie.
        </footer>
      </main>
    </div>
  );
}
