'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileCheck,
  Shield,
  Stethoscope,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import locations from '../../data/locations.json';
import Breadcrumb, { type BreadcrumbItem } from '@/components/Breadcrumb';
import { getClinicProfile, type LocationRecord } from '@/lib/clinic';
import { getProcedureCount } from '@/lib/utils';

const cardStyle = 'bg-white border border-slate-200 shadow-xl rounded-3xl';
const inputStyle =
  'w-full bg-white border border-slate-300 focus:border-amber-500 p-4 rounded-2xl outline-none transition-all duration-300 text-base placeholder:text-slate-400';
const tileStyle =
  'w-full text-left p-6 rounded-2xl border-2 border-slate-100 bg-white transition-all duration-300 hover:border-amber-500 hover:bg-amber-50/30 hover:-translate-y-1 hover:shadow-xl flex items-start gap-4 group cursor-pointer';

const Star = () => (
  <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

type Review = { author: string; text: string; rating: number };
type LocationData = {
  slug: string;
  nazwa_lokalizacji: string;
  klinika: string;
  czas_dojazdu: string;
  punkt_orientacyjny?: string;
  komunikacja?: string;
  parking?: string;
  reviews?: Review[];
};

type FormDataState = {
  reason: string;
  toothArea: string;
  hasRTG: string;
  biggestFear: string;
  name: string;
  phone: string;
};

type QuizOption = {
  label: string;
  value: string;
  icon: LucideIcon;
  description?: string;
};

export default function LocationClient({ locationData }: { locationData: LocationData }) {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [step2Feedback, setStep2Feedback] = useState<string | null>(null);
  const [fearFeedback, setFearFeedback] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataState>({
    reason: '',
    toothArea: '',
    hasRTG: '',
    biggestFear: '',
    name: '',
    phone: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const isOchota = locationData.klinika.toLowerCase().includes('pruszkowska');
  const clinicProfile = getClinicProfile(locationData.klinika);
  const procedureCount = getProcedureCount(new Date(clinicProfile.openingDate));
  const doctor = isOchota
    ? { name: 'lek. dent. Małgorzata Sturska', role: 'Specjalista chirurgii', img: '/doctors/sturska.jpg', locName: 'Ochota' }
    : { name: 'lek. dent. Natalia Kowalczyk-Zuchora', role: 'Lekarz dentysta', img: '/doctors/kowalczyk.webp', locName: 'Ursynów' };

  const locationName = locationData.nazwa_lokalizacji === 'Rakowiec' ? 'Osiedle Rakowiec' : locationData.nazwa_lokalizacji;
  const parkingText =
    locationData.parking && (locationData.parking.includes('SPPN') || locationData.parking.includes('Płatnego'))
      ? 'Zawsze znajdziesz wolne miejsce – strefa SPPN gwarantuje stałą rotację aut tuż pod samym gabinetem.'
      : locationData.parking;

  const relatedLocations = (() => {
    const all = locations as LocationRecord[];
    const firstSlugToken = locationData.slug.split('-')[0];
    const isCentralHub = locationData.slug.startsWith('metro-');
    const blockedTownTokens = ['iwiczna', 'zalesie', 'piaseczno'];
    const isAllowed = (slug: string) =>
      !isCentralHub || !blockedTownTokens.some((token) => slug.includes(token));

    const sameClinic = all.filter(
      (loc) =>
        loc.slug !== locationData.slug &&
        loc.klinika === locationData.klinika &&
        isAllowed(loc.slug),
    );

    const districtFirst = sameClinic.filter((loc) => loc.slug.split('-')[0] === firstSlugToken);
    const fallback = sameClinic.filter((loc) => loc.slug.split('-')[0] !== firstSlugToken);

    return [...districtFirst, ...fallback].slice(0, 6);
  })();

  const mapEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent('Ochota na Uśmiech Warszawa ' + locationData.klinika)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const experimentVariant = locationData.slug.charCodeAt(0) % 2 === 0 ? 'A' : 'B';
  const breadcrumbItems: BreadcrumbItem[] = [
    { name: 'Strona główna', href: '/' },
    { name: clinicProfile.hubName, href: `/${clinicProfile.hubSlug}` },
    { name: locationName, href: `/${locationData.slug}` },
  ];

  const handleTileSelect = (field: keyof FormDataState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === 'toothArea') {
      setStep2Feedback('Dobra decyzja — im więcej wiemy na tym etapie, tym precyzyjniejsza kwalifikacja.');
      setTimeout(() => {
        setStep2Feedback(null);
        setStep((prev) => prev + 1);
      }, 1200);
      return;
    }

    if (field === 'hasRTG') {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setStep((prev) => prev + 1);
      }, 1500);
      return;
    }

    if (field === 'biggestFear') {
      const message =
        value === 'Ból'
          ? 'Mądrzy pacjenci pytają o znieczulenie. Dobry wybór.'
          : value === 'Gojenie'
            ? 'Planowanie powrotu do pracy to oznaka odpowiedzialności.'
            : 'Transparentność cenowa to Twoje prawo. Mamy to.';
      setFearFeedback(message);
      setTimeout(() => {
        setFearFeedback(null);
        setStep((prev) => prev + 1);
      }, 1500);
      return;
    }

    setTimeout(() => setStep((prev) => prev + 1), 250);
  };

  const optionListVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const optionItemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  const renderOptions = (field: keyof FormDataState, options: QuizOption[]) => (
    <motion.div
      layout
      className="space-y-3"
      variants={optionListVariants}
      initial="hidden"
      animate="visible"
    >
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <motion.button
            key={option.value}
            variants={optionItemVariants}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            onClick={() => handleTileSelect(field, option.value)}
            className={tileStyle}
          >
            <span className="flex items-start gap-3 text-slate-800 min-w-0">
              <Icon className="w-6 h-6 text-amber-500 shrink-0" />
              <span>
                <span className="font-semibold block">{option.label}</span>
                {option.description && (
                  <span className="text-xs text-slate-500 font-medium">{option.description}</span>
                )}
              </span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors ml-auto shrink-0 mt-1" />
          </motion.button>
        );
      })}
    </motion.div>
  );

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 9);
    const matched = val.match(/(\d{0,3})(\d{0,3})(\d{0,3})/);
    if (!matched) return;
    const formatted = !matched[2] ? matched[1] : `${matched[1]}-${matched[2]}${matched[3] ? `-${matched[3]}` : ''}`;
    setFormData((prev) => ({ ...prev, phone: formatted }));
    if (phoneError) {
      setPhoneError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    const rawPhone = formData.phone.replace(/-/g, '');
    if (rawPhone.length !== 9) {
      setPhoneError('Podaj poprawny numer telefonu (9 cyfr).');
      return;
    }

    const leadScore =
      (formData.reason === 'Ból / Stan zapalny' ? 40 : 20) +
      (formData.toothArea === 'Dolnej' ? 20 : formData.toothArea === 'Obu / Kilku' ? 18 : 10) +
      (formData.hasRTG === 'Tak' ? 20 : 10) +
      (formData.biggestFear === 'Koszty' ? 10 : 15);

    const leadPriority = leadScore >= 80 ? 'high' : leadScore >= 60 ? 'medium' : 'low';

    setStatus('loading');
    try {
      const res = await fetch('https://hook.eu1.make.com/k73x9s65dxykfhry5uyodhl6bg2kvkx7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: rawPhone,
          slug: locationData.slug,
          locationName,
          clinic: locationData.klinika,
          timestamp: new Date().toLocaleString('pl-PL'),
          experimentVariant,
          leadScore,
          leadPriority,
        }),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col items-center p-4 md:p-8">
      <main className="w-full max-w-[1140px] mt-10 md:mt-20 text-left mx-auto">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-14 md:gap-20 items-start mb-28">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="space-y-5">
              <Breadcrumb items={breadcrumbItems} />
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 shadow-sm text-amber-400 text-[11px] font-semibold uppercase tracking-wider leading-none">
                <Shield className="w-3.5 h-3.5" /> Bezpieczna chirurgia {doctor.locName}
              </div>

              <h1 className="text-4xl md:text-[62px] font-extrabold tracking-tight leading-[0.97] text-slate-900">
                Bezbolesne usuwanie ósemek blisko <br />
                <span className="text-slate-800 italic">{locationName}.</span>
              </h1>

              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-xl">
                <strong className="text-slate-900">Bez bólu. Bez stresu.</strong> Dojazd do kliniki na ul. {locationData.klinika} w{' '}
                <strong className="text-slate-900">{locationData.czas_dojazdu}</strong>. Sprawdź w 30 sekund, czy kwalifikujesz się do szybkiej wizyty. RTG wykonujemy na miejscu.
              </p>

              {(locationData.komunikacja || parkingText) && (
                <div className="flex flex-col gap-3 pt-2">
                  {locationData.komunikacja && (
                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-white px-4 py-2 rounded-xl w-fit border border-slate-200">
                      <strong className="text-slate-900">Dojazd:</strong> {locationData.komunikacja}
                    </div>
                  )}
                  {parkingText && (
                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-white px-4 py-2 rounded-xl w-fit border border-slate-200">
                      <strong className="text-slate-900">Parking:</strong> {parkingText}
                    </div>
                  )}
                </div>
              )}

              <div className="bg-white border border-slate-200 rounded-2xl p-5 mt-4">
                <h2 className="text-lg font-bold tracking-tight text-slate-900 mb-3">
                  Dlaczego pacjenci z {locationName} wybierają naszą klinikę?
                </h2>
                <ul className="space-y-2">
                  {isOchota
                    ? [
                        'Szybki dojazd komunikacją z Dworca Zachodniego',
                        'Miejsca parkingowe z dużą rotacją aut tuż pod gabinetem',
                        'Zaawansowane i w pełni bezbolesne znieczulenia chirurgiczne',
                      ].map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))
                    : [
                        'Bezpośrednie sąsiedztwo stacji Metro Ursynów',
                        'Prywatny, darmowy parking dla pacjentów',
                        'Nowoczesna diagnostyka 3D (CBCT) na miejscu',
                      ].map((point) => (
                        <li key={point} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                          <span>{point}</span>
                        </li>
                      ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 p-7 rounded-3xl bg-white border border-slate-100 shadow-xl">
              <div className="h-24 w-24 rounded-2xl overflow-hidden relative shrink-0 shadow-sm ring-2 ring-slate-100">
                <Image src={doctor.img} alt={doctor.name} fill className="object-cover" loading="lazy" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{doctor.name}</h3>
                <p className="text-slate-800 font-semibold text-xs uppercase tracking-widest mb-1">{doctor.role}</p>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 mb-2">
                  Certyfikowany Chirurg
                </div>
                <p className="text-slate-500 font-medium leading-relaxed text-sm">Lekarz prowadzący w placówce na ul. {locationData.klinika}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <Star />
                  <span className="font-bold text-sm text-slate-900 uppercase">4.9/5 Google Maps</span>
                </div>
                <div className="hidden md:block h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <span className="font-bold text-sm text-slate-900 uppercase">Ponad {procedureCount.toLocaleString('pl-PL')} bezpiecznie usuniętych ósemek</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {locationData.reviews?.slice(0, 4).map((rev) => (
                  <motion.div key={`${rev.author}-${rev.text.slice(0, 20)}`} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex gap-1 mb-3 text-amber-400 scale-75 origin-left">
                        {[...Array(rev.rating || 5)].map((_, s) => (
                          <Star key={`${rev.author}-star-${s}`} />
                        ))}
                      </div>
                      <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4">&quot;{rev.text}&quot;</p>
                    </div>
                    <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">{rev.author}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={`${cardStyle} p-8 md:p-10 sticky top-10`}>
            {status !== 'success' && (
              <div className="mb-8">
                <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  <span>Krok {step} z 5</span>
                  <span className="text-slate-900">{step * 20}%</span>
                </div>
                <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-amber-500" initial={{ width: 0 }} animate={{ width: `${step * 20}%` }} transition={{ duration: 0.4, ease: 'easeInOut' }} />
                </div>
              </div>
            )}

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="success" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-500 rounded-2xl mx-auto flex items-center justify-center text-slate-900 text-3xl mb-6">✓</div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-3">Zgłoszenie w systemie</h2>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    Dziękujemy. Przeanalizujemy Twoje odpowiedzi i oddzwonimy z propozycją dogodnego, bezpiecznego terminu.
                  </p>
                </motion.div>
              ) : step === 1 ? (
                <motion.div key="step1" layout initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Z czym do nas trafiasz?</h2>
                  {renderOptions('reason', [
                    { label: 'Ból / stan zapalny', value: 'Ból / Stan zapalny', icon: Activity },
                    { label: 'Zalecenie ortodonty', value: 'Zalecenie ortodonty', icon: Stethoscope },
                    { label: 'Konsultacja', value: 'Konsultacja', icon: Shield },
                  ])}
                </motion.div>
              ) : step === 2 ? (
                <motion.div key="step2" layout initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Której ósemki dotyczy problem?</h2>
                  <p className="text-slate-500 text-sm font-medium">Dzięki temu szybciej dobierzemy właściwy typ konsultacji.</p>
                  {renderOptions('toothArea', [
                    {
                      label: 'Górnej',
                      value: 'Górnej',
                      icon: Stethoscope,
                      description: '(Zazwyczaj szybki i przewidywalny zabieg)',
                    },
                    {
                      label: 'Dolnej',
                      value: 'Dolnej',
                      icon: Stethoscope,
                      description: '(Wymaga precyzyjnej diagnostyki 3D przed zabiegiem)',
                    },
                    {
                      label: 'Obu / Kilku',
                      value: 'Obu / Kilku',
                      icon: Activity,
                      description: '(Kompleksowe rozwiązanie podczas jednej wizyty)',
                    },
                    {
                      label: 'Nie jestem pewien',
                      value: 'Nie jestem pewien',
                      icon: Shield,
                      description: '(Lekarz oceni sytuację na podstawie zdjęcia RTG)',
                    },
                  ])}
                  <AnimatePresence>
                    {step2Feedback && (
                      <motion.p
                        key="step2-feedback"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm font-semibold text-slate-700"
                      >
                        {step2Feedback}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : step === 3 ? (
                <motion.div key="step3" layout initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Masz aktualne RTG?</h2>
                  <p className="text-slate-500 text-sm font-medium">Zdjęcie pantomograficzne jest wymagane do bezpiecznej kwalifikacji.</p>
                  {renderOptions('hasRTG', [
                    { label: 'Tak, mam aktualne zdjęcie', value: 'Tak', icon: FileCheck },
                    { label: 'Nie, wykonam zdjęcie na miejscu', value: 'Nie, chcę zrobić', icon: Camera },
                  ])}
                  <AnimatePresence>
                    {isAnalyzing && (
                      <motion.div
                        key="analysis"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-2xl border border-slate-200 bg-white p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900">✓ Twoje odpowiedzi zostały wstępnie przeanalizowane.</p>
                        <p className="text-sm text-amber-500 font-semibold">Zostały 2 kroki do bezpłatnej wyceny.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : step === 4 ? (
                <motion.div key="step4" layout initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-6">
                  <h2 className="text-2xl font-bold tracking-tight text-slate-900">Twoja główna obawa?</h2>
                  <p className="text-slate-500 text-sm font-medium">Dzięki temu przygotujemy plan wizyty dopasowany do Twoich potrzeb.</p>
                  {renderOptions('biggestFear', [
                    { label: 'Boję się bólu (bezbolesne i mocne znieczulenie)', value: 'Ból', icon: Shield },
                    { label: 'Czas gojenia i powrót do pracy', value: 'Gojenie', icon: Clock },
                    { label: 'Koszty (brak ukrytych opłat, jasny cennik)', value: 'Koszty', icon: Wallet },
                  ])}
                  <AnimatePresence>
                    {fearFeedback && (
                      <motion.p
                        key="fear-feedback"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-sm font-semibold text-slate-700"
                      >
                        {fearFeedback}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div key="step5" layout initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }} className="space-y-8">
                  <div>
                    {formData.reason === 'Ból / Stan zapalny' ? (
                      <>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900">🚨 Zgłoszenie bólowe przyjęte (Priorytet)</h2>
                        <p className="text-slate-500 text-sm mt-2 font-medium">
                          Rozumiemy, jak trudny jest ból zęba. Nadaliśmy Twojemu zgłoszeniu najwyższy priorytet.
                          Skontaktujemy się z Tobą najszybciej jak to możliwe (w godzinach pracy kliniki), aby
                          znaleźć ratunkowy termin. RTG i diagnostykę wykonamy na miejscu.
                        </p>
                      </>
                    ) : (
                      <>
                        {experimentVariant === 'A' ? (
                          <>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Świetnie! Kwalifikujesz się do bezbolesnego zabiegu.</h2>
                            <p className="text-slate-500 text-sm mt-2 font-medium">
                              Zostaw numer telefonu. Nasz koordynator oddzwoni do Ciebie wkrótce z propozycją dogodnego i
                              bezpiecznego terminu.
                            </p>
                          </>
                        ) : (
                          <>
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Masz już komplet — możemy przejść do bezpłatnej wyceny.</h2>
                            <p className="text-slate-500 text-sm mt-2 font-medium">
                              Zostaw numer telefonu. Skontaktujemy się dzisiaj (w godzinach pracy) i wspólnie wybierzemy
                              najbliższy dostępny termin.
                            </p>
                          </>
                        )}
                      </>
                    )}
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" aria-label="Imię" required placeholder="Twoje imię" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))} className={inputStyle} />
                    <input type="tel" aria-label="Telefon" required placeholder="Twój numer telefonu" value={formData.phone} onChange={handlePhoneChange} className={`${inputStyle} font-mono tracking-wider`} />
                    <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-medium"><Shield className="w-3.5 h-3.5 text-emerald-500" /> Twoje dane są szyfrowane. Zadzwonimy tylko raz, aby ustalić termin.</p>
                    {phoneError && (
                      <p className="text-xs text-red-600 font-medium" role="alert">
                        {phoneError}
                      </p>
                    )}
                    {status === 'error' && (
                      <p className="text-xs text-red-600 font-medium" role="alert">
                        Nie udało się wysłać zgłoszenia. Spróbuj ponownie za chwilę lub zadzwoń bezpośrednio.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full bg-gradient-to-b from-amber-400 to-amber-500 text-amber-950 font-bold text-lg py-4 mt-4 rounded-2xl shadow-[0_8px_20px_-6px_rgba(245,158,11,0.4)] transition-all duration-300 hover:shadow-[0_12px_25px_-6px_rgba(245,158,11,0.6)] hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {status === 'loading' ? 'Wysyłanie...' : 'Sprawdź termin'}
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4 border-t border-slate-100 mt-5">
                      <div className="text-center text-[11px] font-semibold tracking-wide text-slate-500">[ Bezpieczne dane ]</div>
                      <div className="text-center text-[11px] font-semibold tracking-wide text-slate-500">[ Wycena przed zabiegiem ]</div>
                      <div className="text-center text-[11px] font-semibold tracking-wide text-slate-500">[ Szybkie terminy ]</div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-center gap-4 mb-12">
          <Clock className="w-6 h-6 text-amber-600 shrink-0" />
          <p className="text-amber-900 font-medium text-sm md:text-base">
            <strong>Ważne:</strong> W tym tygodniu w placówce na ul. {locationData.klinika} mamy jeszcze{' '}
            <span className="font-bold underline">3 wolne terminy</span> na zabiegi chirurgiczne. Wypełnij formularz
            powyżej, aby zarezerwować miejsce.
          </p>
        </div>

        <div className="mb-28 text-left">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight italic text-slate-900 leading-none">Częste pytania</h2>
            <div className="h-px flex-grow bg-slate-200" />
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {[
              {
                q: 'Czy zabieg będzie bolesny?',
                a: 'Stosujemy zaawansowane znieczulenie miejscowe, dzięki czemu sam zabieg jest całkowicie bezbolesny. Czujesz jedynie delikatny dotyk, bez żadnego dyskomfortu.',
              },
              {
                q: 'Czy muszę mieć skierowanie lub RTG?',
                a: 'Nie potrzebujesz skierowania. Jeśli nie posiadasz aktualnego zdjęcia pantomograficznego, wykonamy precyzyjną diagnostykę w naszym gabinecie przed zabiegiem.',
              },
              {
                q: 'Co po zabiegu? Czy dostanę zwolnienie (L4)?',
                a: 'Większość pacjentów wraca do normalnych obowiązków już następnego dnia. W razie potrzeby wystawiamy elektroniczne zwolnienie lekarskie (e-ZLA) na czas rekonwalescencji.',
              },
              {
                q: 'Jakie są koszty usunięcia ósemki?',
                a: 'Koszt zabiegu jest zawsze ustalany indywidualnie na podstawie zdjęcia RTG i stopnia skomplikowania. Gwarantujemy jednak pełną przejrzystość – dokładną i ostateczną wycenę, bez żadnych "ukrytych kosztów", poznasz zawsze przed podaniem znieczulenia.',
              },
            ].map((faq) => (
              <div key={faq.q} className="space-y-3">
                <h3 className="text-lg font-bold tracking-tight text-slate-900">{faq.q}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-28 text-left">
          <div className="flex items-center gap-4 mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight italic text-slate-900 leading-none">Mapa dojazdu</h2>
            <div className="h-px flex-grow bg-slate-200 rounded-full" />
          </div>
          <div className="w-full h-[460px] rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative bg-white">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              title="Mapa dojazdu"
              src={mapEmbedSrc}
            />
          </div>
        </div>

        <div className="mb-20 text-left border-t border-slate-200 pt-6">
          <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">
            Pobliskie lokalizacje
          </p>
          <div className="flex flex-wrap gap-2">
            {relatedLocations.map((loc) => (
              <Link
                key={loc.slug}
                href={`/${loc.slug}`}
                className="inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium border border-slate-200 bg-white text-slate-600 hover:border-amber-400 hover:text-slate-900 transition-colors"
              >
                {`Usuwanie ósemek ${loc.nazwa_lokalizacji}`}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="mt-20 pb-10 text-slate-400 text-[10px] font-semibold uppercase tracking-[0.5em] text-center">
        © 2026 Ochota na Uśmiech
      </footer>
    </div>
  );
}
