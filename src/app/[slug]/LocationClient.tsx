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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('https://hook.eu1.make.com/k73x9s65dxykfhry5uyodhl6bg2kvkx7', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, slug: locationData.slug, timestamp: new Date().toLocaleString('pl-PL') }),
      });
      if (res.ok) setStatus('success'); else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 md:p-8">
      <main className="max-w-[1240px] mx-auto mt-12">
        <div className="grid lg:grid-cols-[1.2fr,0.8fr] gap-12">
          {/* Lewa kolumna: Nagłówek i Doktor */}
          <div className="space-y-12">
            <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9]">
              Bez bólu.<br/><span className="text-slate-300 italic">Bez stresu.</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-xl">
              Usuwanie ósemek: <strong>{locationData.nazwa_lokalizacji}</strong>. Gabinet <strong>{locationData.klinika}</strong>, blisko {locationData.punkt_orientacyjny}.<br/>
              Dotrzesz do nas w <strong>{locationData.czas_dojazdu}</strong>.
            </p>
            
            <div className="flex items-center gap-6 p-6 bg-white rounded-[40px] shadow-xl border border-slate-50">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-md">
                <Image src={doctor.img} alt={doctor.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-black text-slate-900 uppercase">{doctor.name}</h4>
                <p className="text-blue-600 text-xs font-bold uppercase tracking-widest">{doctor.role}</p>
              </div>
            </div>

            {/* Opinie przy doktorze */}
            <div className="grid md:grid-cols-2 gap-4">
              {locationData.reviews?.slice(0, 2).map((rev: any, i: number) => (
                <div key={i} className="p-6 bg-white rounded-[32px] border border-slate-100 shadow-sm">
                  <div className="flex gap-1 mb-2"><Star/><Star/><Star/><Star/><Star/></div>
                  <p className="text-sm text-slate-500 italic">"{rev.text}"</p>
                  <p className="text-[10px] font-black mt-4 uppercase tracking-widest text-slate-900">{rev.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Prawa kolumna: Formularz */}
          <div className={`${cardStyle} p-10 md:p-14 sticky top-10`}>
             {status === 'success' ? (
               <div className="text-center py-20">
                 <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">✓</div>
                 <h2 className="text-2xl font-black uppercase">Zgłoszenie przyjęte</h2>
                 <p className="text-slate-400 mt-2">Skontaktujemy się tak szybko, jak to możliwe.</p>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-8">
                 <h2 className="text-2xl font-black uppercase tracking-tight">Zarezerwuj termin</h2>
                 <input type="text" placeholder="Imię" required className={inputStyle} onChange={e => setFormData({...formData, name: e.target.value})} />
                 <input type="tel" placeholder="Telefon" required className={inputStyle} onChange={e => setFormData({...formData, phone: e.target.value})} />
                 <div className="space-y-4">
                    <div className="flex justify-between font-black uppercase text-[10px] text-slate-300">
                      <span>Poziom bólu</span>
                      <span className="text-3xl text-blue-600">{formData.painLevel}</span>
                    </div>
                    <input type="range" min="1" max="10" value={formData.painLevel} className="w-full accent-blue-600" onChange={e => setFormData({...formData, painLevel: parseInt(e.target.value)})} />
                 </div>
                 <button className="w-full bg-[#1A1C1E] text-white font-black py-6 rounded-3xl hover:bg-blue-600 transition-all uppercase tracking-widest">Potwierdzam termin</button>
               </form>
             )}
          </div>
        </div>

        {/* FAQ pod spodem */}
        <div className="mt-32 pt-32 border-t border-slate-100">
          <h2 className="text-4xl font-black uppercase italic mb-12 text-slate-900">Częste pytania</h2>
          <div className="grid md:grid-cols-2 gap-12 text-slate-500">
            <div>
              <h4 className="font-black text-blue-600 uppercase mb-2">Czy usuwanie ósemki boli?</h4>
              <p>Nie. Stosujemy nowoczesne znieczulenie miejscowe, które całkowicie eliminuje ból podczas zabiegu.</p>
            </div>
            <div>
              <h4 className="font-black text-blue-600 uppercase mb-2">Ile trwa zabieg?</h4>
              <p>Zazwyczaj od 15 do 40 minut, zależnie od stopnia skomplikowania położenia zęba.</p>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-32 h-[500px] rounded-[48px] overflow-hidden border-8 border-white shadow-2xl">
          <iframe width="100%" height="100%" style={{ border: 0 }} src={`https://www.google.com/maps/embed/v1/place?key=TWOJ_KLUCZ_LUB_FORMAT_BEZ_KLUCZA&q=${encodeURIComponent('Ochota na Uśmiech ' + locationData.klinika)}`} />
        </div>
      </main>
    </div>
  );
}