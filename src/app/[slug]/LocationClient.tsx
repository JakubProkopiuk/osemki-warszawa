'use client';

import { useState, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, FileCheck, Shield, ShieldCheck } from 'lucide-react';
import locations from '../../data/locations.json';
import Breadcrumb, { type BreadcrumbItem } from '@/components/Breadcrumb';
import { getClinicProfile, type LocationRecord } from '@/lib/clinic';
import { getProcedureCount } from '@/lib/utils';

const cardStyle = 'bg-white border border-slate-200 shadow-xl rounded-3xl';
const inputStyle =
  'w-full bg-white border border-slate-300 focus:border-amber-500 p-4 rounded-2xl outline-none transition-all duration-300 text-base placeholder:text-slate-400';

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

type QuizCard = {
  value: string;
  label: string;
  desc: string;
  urgent?: boolean;
  icon: ReactNode;
  badge?: string;
};

const OptionCard = ({
  card,
  onClick,
  selected = false,
}: {
  card: QuizCard;
  onClick: () => void;
  selected?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`group w-full text-left p-4 rounded-2xl border-2 bg-white transition-all duration-150 hover:border-amber-400 hover:bg-amber-50/40 flex flex-col gap-2 ${
      selected ? 'border-amber-400 bg-amber-50/40' : 'border-slate-200'
    }`}
  >
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.urgent ? 'bg-red-50' : 'bg-amber-50'}`}>
      <span className={`[&>svg]:w-[18px] [&>svg]:h-[18px] [&>svg]:stroke-[1.8] ${card.urgent ? '[&>svg]:stroke-red-500' : '[&>svg]:stroke-amber-600'}`}>
        {card.icon}
      </span>
    </div>
    <div>
      <p className="text-[14px] font-semibold text-slate-900 leading-snug">{card.label}</p>
      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{card.desc}</p>
    </div>
    {card.badge && (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-700 w-fit">
        {card.badge}
      </span>
    )}
  </button>
);

export default function LocationClient({ locationData }: { locationData: LocationData }) {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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
      setTimeout(() => setStep((prev) => prev + 1), 250);
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
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                  <Star />
                  <span className="font-semibold text-sm text-slate-800">4.9/5 Google Maps</span>
                </div>
                <div className="hidden md:block h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                  <span className="font-semibold text-sm text-slate-800">Ponad {procedureCount.toLocaleString('pl-PL')} bezpiecznie usuniętych ósemek</span>
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
                    <span className="font-medium text-slate-400 text-[12px]">{rev.author}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={`${cardStyle} p-8 md:p-10 sticky top-10`}>
            {status !== 'success' && (
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i < step ? 'w-2 bg-green-400' : i === step ? 'w-5 bg-amber-500' : 'w-2 bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                  Krok {step} z 5
                </span>
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
                <motion.div key="step1" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Co Cię do nas sprowadza?</h2>
                    <p className="text-sm text-slate-400">Dostosujemy termin i plan wizyty do Twojej sytuacji.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <OptionCard
                      card={{
                        value: 'Ból / Stan zapalny',
                        label: 'Ból lub stan zapalny',
                        desc: 'Szybki priorytetowy termin',
                        urgent: true,
                        badge: 'Pilne',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      }}
                      selected={formData.reason === 'Ból / Stan zapalny'}
                      onClick={() => handleTileSelect('reason', 'Ból / Stan zapalny')}
                    />
                    <OptionCard
                      card={{
                        value: 'Zalecenie ortodonty',
                        label: 'Zalecenie ortodonty',
                        desc: 'Planowy zabieg chirurgiczny',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14" strokeLinecap="round" />
                          </svg>
                        ),
                      }}
                      selected={formData.reason === 'Zalecenie ortodonty'}
                      onClick={() => handleTileSelect('reason', 'Zalecenie ortodonty')}
                    />
                  </div>
                  <OptionCard
                    card={{
                      value: 'Konsultacja',
                      label: 'Konsultacja / nie jestem pewien',
                      desc: 'Lekarz oceni sytuację i zaproponuje dalsze kroki',
                      icon: (
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="12" cy="8" r="4" strokeLinecap="round" />
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
                        </svg>
                      ),
                    }}
                    selected={formData.reason === 'Konsultacja'}
                    onClick={() => handleTileSelect('reason', 'Konsultacja')}
                  />
                </motion.div>
              ) : step === 2 ? (
                <motion.div key="step2" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Która ósemka sprawia problem?</h2>
                    <p className="text-sm text-slate-400">Precyzyjniejsza informacja = szybsza kwalifikacja.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <OptionCard
                      card={{
                        value: 'Górnej',
                        label: 'Górna',
                        desc: 'Zazwyczaj szybki, przewidywalny zabieg',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 3v18M8 7l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      }}
                      selected={formData.toothArea === 'Górnej'}
                      onClick={() => handleTileSelect('toothArea', 'Górnej')}
                    />
                    <OptionCard
                      card={{
                        value: 'Dolnej',
                        label: 'Dolna',
                        desc: 'Wymaga diagnostyki 3D — wykonujemy na miejscu',
                        urgent: true,
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 3v18M8 17l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      }}
                      selected={formData.toothArea === 'Dolnej'}
                      onClick={() => handleTileSelect('toothArea', 'Dolnej')}
                    />
                    <OptionCard
                      card={{
                        value: 'Obu / Kilku',
                        label: 'Obie / kilka',
                        desc: 'Kompleksowe rozwiązanie podczas jednej wizyty',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M12 3v18M8 7l4-4 4 4M8 17l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      }}
                      selected={formData.toothArea === 'Obu / Kilku'}
                      onClick={() => handleTileSelect('toothArea', 'Obu / Kilku')}
                    />
                    <OptionCard
                      card={{
                        value: 'Nie jestem pewien',
                        label: 'Nie jestem pewien',
                        desc: 'Lekarz oceni na podstawie RTG',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" />
                            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
                          </svg>
                        ),
                      }}
                      selected={formData.toothArea === 'Nie jestem pewien'}
                      onClick={() => handleTileSelect('toothArea', 'Nie jestem pewien')}
                    />
                  </div>
                  <AnimatePresence>
                    {formData.toothArea && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-[13px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        Dobra decyzja — im więcej wiemy teraz, tym precyzyjniejsza kwalifikacja.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : step === 3 ? (
                <motion.div key="step3" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Masz aktualne RTG?</h2>
                    <p className="text-sm text-slate-400">Nie masz? Nie szkodzi — wykonamy diagnostykę na miejscu.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <OptionCard
                      card={{
                        value: 'Tak',
                        label: 'Tak, mam zdjęcie',
                        desc: 'Aktualne RTG lub CBCT',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                          </svg>
                        ),
                      }}
                      selected={formData.hasRTG === 'Tak'}
                      onClick={() => handleTileSelect('hasRTG', 'Tak')}
                    />
                    <OptionCard
                      card={{
                        value: 'Nie, chcę zrobić',
                        label: 'Nie mam RTG',
                        desc: 'Wykonamy pełną diagnostykę u nas',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                          </svg>
                        ),
                      }}
                      selected={formData.hasRTG === 'Nie, chcę zrobić'}
                      onClick={() => handleTileSelect('hasRTG', 'Nie, chcę zrobić')}
                    />
                  </div>
                  <AnimatePresence>
                    {isAnalyzing && (
                      <motion.div
                        key="analysis"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-xl border border-amber-200 bg-amber-50 p-4"
                      >
                        <p className="text-sm font-semibold text-slate-900">✓ Twoje odpowiedzi zostały wstępnie przeanalizowane.</p>
                        <p className="text-sm text-amber-600 font-semibold mt-0.5">Zostały 2 kroki do bezpłatnej wyceny.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : step === 4 ? (
                <motion.div key="step4" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Co Cię najbardziej niepokoi?</h2>
                    <p className="text-sm text-slate-400">Przygotujemy plan wizyty dokładnie pod Twoje obawy.</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        value: 'Ból',
                        label: 'Boję się bólu przy zabiegu',
                        desc: 'Stosujemy zaawansowane znieczulenie — zabieg całkowicie bezbolesny',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ),
                      },
                      {
                        value: 'Gojenie',
                        label: 'Czas gojenia i powrót do pracy',
                        desc: 'Większość pacjentów wraca do obowiązków następnego dnia',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" />
                            <polyline points="12 7 12 12 15 15" strokeLinecap="round" />
                          </svg>
                        ),
                      },
                      {
                        value: 'Koszty',
                        label: 'Koszty i ukryte opłaty',
                        desc: 'Pełna wycena przed zabiegiem — zero niespodzianek',
                        icon: (
                          <svg viewBox="0 0 24 24" fill="none">
                            <rect x="1" y="4" width="22" height="16" rx="2" strokeLinejoin="round" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                          </svg>
                        ),
                      },
                    ].map((opt) => (
                      <OptionCard
                        key={opt.value}
                        card={{ ...opt }}
                        selected={formData.biggestFear === opt.value}
                        onClick={() => handleTileSelect('biggestFear', opt.value)}
                      />
                    ))}
                  </div>
                  <AnimatePresence>
                    {fearFeedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-[13px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        {fearFeedback}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div key="step5" layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-5">
                  <div className="bg-slate-900 rounded-2xl p-5 flex items-start gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                    <div>
                      <h2 className="text-[15px] font-semibold text-slate-100 leading-snug mb-1">
                        {formData.reason === 'Ból / Stan zapalny'
                          ? 'Zgłoszenie priorytetowe przyjęte'
                          : 'Twój przypadek kwalifikuje się do wizyty'}
                      </h2>
                      <p className="text-[12px] text-slate-400 leading-relaxed">
                        {formData.reason === 'Ból / Stan zapalny'
                          ? 'Nadaliśmy najwyższy priorytet. Oddzwonimy najszybciej jak to możliwe w godzinach pracy kliniki.'
                          : 'Zostaw kontakt — koordynator oddzwoni w ciągu 2h z propozycją terminu.'}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Imię</label>
                      <input
                        type="text"
                        required
                        placeholder="np. Marek"
                        value={formData.name}
                        onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        className={inputStyle}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Telefon</label>
                      <input
                        type="tel"
                        required
                        placeholder="Twój numer telefonu"
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`${inputStyle} font-mono tracking-wider`}
                      />
                      <p className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-medium">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" /> Twoje dane są szyfrowane. Zadzwonimy tylko raz, aby ustalić termin.
                      </p>
                    </div>
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
                      {status === 'loading' ? 'Wysyłanie...' : 'Zarezerwuj bezpłatną konsultację →'}
                    </button>

                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
                      {[
                        { icon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'Dane szyfrowane' },
                        { icon: <FileCheck className="w-3.5 h-3.5" />, label: 'Wycena przed zabiegiem' },
                        { icon: <Clock className="w-3.5 h-3.5" />, label: 'Szybkie terminy' },
                      ].map((t) => (
                        <div key={t.label} className="flex flex-col items-center gap-1 bg-slate-50 border border-slate-100 rounded-xl p-2.5 text-center">
                          <span className="text-slate-400 [&>svg]:w-3.5 [&>svg]:h-3.5">{t.icon}</span>
                          <span className="text-[10px] text-slate-400 leading-tight">{t.label}</span>
                        </div>
                      ))}
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-3 mb-12">
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
