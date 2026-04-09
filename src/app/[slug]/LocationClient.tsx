'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const cardStyle = "bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[48px]";
const inputStyle = "w-full bg-slate-100/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-5 rounded-3xl outline-none transition-all duration-300 text-lg placeholder:text-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]";
const tileStyle = "w-full text-left p-6 rounded-3xl border-2 transition-all duration-300 hover:shadow-md flex items-center gap-4 bg-white cursor-pointer group";

const Star = () => <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;

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

export default function LocationClient({ locationData }: { locationData: LocationData }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    reason: '',
    painLevel: 5,
    hasRTG: '',
    biggestFear: '',
    name: '',
    phone: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const isOchota = locationData.klinika.toLowerCase().includes('pruszkowska');
  const doctor = isOchota 
    ? { name: "lek. dent. Małgorzata Sturska", role: "Specjalista chirurgii", img: "/doctors/sturska.jpg", locName: "Ochota" }
    : { name: "lek. dent. Natalia Kowalczyk-Zuchora", role: "Lekarz dentysta", img: "/doctors/kowalczyk.webp", locName: "Ursynów" };

  const formattedTime = locationData.czas_dojazdu.replace('1 minuta', '1 minutę');
  const locationName = locationData.nazwa_lokalizacji === 'Rakowiec' ? 'Osiedle Rakowiec' : locationData.nazwa_lokalizacji;

  const handleTileSelect = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setTimeout(() => setStep(step + 1), 250);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 9);
    const matched = val.match(/(\d{0,3})(\d{0,3})(\d{0,3})/);
    if (!matched) return;
    const formatted = !matched[2] ? matched[1] : `${matched[1]}-${matched[2]}${matched[3] ? `-${matched[3]}` : ''}`;
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawPhone = formData.phone.replace(/-/g, '');
    if (rawPhone.length !== 9) return alert("Proszę podać poprawny numer (9 cyfr)");
    
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
        }),
      });
      if (res.ok) setStatus('success'); else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1C1E] font-sans antialiased flex flex-col items-center p-4 md:p-8 relative overflow-x-hidden">
      
      {/* Dynamiczny background reagujący na ból */}
      <div className={`fixed top-[-10%] left-[-10%] w-[50%] h-[50%] transition-colors duration-1000 blur-[120px] rounded-full z-0 ${formData.painLevel > 7 && step === 2 ? 'bg-red-100/40' : 'bg-blue-100/20'}`} />

      <main className="relative z-10 w-full max-w-[1140px] mt-12 md:mt-24 text-left mx-auto">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-16 md:gap-24 items-start mb-32">
          
          {/* LEWA KOLUMNA: SEO, Trust & Info */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm text-blue-600 text-[10px] font-black uppercase tracking-widest leading-none">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" /> Bezpieczna Chirurgia {doctor.locName}
              </div>
              
              {/* NOWY H1 - Zoptymalizowany pod Local SEO */}
              <h1 className="text-5xl md:text-[72px] font-black tracking-tight leading-[0.95] text-slate-900">
                Bezbolesne usuwanie ósemek blisko <br />
                <span className="text-blue-600 italic">{locationName}.</span>
              </h1>
              
              <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
                <strong>Bez bólu. Bez stresu.</strong> Dojazd do kliniki na ul. {locationData.klinika} w <strong>{formattedTime}</strong>. 
                Sprawdź w 30 sekund, czy kwalifikujesz się do szybkiej wizyty. RTG wykonujemy na miejscu.
              </p>

              {/* LOKALNE DANE SEO (Data Enrichment) */}
              {(locationData.komunikacja || locationData.parking) && (
                <div className="flex flex-col gap-3 pt-2">
                  {locationData.komunikacja && (
                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-xl w-fit border border-slate-100">
                      <span className="text-blue-500 text-lg">🚌</span> <strong>Dojazd:</strong> {locationData.komunikacja}
                    </div>
                  )}
                  {locationData.parking && (
                    <div className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 px-4 py-2 rounded-xl w-fit border border-slate-100">
                      <span className="text-blue-500 text-lg">🅿️</span> <strong>Parking:</strong> {locationData.parking}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* BIO LEKARZA */}
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-[40px] bg-white border border-slate-100 shadow-lg relative overflow-hidden group">
              <div className="h-24 w-24 rounded-3xl overflow-hidden relative shrink-0 shadow-md ring-4 ring-slate-50 group-hover:scale-105 transition-transform duration-500">
                <Image src={doctor.img} alt={doctor.name} fill className="object-cover" priority />
              </div>
              <div className="relative z-10 text-center md:text-left">
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{doctor.name}</h3>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">{doctor.role}</p>
                <p className="text-slate-500 font-medium leading-relaxed italic text-sm">Lekarz prowadzący w placówce na ul. {locationData.klinika}</p>
              </div>
            </div>

            {/* ZMODYFIKOWANE OPINIE */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <Star /><span className="font-black text-sm text-slate-900 uppercase">4.9/5 Google Maps</span>
                    </div>
                    <div className="hidden md:block h-6 w-px bg-slate-200" />
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                        <span className="text-blue-500 text-sm">🛡️</span>
                        <span className="font-black text-sm text-slate-900 uppercase">Ponad 10 000 bezpiecznie usuniętych ósemek</span>
                    </div>
                    <div className="h-px flex-grow bg-slate-100" />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {locationData.reviews?.slice(0, 2).map((rev: Review, i: number) => (
                    <motion.div key={i} className="p-6 rounded-[24px] bg-white border border-slate-100 shadow-sm relative flex flex-col justify-between">
                        <div>
                            <div className="flex gap-1 mb-3 text-amber-400 scale-75 origin-left">
                                {[...Array(rev.rating || 5)].map((_, s) => <Star key={s} />)}
                            </div>
                            <p className="text-slate-600 font-medium text-sm leading-relaxed mb-4">&quot;{rev.text}&quot;</p>
                        </div>
                        <div className="flex items-center gap-2 mt-auto">
                            <span className="font-black text-slate-400 text-[10px] uppercase tracking-widest">{rev.author}</span>
                        </div>
                    </motion.div>
                    ))}
                </div>
            </div>
          </motion.div>

          {/* PRAWA KOLUMNA: INTERAKTYWNY QUIZ */}
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`${cardStyle} p-8 md:p-12 relative overflow-hidden sticky top-12`}>
            
            {/* Pasek postępu */}
            {status !== 'success' && (
               <div className="mb-10">
                 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                   <span>Krok {step} z 5</span>
                   <span className="text-blue-600">{step * 20}%</span>
                 </div>
                 <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                   <motion.div 
                     className="h-full bg-blue-600" 
                     initial={{ width: 0 }} 
                     animate={{ width: `${step * 20}%` }} 
                     transition={{ duration: 0.5, ease: "easeInOut" }}
                   />
                 </div>
               </div>
            )}

            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl mb-8">✓</div>
                  <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 mb-4">Zgłoszenie w systemie</h2>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {formData.painLevel > 6 
                      ? "Zanotowaliśmy wysoki poziom bólu. Nadaliśmy zgłoszeniu status PILNY. Oczekuj telefonu z rejestracji w ciągu najbliższych minut." 
                      : "Dziękujemy. Przeanalizujemy Twoje odpowiedzi i oddzwonimy z propozycją dogodnego, bezpiecznego terminu."}
                  </p>
                </motion.div>

              ) : step === 1 ? (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Z czym do nas trafiasz?</h2>
                  <div className="space-y-3">
                    <button onClick={() => handleTileSelect('reason', 'Ból / Stan zapalny')} className={`${tileStyle} border-slate-100 group-hover:border-red-200`}>
                      <span className="text-3xl">🦷</span> <span className="font-bold text-slate-700">Boli mnie / Mam opuchliznę</span>
                    </button>
                    <button onClick={() => handleTileSelect('reason', 'Zalecenie ortodonty')} className={`${tileStyle} border-slate-100 group-hover:border-blue-200`}>
                      <span className="text-3xl">📐</span> <span className="font-bold text-slate-700">Skierowanie od ortodonty</span>
                    </button>
                    <button onClick={() => handleTileSelect('reason', 'Konsultacja')} className={`${tileStyle} border-slate-100 group-hover:border-slate-300`}>
                      <span className="text-3xl">❓</span> <span className="font-bold text-slate-700">Chcę tylko skonsultować</span>
                    </button>
                  </div>
                </motion.div>

              ) : step === 2 ? (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Jak oceniasz dyskomfort?</h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">To pomoże nam ustalić priorytet wizyty.</p>
                  </div>
                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">Skala 1-10</span>
                      <span className={`text-6xl font-black transition-colors leading-none ${formData.painLevel > 7 ? 'text-red-500' : 'text-blue-600'}`}>{formData.painLevel}</span>
                    </div>
                    <input type="range" min="1" max="10" step="1" value={formData.painLevel} onChange={(e) => setFormData({...formData, painLevel: parseInt(e.target.value)})} className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>Lekki</span><span className="text-red-400">Pilne!</span>
                    </div>
                  </div>
                  <button onClick={() => setStep(3)} className="w-full bg-[#1A1C1E] text-white font-black py-5 rounded-2xl transition-transform active:scale-95 uppercase tracking-widest text-sm shadow-xl hover:bg-blue-600">Przejdź dalej</button>
                </motion.div>

              ) : step === 3 ? (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Masz aktualne RTG?</h2>
                  <p className="text-slate-500 text-sm font-medium">Zdjęcie (pantomogram) jest wymagane do zabiegu.</p>
                  <div className="space-y-3 pt-4">
                    <button onClick={() => handleTileSelect('hasRTG', 'Tak')} className={`${tileStyle} border-slate-100 group-hover:border-blue-200`}>
                      <span className="text-3xl">📁</span> <span className="font-bold text-slate-700">Tak, mam aktualne zdjęcie</span>
                    </button>
                    <button onClick={() => handleTileSelect('hasRTG', 'Nie, chcę zrobić')} className={`${tileStyle} border-slate-100 group-hover:border-blue-200`}>
                      <span className="text-3xl">📸</span> <span className="font-bold text-slate-700">Nie, zrobicie mi na miejscu</span>
                    </button>
                  </div>
                </motion.div>

              ) : step === 4 ? (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Twoja główna obawa?</h2>
                  <p className="text-slate-500 text-sm font-medium">Chcemy przygotować się do Twojej wizyty.</p>
                  <div className="space-y-3">
                    <button onClick={() => handleTileSelect('biggestFear', 'Ból')} className={`${tileStyle} border-slate-100 group-hover:border-blue-200`}>
                      <span className="text-2xl">💉</span> <span className="font-bold text-slate-700 text-sm">Boję się bólu (Bezbolesne i mocne znieczulenie)</span>
                    </button>
                    <button onClick={() => handleTileSelect('biggestFear', 'Gojenie')} className={`${tileStyle} border-slate-100 group-hover:border-blue-200`}>
                      <span className="text-2xl">⏳</span> <span className="font-bold text-slate-700 text-sm">Czas gojenia i powrót do pracy</span>
                    </button>
                    <button onClick={() => handleTileSelect('biggestFear', 'Koszty')} className={`${tileStyle} border-slate-100 group-hover:border-blue-200`}>
                      <span className="text-2xl">💰</span> <span className="font-bold text-slate-700 text-sm">Koszty (Brak ukrytych opłat, jasny cennik)</span>
                    </button>
                  </div>
                </motion.div>

              ) : (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Świetnie! Twój przypadek kwalifikuje się do bezbolesnego zabiegu.</h2>
                    <p className="text-slate-500 text-sm mt-2 font-medium">Zostaw numer. Nasz koordynator oddzwoni do Ciebie w 15 minut z propozycją najbliższego terminu.</p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <input type="text" aria-label="Imię" required placeholder="Twoje Imię" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputStyle} />
                    <input type="tel" aria-label="Telefon" required placeholder="Telefon (000-000-000)" value={formData.phone} onChange={handlePhoneChange} className={`${inputStyle} font-mono tracking-wider`} />
                    
                    <button type="submit" disabled={status === 'loading'} className="w-full bg-[#1A1C1E] text-white font-black text-lg py-5 mt-4 rounded-2xl transition-all duration-300 hover:bg-blue-600 uppercase tracking-widest shadow-xl active:scale-95">
                       {status === 'loading' ? 'Wysyłanie...' : 'Sprawdź termin'}
                    </button>
                    
                    {/* Trust Badges - Redukcja FUD */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-5 border-t border-slate-100 mt-6">
                      <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="text-blue-500 text-sm">🔒</span> Bezpieczne dane</div>
                      <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="text-blue-500 text-sm">💰</span> Wycena przed zabiegiem</div>
                      <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400"><span className="text-blue-500 text-sm">⏱️</span> Szybkie terminy</div>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Sekcja FAQ */}
        <div className="mb-32 text-left">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-4xl font-black tracking-tight italic uppercase text-slate-900 leading-none">Częste pytania</h2>
            <div className="h-px flex-grow bg-slate-100" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              { q: "Czy usuwanie ósemki boli?", a: "Zabieg jest całkowicie bezbolesny. Stosujemy nowoczesne znieczulenia, które eliminują dyskomfort." },
              { q: "Ile trwa zabieg?", a: "Większość zabiegów usunięcia zębów mądrości trwa u nas od 15 do 40 minut." },
              { q: "Jak przygotować się do wizyty?", a: "Zalecamy zjedzenie lekkiego posiłku. Jeśli nie masz RTG, wykonamy je na miejscu." },
              { q: "Kiedy można wrócić do pracy?", a: "Zazwyczaj już następnego dnia. Przy bardziej złożonych zabiegach zalecamy 2 dni odpoczynku." }
            ].map((faq, i) => (
              <div key={i} className="space-y-4">
                <h3 className="text-lg font-black uppercase tracking-tight text-blue-600">{faq.q}</h3>
                <p className="text-slate-500 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa */}
        <div className="mb-32 text-left">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-black tracking-tight italic uppercase leading-none text-slate-900">Mapa Dojazdu</h2>
            <div className="h-px flex-grow bg-slate-100 rounded-full" />
          </div>
          <div className="w-full h-[500px] rounded-[56px] overflow-hidden border-8 border-white shadow-2xl relative bg-slate-50">
            <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen title={`Mapa dojazdu`} src={`https://maps.google.com/maps?q=${encodeURIComponent('Ochota na Uśmiech Warszawa ' + locationData.klinika)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} />
          </div>
        </div>
      </main>

      <footer className="mt-32 pb-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.6em] opacity-30 text-center">
        © 2026 Ochota na Uśmiech | Designed for Excellence
      </footer>
    </div>
  );
}
