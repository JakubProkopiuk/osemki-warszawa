'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1C1E] font-sans antialiased">
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 blur-[120px] rounded-full z-0" />
      
      <main className="relative z-10 max-w-[1140px] mx-auto pt-24 px-6 md:pt-40">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm text-blue-600 text-xs font-bold uppercase tracking-widest leading-none mx-auto">
            Warszawskie Centrum Chirurgii Ósemek
          </div>
          
          <h1 className="text-6xl md:text-[100px] font-black tracking-tight leading-[0.85] text-slate-900">
            Ochota na <br />
            <span className="text-slate-300 font-light italic">Uśmiech.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Dwa specjalistyczne gabinety w Warszawie. <br /> 
            Precyzyjne usuwanie ósemek przez doświadczonych chirurgów.
          </p>
        </div>

        {/* LOKALIZACJE */}
        <div className="grid md:grid-cols-2 gap-8 mb-32">
          <Link href="/rakowiec" className="group relative overflow-hidden bg-white p-12 rounded-[48px] border border-slate-100 shadow-xl transition-all duration-500 hover:scale-[1.02]">
            <div className="relative z-10 space-y-4">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Lokalizacja 01</span>
              <h2 className="text-4xl font-black italic uppercase">Ochota</h2>
              <p className="text-slate-400 font-medium">ul. Pruszkowska 6b<br />Warszawa Ochota</p>
              <div className="pt-6 flex items-center gap-2 text-slate-900 font-bold uppercase tracking-widest text-sm">
                Wybierz lokalizację <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] transition-all group-hover:w-40 group-hover:h-40" />
          </Link>

          <Link href="/metro-imielin" className="group relative overflow-hidden bg-[#1A1C1E] p-12 rounded-[48px] shadow-2xl transition-all duration-500 hover:scale-[1.02]">
            <div className="relative z-10 space-y-4">
              <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Lokalizacja 02</span>
              <h2 className="text-4xl font-black italic uppercase text-white">Ursynów</h2>
              <p className="text-slate-500 font-medium text-white/60">al. KEN 96<br />Warszawa Ursynów</p>
              <div className="pt-6 flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm">
                Wybierz lokalizację <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] transition-all group-hover:w-40 group-hover:h-40" />
          </Link>
        </div>

        {/* SEKCCJA: NASI EKSPERCI */}
        <div className="mb-32 text-left px-2">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-4xl font-black tracking-tight italic uppercase">Nasi Eksperci</h2>
            <div className="h-[2px] flex-grow bg-slate-100 rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            {[
              {
                name: "lek. dent. Małgorzata Sturska",
                role: "Specjalista chirurgii szczękowo-twarzowej",
                desc: "Odpowiada za zabiegi chirurgiczne w gabinecie na Ochocie. Ekspertka w dziedzinie bezbolesnego usuwania ósemek.",
                img: "/doctors/sturska.jpg"
              },
              {
                name: "lek. dent. Natalia Kowalczyk-Zuchora",
                role: "Lekarz dentysta",
                desc: "Zapewnia profesjonalną opiekę stomatologiczną w gabinecie na Ursynowie, dbając o komfort i bezpieczeństwo pacjentów.",
                img: "/doctors/Natalia_Kowalczyk-Zuchora-zdjecie.webp"
              }
            ].map((doc, i) => (
              <div key={i} className="group p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="relative w-24 h-24 rounded-3xl overflow-hidden mb-6 bg-slate-50 ring-4 ring-white group-hover:scale-105 transition-transform duration-500">
                   <Image 
                    src={doc.img} 
                    alt={doc.name} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                   />
                   <div className="absolute inset-0 flex items-center justify-center text-slate-200 font-bold text-xs uppercase tracking-tighter">Dr</div>
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-1">{doc.name}</h3>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">{doc.role}</p>
                <p className="text-slate-400 font-medium leading-relaxed text-sm">{doc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 pb-24 border-t border-slate-100 pt-24 text-center">
          <div>
            <h3 className="font-black text-4xl mb-2">15 min</h3>
            <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Średni czas zabiegu</p>
          </div>
          <div>
            <h3 className="font-black text-4xl mb-2">100%</h3>
            <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Bezbolesne metody</p>
          </div>
          <div>
            <h3 className="font-black text-4xl mb-2">RTG / Tomograf</h3>
            <p className="text-slate-400 font-medium uppercase tracking-widest text-xs">Pełna diagnostyka na miejscu</p>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-slate-300 text-[10px] font-bold uppercase tracking-[0.5em] opacity-50">
        © 2026 Ochota na Uśmiech | Designed for Excellence
      </footer>
    </div>
  );
}