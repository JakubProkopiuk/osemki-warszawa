'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, MapPin, Search } from 'lucide-react';
import locations from '../data/locations.json';

type LocationItem = {
  slug: string;
  nazwa_lokalizacji: string;
  klinika: string;
};

export default function HomePage() {
  const allLocations = locations as LocationItem[];
  const ochotaLocations = allLocations.filter((loc) => loc.klinika.includes('Pruszkowska'));
  const ursynowLocations = allLocations.filter((loc) => loc.klinika.includes('KEN'));

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1C1E] font-sans antialiased">
      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-amber-100/20 blur-[120px] rounded-full z-0" />
      
      <main className="relative z-10 max-w-[1140px] mx-auto pt-24 px-6 md:pt-40">
        <div className="text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm text-amber-500 text-xs font-bold uppercase tracking-widest leading-none mx-auto">
            <MapPin className="w-3.5 h-3.5" />
            Warszawskie Centrum Chirurgii Ósemek
          </div>
          
          <h1 className="text-6xl md:text-[100px] font-black tracking-tight leading-[0.85] text-slate-900">
            Ochota na <br />
            <span className="text-slate-300 font-light italic text-[0.9em]">Uśmiech.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto">
            Dwa specjalistyczne gabinety w Warszawie. <br /> 
            Precyzyjne usuwanie ósemek przez doświadczonych chirurgów.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-32">
          <Link href="/ochota" className="group relative block overflow-hidden bg-white p-12 rounded-[48px] border border-slate-100 shadow-xl transition-all duration-500 hover:scale-[1.02] z-20 cursor-pointer">
            <div className="relative z-10 space-y-4">
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Lokalizacja 01</span>
              <h2 className="text-4xl font-black italic uppercase text-slate-900">Ochota</h2>
              <p className="text-slate-400 font-medium leading-relaxed">ul. Pruszkowska 6b<br />Warszawa Ochota</p>
              <div className="pt-6 flex items-center gap-2 text-slate-900 font-bold uppercase tracking-widest text-sm">
                Wybierz lokalizację <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/30 rounded-bl-[100px] transition-all group-hover:w-40 group-hover:h-40 z-0" />
          </Link>

          <Link href="/ursynow" className="group relative block overflow-hidden bg-slate-900 p-12 rounded-[48px] shadow-2xl transition-all duration-500 hover:scale-[1.02] z-20 cursor-pointer">
            <div className="relative z-10 space-y-4">
              <span className="text-amber-500 font-bold uppercase tracking-widest text-xs">Lokalizacja 02</span>
              <h2 className="text-4xl font-black italic uppercase text-white">Ursynów</h2>
              <p className="text-slate-500 font-medium text-white/60 leading-relaxed">al. KEN 96<br />Warszawa Ursynów</p>
              <div className="pt-6 flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm">
                Wybierz lokalizację <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] transition-all group-hover:w-40 group-hover:h-40 z-0" />
          </Link>
        </div>

        <div className="mb-32 text-left px-2">
          <div className="flex items-center gap-4 mb-16">
            <h2 className="text-4xl font-black tracking-tight italic uppercase text-slate-900">Nasi Eksperci</h2>
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
                img: "/doctors/kowalczyk.webp"
              }
            ].map((doc, i) => (
              <div key={i} className="group p-8 rounded-[40px] bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="relative w-24 h-24 rounded-3xl overflow-hidden mb-6 bg-slate-50 ring-4 ring-white group-hover:scale-105 transition-transform duration-500">
                   <Image 
                    src={doc.img} 
                    alt={doc.name} 
                    fill 
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                    loading="lazy"
                   />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-1">{doc.name}</h3>
                <p className="text-amber-600 font-bold text-xs uppercase tracking-widest mb-4">{doc.role}</p>
                <p className="text-slate-400 font-medium leading-relaxed text-sm">{doc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 pb-24 border-t border-slate-100 pt-24 text-center">
          <div>
            <h3 className="font-black text-4xl mb-2 text-slate-900">15 min</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Średni czas zabiegu</p>
          </div>
          <div>
            <h3 className="font-black text-4xl mb-2 text-slate-900">100%</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Bezbolesne metody</p>
          </div>
          <div>
            <h3 className="font-black text-4xl mb-2 text-slate-900">RTG / Tomograf</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Pełna diagnostyka na miejscu</p>
          </div>
        </div>

        <div className="mb-24">
          <div className="flex items-center gap-3 mb-10">
            <Search className="w-6 h-6 text-amber-500" />
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Obsługiwane Lokalizacje</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Wybierz gabinet: Ochota (ul. Pruszkowska)</h3>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-1 pr-2">
                {ochotaLocations.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/${loc.slug}`}
                    className="block text-sm text-slate-500 hover:text-amber-600 transition-colors"
                  >
                    {`Usuwanie ósemek ${loc.nazwa_lokalizacji}`}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Wybierz gabinet: Ursynów (al. KEN)</h3>
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-1 pr-2">
                {ursynowLocations.map((loc) => (
                  <Link
                    key={loc.slug}
                    href={`/${loc.slug}`}
                    className="block text-sm text-slate-500 hover:text-amber-600 transition-colors"
                  >
                    {`Usuwanie ósemek ${loc.nazwa_lokalizacji}`}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 text-center text-slate-300 text-[10px] font-bold uppercase tracking-[0.5em] opacity-50">
        © 2026 Ochota na Uśmiech | Designed for Excellence
      </footer>
    </div>
  );
}
