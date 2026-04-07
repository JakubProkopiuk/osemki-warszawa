'use client';

import { useState } from 'react';

// --- STYLING HELPERS ---
const cardStyle = "bg-white/[0.85] backdrop-blur-2xl border border-white shadow-[0_32px_80px_-20px_rgba(0,0,0,0.08)] rounded-[48px]";
const inputStyle = "w-full bg-slate-100/50 border-2 border-transparent focus:border-blue-500/20 focus:bg-white p-5 rounded-3xl outline-none transition-all duration-300 text-lg placeholder:text-slate-400 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]";

// --- ICONS ---
const IconVerify = () => <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const StarIcon = () => <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>;

export default function LocationClient({ locationData }: { locationData: any }) {
  const [formData, setFormData] = useState({ name: '', phone: '', painLevel: 5 });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

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
          locationName: locationData.nazwa_lokalizacji,
          timestamp: new Date().toLocaleString('pl-PL')
        }),
      });
      if (res.ok) setStatus('success'); else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1C1E] font-sans antialiased flex flex-col items-center p-4 md:p-8 relative overflow-x-hidden">
      
      {/* Dynamiczne Tło reagujące na ból */}
      <div className={`fixed top-[-10%] left-[-10%] w-[50%] h-[50%] transition-colors duration-700 blur-[120px] rounded-full z-0 ${formData.painLevel > 7 ? 'bg-red-100/40' : 'bg-blue-100/30'}`} />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-50/40 blur-[120px] rounded-full z-0" />

      <main className="relative z-10 w-full max-w-[1140px] mt-12 md:mt-24 text-left text-left">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-16 md:gap-24 items-center mb-32">
          
          {/* SEKCCJA HERO */}
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm text-slate-500 text-xs font-bold uppercase tracking-widest leading-none">
                <IconVerify /> Ochota na Uśmiech | Warszawa {locationData.nazwa_lokalizacji}
              </div>
              <h1 className="text-6xl md:text-[92px] font-black tracking-tight leading-[0.88] text-slate-900 text-left">
                Bez bólu. <br />
                <span className="text-slate-300 font-light italic text-left">Bez stresu.</span>
              </h1>
              {/* POPRAWIONY FRAGMENT HERO */}
              <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-lg text-left">
                Profesjonalne usuwanie ósemek. Lokalizacja: {locationData.nazwa_lokalizacji}. 
                Nasz gabinet znajduje się przy <strong>ul. {locationData.klinika}</strong>, dojedziesz do nas w <strong>{locationData.czas_dojazdu}</strong>.
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex -space-x-3 overflow-hidden">
                {[1, 2, 3].map(i => <img key={i} className="inline-block h-12 w-12 rounded-full ring-4 ring-[#FDFDFD]" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />)}
              </div>
              <div className="text-sm font-medium pt-1 text-left">
                <span className="block font-bold text-slate-900 leading-tight">Doświadczony zespół</span>
                <span className="text-slate-400 italic">Chirurgia Stomatologiczna</span>
              </div>
            </div>
          </div>

          {/* FORMULARZ KONWERSJI */}
          <div className={`${cardStyle} p-10 md:p-14 transition-transform duration-500 hover:scale-[1.01]`}>
            {status === 'success' ? (
              <div className="text-center py-20 animate-in zoom-in duration-500">
                <div className="w-24 h-24 bg-blue-600 rounded-full mx-auto flex items-center justify-center text-white text-4xl shadow-2xl shadow-blue-200 mb-8 font-bold">✓</div>
                <h2 className="text-4xl font-bold tracking-tight text-slate-900">Zgłoszenie przyjęte</h2>
                <p className="text-slate-500 text-lg leading-relaxed mt-4">Nasz chirurg dyżurny oddzwoni w ciągu kilku minut.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="text-left leading-tight text-left">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 text-left">Zarezerwuj termin</h2>
                  <p className="text-slate-400 text-sm font-medium mt-1 text-left">Wybierzemy najszybszą godzinę wizyty</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1 block text-left">Twoje Imię</label>
                    <input type="text" required placeholder="np. Marek" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={inputStyle} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1 block text-left">Telefon</label>
                    <input type="tel" required placeholder="000-000-000" value={formData.phone} onChange={handlePhoneChange} className={`${inputStyle} font-mono tracking-widest`} />
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-300 ml-1 block text-left">Poziom bólu (1-10)</label>
                      <span className={`text-5xl font-black transition-colors duration-500 ${formData.painLevel > 7 ? 'text-red-500' : 'text-blue-600'}`}>{formData.painLevel}</span>
                    </div>
                    <input type="range" min="1" max="10" step="1" value={formData.painLevel} onChange={(e) => setFormData({...formData, painLevel: parseInt(e.target.value)})} className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600" />
                  </div>
                </div>

                <button type="submit" disabled={status === 'loading'} className="relative overflow-hidden w-full bg-[#1A1C1E] text-white font-bold text-xl py-6 rounded-3xl transition-all duration-500 hover:bg-blue-600 shadow-2xl active:scale-[0.98] group">
                   <span className="relative z-10 uppercase tracking-[0.2em]">{status === 'loading' ? 'Wysyłanie...' : 'Potwierdzam zgłoszenie'}</span>
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* OPINIE PACJENTÓW */}
        <div className="mb-32 text-left">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-4xl font-black tracking-tight italic uppercase text-left">Opinie pacjentów</h2>
            <div className="h-[px] flex-grow bg-slate-100 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            {[ 
              { name: "Aleksandra", text: "Profesjonalizm na każdym kroku. Dr Kisiel to chirurg z powołania, uratował mnie przed weekendem z bólem." }, 
              { name: "Michał B.", text: "Nowoczesne podejście, zero stresu. Nie sądziłem, że usuwanie ósemki może odbyć się w tak przyjaznej atmosferze." }
            ].map((rev, i) => (
              <div key={i} className="p-10 rounded-[40px] bg-white border border-slate-50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-500 group text-left">
                <div className="flex gap-1 mb-6 opacity-40 group-hover:opacity-100 transition-opacity">{[...Array(5)].map((_, i) => <StarIcon key={i} />)}</div>
                <p className="text-slate-600 text-xl leading-relaxed italic mb-8 font-medium italic">"{rev.text}"</p>
                <p className="text-slate-900 font-black text-xs uppercase tracking-[0.3em]">— {rev.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* SEKCCJA FAQ */}
        <div className="mb-32 relative overflow-hidden p-12 md:p-20 rounded-[56px] bg-[#1A1C1E] text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] text-left">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full" />
          <h2 className="text-4xl font-black mb-16 tracking-tight relative z-10 italic underline underline-offset-8 decoration-blue-600 uppercase text-left">Częste pytania</h2>
          <div className="grid md:grid-cols-2 gap-16 relative z-10 text-left">
            <div className="space-y-4 text-left">
              <h3 className="text-xl font-bold text-blue-400 tracking-tight text-left">Czy zabieg jest bolesny?</h3>
              <p className="text-slate-400 text-lg leading-relaxed text-left">Dzięki nowoczesnemu znieczuleniu miejscowemu zabieg jest całkowicie bezbolesny. Po usunięciu ósemki otrzymasz od nas pełną instrukcję postępowania.</p>
            </div>
            <div className="space-y-4 text-left text-left">
              <h3 className="text-xl font-bold text-blue-400 tracking-tight text-left">Czy muszę mieć zdjęcie?</h3>
              {/* POPRAWIONY FRAGMENT FAQ */}
              <p className="text-slate-400 text-lg leading-relaxed text-left">
                Nie, wszystko zrobimy na miejscu. Posiadamy nowoczesną pracownię radiologiczną bezpośrednio w gabinecie przy <strong>ul. {locationData.klinika}</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-20 pb-12 text-slate-300 text-[10px] font-bold uppercase tracking-[0.5em] opacity-50">
        © 2026 Ochota na Uśmiech | Designed for Excellence
      </footer>

      <style jsx global>{`
        @keyframes shimmer { 100% { transform: translateX(100%); } }
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: #2563eb;
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 8px 20px rgba(37,99,235,0.3);
          cursor: pointer;
          transition: transform 0.2s;
        }
        input[type='range']::-webkit-slider-thumb:active {
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}