'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1C1E] font-sans antialiased">
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 blur-[120px] rounded-full z-0" />
      
      <main className="relative z-10 max-w-[1140px] mx-auto pt-24 px-6 md:pt-40">
        <div className="text-center space-y-8 mb-24">
          <h1 className="text-6xl md:text-[100px] font-black tracking-tight leading-[0.85] text-slate-900">
            Ochota na <br />
            <span className="text-slate-300 font-light italic text-[0.9em]">Uśmiech.</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto font-sans">
            Dwa specjalistyczne gabinety w Warszawie. Precyzyjne usuwanie ósemek.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-32">
          {/* OCHOTA */}
          <Link href="/ochota" className="relative group block bg-white p-12 rounded-[48px] border border-slate-100 shadow-xl transition-all hover:scale-[1.02] z-20">
            <div className="space-y-4">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Lokalizacja 01</span>
              <h2 className="text-4xl font-black italic uppercase">Ochota</h2>
              <p className="text-slate-400 font-medium font-sans">ul. Pruszkowska 6b<br />Warszawa Ochota</p>
              <div className="pt-6 font-bold uppercase tracking-widest text-sm text-slate-900">WYBIERZ LOKALIZACJĘ →</div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] group-hover:w-40 transition-all z-[-1]" />
          </Link>

          {/* URSYNÓW */}
          <Link href="/ursynow" className="relative group block bg-[#1A1C1E] p-12 rounded-[48px] shadow-2xl transition-all hover:scale-[1.02] z-20 text-white">
            <div className="space-y-4">
              <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Lokalizacja 02</span>
              <h2 className="text-4xl font-black italic uppercase">Ursynów</h2>
              <p className="text-slate-500 font-medium font-sans">al. KEN 96<br />Warszawa Ursynów</p>
              <div className="pt-6 font-bold uppercase tracking-widest text-sm">WYBIERZ LOKALIZACJĘ →</div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] group-hover:w-40 transition-all z-[-1]" />
          </Link>
        </div>
      </main>
    </div>
  );
}