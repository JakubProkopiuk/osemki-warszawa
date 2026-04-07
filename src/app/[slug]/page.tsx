import locations from '../../data/locations.json';

export function generateStaticParams() {
  return locations.map((loc) => ({
    slug: loc.slug,
  }));
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  const locationData = locations.find((loc) => loc.slug === slug);

  if (!locationData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-600">
        404 - Nie znaleziono takiej lokalizacji.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 md:p-8 font-sans">
      
      {/* Pasek pilności (Urgency Bar) */}
      <div className="w-full max-w-4xl bg-red-600 text-white text-center py-2 px-4 rounded-t-2xl font-bold text-sm md:text-base animate-pulse">
        ⚠️ Ostry ból? Zostały 2 wolne terminy na dzisiejszy dyżur!
      </div>

      <div className="w-full max-w-4xl bg-white p-6 md:p-12 rounded-b-2xl shadow-2xl border-b-4 border-blue-600">
        
        {/* Nagłówek i główny komunikat */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 text-center leading-tight">
          Bezbolesne usuwanie ósemek <br/> <span className="text-blue-600">Warszawa {locationData.nazwa_lokalizacji}</span>
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg md:text-xl text-center max-w-2xl mx-auto">
          Szukasz doświadczonego chirurga {locationData.dzielnica}? Nasza klinika na <strong>{locationData.klinika}</strong> jest oddalona o zaledwie {locationData.czas_dojazdu}. Posiadamy własną pracownię RTG (Pantomogram/Tomografia CBCT).
        </p>

        {/* Sekcja Call to Action */}
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 mb-12 text-center transform transition duration-500 hover:scale-105">
          <p className="text-red-700 font-bold text-xl mb-4">Natychmiastowa Pomoc Chirurgiczna</p>
          <p className="text-4xl md:text-5xl font-black text-red-600 tracking-wider mb-4">
            {locationData.telefon}
          </p>
          <p className="text-sm text-red-500 font-medium">Kliknij numer na telefonie, aby zadzwonić od razu.</p>
        </div>

        {/* Social Proof - PRAWDZIWE OPINIE KILNIKI BRACI */}
        <div className="border-t border-gray-200 pt-10 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Dlaczego pacjenci nam ufają?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
              <div className="flex text-yellow-400 mb-2">★★★★★</div>
              <p className="text-gray-600 italic mb-4 text-sm">"Potrzebowałam nagłej wizyty u stomatologa i na szczęście natrafiłam na wolne miejsce u dr Kisiela. Od razu podjął działania, dzięki którym ból już nie powraca!"</p>
              <p className="text-gray-900 font-bold text-sm">— Aleksandra</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
              <div className="flex text-yellow-400 mb-2">★★★★★</div>
              <p className="text-gray-600 italic mb-4 text-sm">"Doczekałem się wreszcie gabinetu stomatologicznego na bardzo wysokim poziomie. Sprawnie, profesjonalnie i bezboleśnie :)"</p>
              <p className="text-gray-900 font-bold text-sm">— Michał B.</p>
            </div>
          </div>
        </div>

        {/* FAQ - Zbijanie obiekcji */}
        <div className="bg-blue-50 rounded-xl p-6 md:p-8 text-left">
          <h3 className="text-xl font-bold text-blue-900 mb-4">Częste pytania:</h3>
          <div className="space-y-4">
            <div>
              <p className="font-bold text-gray-800">Czy usunięcie ósemki będzie bolało?</p>
              <p className="text-gray-600 text-sm">Nie. Stosujemy nowoczesne, komputerowe znieczulenie. Pacjent czuje jedynie nacisk, absolutnie żadnego ostrego bólu.</p>
            </div>
            <div>
              <p className="font-bold text-gray-800">Czy muszę mieć własne zdjęcie RTG?</p>
              <p className="text-gray-600 text-sm">Nie, na miejscu w klinice przy {locationData.klinika} posiadamy najnowocześniejszy sprzęt do diagnostyki radiologicznej.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}