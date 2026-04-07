'use client';

import { useState } from 'react';
import Image from 'next/image';

const cardStyle = "bg-white/[0.85] backdrop-blur-2xl border border-white shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] rounded-[48px]";
const inputStyle = "w-full bg-slate-100/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-5 rounded-3xl outline-none transition-all duration-300 text-lg placeholder:text-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]";

const IconVerify = () => <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default function LocationClient({ locationData }: { locationData: any }) {
  const [formData, setFormData] = useState({ name: '', phone: '', painLevel: 5 });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // LOGIKA PRZYPISANIA LEKARZA DO LOKALIZACJI
  const isOchota = locationData.klinika.toLowerCase().includes('pruszkowska');
  
  const doctor = isOchota 
    ? { 
        name: "lek. dent. Małgorzata Sturska", 
        role: "Specjalista chirurgii szczękowo-twarzowej", 
        img: "/doctors/sturska.jpg" 
      }
    : { 
        name: "lek. dent. Natalia Kowalczyk-Zuchora", 
        role: "Lekarz dentysta", 
        img: "/doctors/kowalczyk.webp" 
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
        body: JSON.stringify({ ...formData, phone: rawPhone, slug: locationData.slug, locationName: locationData.nazwa_lokalizacji }),
      });
      if (res.ok) setStatus('success'); else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1C1E] font-sans antialiased flex flex-col items-center p-4 md:p-8 relative overflow-x-hidden">
      <div className={`fixed top-[-10%] left-[-10%] w-[50%] h-[50%] transition-colors duration-700 blur-[120px] rounded-full z-0 ${formData.painLevel > 7 ? 'bg-red-100/40' : 'bg-blue-100/30'}`} />

      <main className="relative z-10 w-full max-w-[1140px] mt-12 md:mt-24 text-left">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-16 md:gap-24 items-center mb-32">
          
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm text-slate-500 text-xs font-bold uppercase tracking-widest leading-none">
                <IconVerify /> Ochota na Uśmiech | Warszawa
              </div>
              <h1 className="text-6xl md:text-[92px] font-black tracking-tight leading-[0.88] text-slate-900">
                Bez bólu. <br />
                <span className="text-slate-300 font-light italic">Bez stresu.</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-lg">
                Profesjonalne usuwanie ósemek. Lokalizacja: <strong>{locationData.nazwa_lokalizacji === 'Rakowiec' ? 'Osiedle Rakowiec' : locationData.nazwa_lokalizacji}</strong>. 
                Nasz gabinet znajduje się przy <strong>ul. {locationData.klinika}</strong>, dojedziesz do nas w <strong>{locationData.czas_dojazdu}</strong>.
              </p>
            </div>

            {/* KARTA LEKARZA DOPASOWANA DO GABINETU */}
            <div className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-[40px] bg-white border border-slate-100 shadow-xl transition-all hover:shadow-2xl duration-500">
              <div className="h-24 w-24 rounded-3xl overflow-hidden relative shrink-0 shadow-lg ring-4 ring-slate-50 bg-slate-50">
                <Image 
                  src={doctor.img} 
                  alt={doctor.name} 
                  fill 
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">{doctor.name}</h4>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-2">{doctor.role}</p>
                <p className="text-slate-400 font-medium leading-relaxed italic text-sm">
                  Twój chirurg w lokalizacji {isOchota ? 'Ochota' : 'Ursynów'}.
                </p>
              </div>
            </div>
          </div>

          <div className={`${cardStyle} p-10 md:p-14 transition-transform duration-500 hover:scale-[1.01] w-full`}>
            {status === 'success' ? (
              <div className="text-center py-20 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl shadow-2xl shadow-blue-200 mb-8 font-bold">✓</div>
                <h2 className="text-4xl font-bold tracking-tight text-slate-900">Zgłoszenie przyjęte</h2>
                <p className="text-slate-500 text-lg leading-relaxed mt-4">Nasz chirurg dyżurny oddzwoni w ciągu kilku minut.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="text-left leading-tight">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900">Zarezerwuj termin</h2>
                  <p className="text-slate-400 text-sm font-medium mt-1">Wybierzemy najszybszą godzinę wizyty</p>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1 block">Twoje Imię</label>
                    <input type="text" required placeholder="np. Marek" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputStyle} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1 block">Telefon</label>
                    <input type="tel" required placeholder="000-000-000" value={formData.phone} onChange={handlePhoneChange} className={`${inputStyle} font-mono tracking-widest`} />
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1 block">Poziom bólu (1-10)</label>
                      <span className={`text-5xl font-black transition-colors duration-500 ${formData.painLevel > 7 ? 'text-red-500' : 'text-blue-600'}`}>{formData.painLevel}</span>
                    </div>
                    <input type="range" min="1" max="10" step="1" value={formData.painLevel} onChange={(e) => setFormData({...formData, painLevel: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                </div>
                <button type="submit" disabled={status === 'loading'} className="relative overflow-hidden w-full bg-[#1A1C1E] text-white font-bold text-xl py-6 rounded-3xl transition-all duration-500 hover:bg-blue-600 shadow-2xl active:scale-[0.98] group">
                   <span className="relative z-10 uppercase tracking-[0.2em]">{status === 'loading' ? 'Wysyłanie...' : 'Potwierdzam zgłoszenie'}</span>
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mb-32 text-left">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-4xl font-black tracking-tight italic uppercase">Jak dojechać</h2>
            <div className="h-[2px] flex-grow bg-slate-100 rounded-full" />
          </div>
          <div className="w-full h-[450px] rounded-[56px] overflow-hidden border-4 border-white shadow-[0_32px_80px_-20px_rgba(0,0,0,0.1)] relative bg-slate-50">
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${encodeURIComponent('Ochota na Uśmiech ' + locationData.klinika + ' Warszawa')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
            ></iframe>
          </div>
        </div>
      </main>

      <footer className="mt-20 pb-12 text-slate-300 text-[10px] font-bold uppercase tracking-[0.5em] opacity-50 text-center">
        © 2026 Ochota na Uśmiech | Designed for Excellence
      </footer>
    </div>
  );
}