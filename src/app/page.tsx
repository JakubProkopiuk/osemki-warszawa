'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1C1E] font-sans antialiased">
      {/* JSON-LD dla Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Dentist",
          "name": "Ochota na Uśmiech",
          "image": "https://www.osemki-warszawa.pl/logo.png",
          "telephone": "+48794766575",
          "url": "https://www.osemki-warszawa.pl",
          "address": [
            { "@type": "PostalAddress", "streetAddress": "ul. Pruszkowska 6b", "addressLocality": "Warszawa" },
            { "@type": "PostalAddress", "streetAddress": "al. KEN 96", "addressLocality": "Warszawa" }
          ],
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.9", "reviewCount": "347" }
        })}}
      />

      {/* Pływający przycisk dzwonienia (Mobile) */}
      <a href="tel:+48794766575" className="md:hidden fixed bottom-6 right-6 z-[100] bg-blue-600 text-white p-4 rounded-full shadow-2xl active:scale-90 transition-transform">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      </a>

      <div className="fixed top-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-50/50 blur-[120px] rounded-full z-0" />
      
      <main className="relative z-10 max-w-[1140px] mx-auto pt-24 px-6 md:pt-40">
        
        <div className="text-center space-y-8 mb-24">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white border border-slate-100 shadow-sm text-blue-600 text-xs font-bold uppercase tracking-widest leading-none mx-auto">
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
          {/* LOKALIZACJA 01 */}
          <Link href="/ochota" className="group relative block overflow-hidden bg-white p-12 rounded-[48px] border border-slate-100 shadow-xl transition-all duration-500 hover:scale-[1.02] z-20 cursor-pointer">
            <div className="relative z-10 space-y-4">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">Lokalizacja 01</span>
              <h2 className="text-4xl font-black italic uppercase text-slate-900">Ochota</h2>
              <p className="text-slate-400 font-medium leading-relaxed">ul. Pruszkowska 6b<br />Warszawa Ochota</p>
              <div className="pt-6 flex items-center gap-2 text-slate-900 font-bold uppercase tracking-widest text-sm">
                WYBIERZ LOKALIZACJĘ →
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] transition-all group-hover:w-40 group-hover:h-40 z-0" />
          </Link>

          {/* LOKALIZACJA 02 */}
          <Link href="/ursynow" className="group relative block overflow-hidden bg-[#1A1C1E] p-12 rounded-[48px] shadow-2xl transition-all duration-500 hover:scale-[1.02] z-20 cursor-pointer text-white">
            <div className="relative z-10 space-y-4">
              <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Lokalizacja 02</span>
              <h2 className="text-4xl font-black italic uppercase text-white">Ursynów</h2>
              <p className="text-slate-500 font-medium text-white/60 leading-relaxed">al. KEN 96<br />Warszawa Ursynów</p>
              <div className="pt-6 flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm">
                WYBIERZ LOKALIZACJĘ →
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] transition-all group-hover:w-40 group-hover:h-40 z-0" />
          </Link>
        </div>

        {/* EKSPERCI - PRZYWRÓCONI */}
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
                <div className="relative w-24 h-24 rounded-3xl overflow-hidden mb-6 bg-slate-50 ring-4 ring-white">
                   <Image src={doc.img} alt={doc.name} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700" priority />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-1">{doc.name}</h3>
                <p className="text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">{doc.role}</p>
                <p className="text-slate-400 font-medium leading-relaxed text-sm">{doc.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* STATYSTYKI - PRZYWRÓCONE */}
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
      </main>

      <footer className="py-12 text-center text-slate-300 text-[10px] font-bold uppercase tracking-[0.5em] opacity-50">
        © 2026 Ochota na Uśmiech | Designed for Excellence
      </footer>
    </div>
  );
}