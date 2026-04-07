'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const cardStyle = "bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[48px]";
const inputStyle = "w-full bg-slate-100/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-5 rounded-3xl outline-none transition-all duration-300 text-lg placeholder:text-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]";

const Star = () => <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;

export default function LocationClient({ locationData }: { locationData: any }) {
  const [formData, setFormData] = useState({ name: '', phone: '', painLevel: 5 });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const isOchota = locationData.klinika.toLowerCase().includes('pruszkowska');
  const doctor = isOchota 
    ? { name: "lek. dent. Małgorzata Sturska", role: "Specjalista chirurgii szczękowo-twarzowej", img: "/doctors/sturska.jpg", locName: "Ochota" }
    : { name: "lek. dent. Natalia Kowalczyk-Zuchora", role: "Lekarz dentysta", img: "/doctors/kowalczyk.webp", locName: "Ursynów" };

  const formattedTime = locationData.czas_dojazdu.replace('1 minuta', '1 minutę');
  const locationName = locationData.nazwa_lokalizacji === 'Rakowiec' ? 'Osiedle Rakowiec' : locationData.nazwa_lokalizacji;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 9);
    const matched = val.match(/(\d{0,3})(\d{0,3})(\d{0,3})/);
    if (!matched) return;
    const formatted = !matched[2] ? matched[1] : `${matched[1]}-${matched[2]}${matched[3] ? `-${matched[3]}` : ''}`;
    setFormData({ ...formData, phone: formatted });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
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
          timestamp: new Date().toLocaleString('pl-PL'),
        }),
      });
      if (res.ok) setStatus('success'); else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1C1E] font-sans antialiased flex flex-col items-center p-4 md:p-8 relative overflow-x-hidden">
      
      <div className={`fixed top-[-10%] left-[-10%] w-[50%] h-[50%] transition-colors duration-1000 blur-[120px] rounded-full z-0 ${formData.painLevel > 7 ? 'bg-red-100/30' : 'bg-blue-100/20'}`} />

      <main className="relative z-10 w-full max-w-[1240px] mt-12 md:mt-24 text-left">
        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-16 md:gap-24 items-start mb-24">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm text-blue-600 text-[10px] font-black uppercase tracking-widest leading-none">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" /> Ekspert Chirurgii Warszawskiej
              </div>
              <h1 className="text-6xl md:text-[88px] font-black tracking-tight leading-[0.9] text-slate-900">
                Bez bólu. <br />
                <span className="text-slate-300 font-light italic text-[0.9em]">Bez stresu.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-xl">
                Profesjonalne usuwanie ósemek. Lokalizacja: <strong>{locationName}</strong>. Zapraszamy do gabinetu przy <strong>ul. {locationData.klinika}</strong>, blisko <strong>{locationData.punkt_orientacyjny}</strong>. <br />
                Dotrzesz do nas w <strong>{formattedTime}</strong>.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-[40px] bg-white border border-slate-100 shadow-xl relative overflow-hidden group">
              <div className="h-24 w-24 rounded-3xl overflow-hidden relative shrink-0 shadow-lg ring-4 ring-slate-50">
                <Image src={doctor.img} alt={doctor.name} fill className="object-cover" />
              </div>
              <div className="relative z-10 text-center md:text-left">
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{doctor.name}</h4>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">{doctor.role}</p>
                <p className="text-slate-400 font-medium leading-relaxed italic text-sm">Twój lekarz prowadzący w lokalizacji {doctor.locName}.</p>
              </div>
            </div>

            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-100">
                        <Star /><span className="font-black text-sm text-blue-700 underline tracking-tighter uppercase">4.9/5 Google Maps</span>
                    </div>
                    <div className="h-px flex-grow bg-slate-100" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Certyfikowana Klinika</span>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    {locationData.reviews?.slice(0, 2).map((rev: any, i: number) => (
                    <motion.div key={i} className="p-6 rounded-[32px] bg-white border border-slate-50 shadow-sm relative">
                        <div className="flex gap-1 mb-3 text-amber-400 scale-75 origin-left">
                            {[...Array(5)].map((_, s) => <Star key={s} />)}
                        </div>
                        <p className="text-slate-500 italic text-sm leading-relaxed mb-4">"{rev.text}"</p>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-black text-[8px]">{rev.author[0]}</div>
                            <span className="font-black text-slate-900 text-[10px] uppercase tracking-widest">{rev.author}</span>
                        </div>
                    </motion.div>
                    ))}
                </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`${cardStyle} p-10 md:p-14 sticky top-12`}>
            {status === 'success' ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-3xl mb-8">✓</div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900 leading-tight">Zgłoszenie przyjęte</h2>
                <p className="text-slate-500 mt-4 leading-relaxed">
                  Dziękujemy za kontakt. Skontaktujemy się z Tobą jak najszybciej w celu ustalenia terminu wizyty.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="text-left leading-tight">
                  <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900">Zarezerwuj termin</h2>
                  <p className="text-slate-400 text-sm mt-2 font-medium">Oddzwonimy z najszybszą godziną wizyty.</p>
                </div>
                <div className="space-y-6">
                  <input type="text" required placeholder="Imię" value={formData.name} onChange={handleNameChange} className={inputStyle} />
                  <input type="tel" required placeholder="Telefon (000-000-000)" value={formData.phone} onChange={handlePhoneChange} className={`${inputStyle} font-mono tracking-wider`} />
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1 block leading-none">Poziom bólu</label>
                      <span className={`text-5xl font-black transition-colors leading-none ${formData.painLevel > 7 ? 'text-red-500' : 'text-blue-600'}`}>{formData.painLevel}</span>
                    </div>
                    <input type="range" min="1" max="10" step="1" value={formData.painLevel} onChange={(e) => setFormData({...formData, painLevel: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                </div>
                <button type="submit" disabled={status === 'loading'} className="w-full bg-[#1A1C1E] text-white font-black text-lg py-6 rounded-3xl transition-all duration-300 hover:bg-blue-600 uppercase tracking-widest shadow-2xl active:scale-95">
                   {status === 'loading' ? 'Wysyłanie...' : 'Potwierdzam termin'}
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* SEKCJA FAQ */}
        <div className="mb-32 text-left">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-4xl font-black tracking-tight italic uppercase text-slate-900 leading-none">Częste pytania</h2>
            <div className="h-px flex-grow bg-slate-100" />
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                q: "Czy usuwanie ósemki boli?",
                a: "Zabieg jest całkowicie bezbolesny. Stosujemy nowoczesne znieczulenia miejscowe, które skutecznie eliminują jakikolwiek dyskomfort podczas ekstrakcji."
              },
              {
                q: "Ile trwa zabieg?",
                a: "Większość zabiegów usunięcia zębów mądrości w naszych gabinetach trwa od 15 do 40 minut, zależnie od stopnia skomplikowania przypadku."
              },
              {
                q: "Jak przygotować się do wizyty?",
                a: "Zalecamy zjedzenie lekkiego posiłku oraz zabranie aktualnego zdjęcia panoramicznego. Jeśli go nie posiadasz, wykonamy diagnostykę RTG na miejscu."
              },
              {
                q: "Kiedy można wrócić do pracy?",
                a: "Zazwyczaj pacjenci wracają do codziennych aktywności już następnego dnia. Przy bardziej złożonych zabiegach zalecamy 2-3 dni odpoczynku."
              }
            ].map((faq, i) => (
              <div key={i} className="space-y-4">
                <h4 className="text-lg font-black uppercase tracking-tight text-blue-600">{faq.q}</h4>
                <p className="text-slate-500 leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-32 text-left">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl font-black tracking-tight italic uppercase leading-none text-slate-900">Mapa Dojazdu</h2>
            <div className="h-px flex-grow bg-slate-100 rounded-full" />
          </div>
          <div className="w-full h-[500px] rounded-[56px] overflow-hidden border-8 border-white shadow-2xl relative bg-slate-100">
            <iframe 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                loading="lazy" 
                allowFullScreen 
                src={`https://maps.google.com/maps?q=${encodeURIComponent('Ochota na Uśmiech ' + locationData.klinika + ' Warszawa')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            />
          </div>
        </div>
      </main>

      <footer className="mt-32 pb-12 text-slate-300 text-[10px] font-black uppercase tracking-[0.6em] opacity-30 text-center">
        © 2026 Ochota na Uśmiech | Designed for Excellence
      </footer>
    </div>
  );
}