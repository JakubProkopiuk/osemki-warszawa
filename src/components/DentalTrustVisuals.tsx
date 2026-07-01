type DentalClinicVisualProps = {
  compact?: boolean;
};

export function DentalClinicVisual({ compact = false }: DentalClinicVisualProps) {
  return (
    <div className={`relative overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-gradient-to-br from-white via-emerald-50/55 to-cyan-50 p-5 shadow-xl shadow-emerald-900/5 ${compact ? 'min-h-44' : 'min-h-64'}`}>
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-emerald-200/45 blur-2xl" />
      <div className="absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-cyan-200/40 blur-2xl" />

      <svg
        viewBox="0 0 420 280"
        role="img"
        aria-label="Ilustracja gabinetu stomatologicznego z fotelem, lampą i panelem RTG"
        className="relative mx-auto h-auto w-full max-w-md"
      >
        <rect x="26" y="40" width="368" height="212" rx="34" fill="#ffffff" opacity="0.72" />
        <rect x="48" y="62" width="108" height="96" rx="20" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="3" />
        <path d="M72 125c18-22 38-22 58 0" fill="none" stroke="#0f766e" strokeWidth="7" strokeLinecap="round" />
        <circle cx="91" cy="97" r="10" fill="#99f6e4" />
        <circle cx="124" cy="97" r="10" fill="#bbf7d0" />
        <rect x="66" y="142" width="70" height="8" rx="4" fill="#ccfbf1" />

        <path d="M284 51c-35 8-58 29-66 62" fill="none" stroke="#0f766e" strokeWidth="10" strokeLinecap="round" />
        <rect x="270" y="38" width="62" height="28" rx="14" fill="#064e3b" />
        <ellipse cx="304" cy="68" rx="43" ry="19" fill="#ecfeff" stroke="#0f766e" strokeWidth="5" />
        <path d="M286 73h36" stroke="#99f6e4" strokeWidth="6" strokeLinecap="round" />

        <path d="M126 190c18-31 50-47 94-42l57 7c20 2 32 16 30 34-3 20-19 31-42 28l-125-14c-13-2-20-6-14-13Z" fill="#059669" />
        <path d="M170 151c8-31 31-52 70-64 15-5 31 2 37 16l22 52-65 2c-28 1-49-1-64-6Z" fill="#34d399" />
        <path d="M221 218v34" stroke="#0f766e" strokeWidth="10" strokeLinecap="round" />
        <path d="M178 252h86" stroke="#0f766e" strokeWidth="10" strokeLinecap="round" />
        <path d="M119 199l-36 38" stroke="#0f766e" strokeWidth="9" strokeLinecap="round" />
        <path d="M105 236h45" stroke="#0f766e" strokeWidth="9" strokeLinecap="round" />

        <rect x="302" y="170" width="62" height="46" rx="14" fill="#ffffff" stroke="#a7f3d0" strokeWidth="3" />
        <path d="M318 191h31" stroke="#0f766e" strokeWidth="5" strokeLinecap="round" />
        <path d="M319 204h19" stroke="#99f6e4" strokeWidth="5" strokeLinecap="round" />
      </svg>

      <div className="relative mt-4 grid gap-2 sm:grid-cols-3">
        {[
          'Konsultacja',
          'RTG / CBCT',
          'Kolejny krok',
        ].map((label) => (
          <div key={label} className="rounded-2xl border border-white bg-white/85 px-3 py-2 text-center text-xs font-black text-emerald-800 shadow-sm">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DentalProcessVisualStrip() {
  const items = [
    {
      title: 'Wywiad objawów',
      text: 'Ból, opuchlizna, RTG i preferowany kontakt.',
      icon: (
        <path d="M22 74h76M22 102h54M22 130h64M142 72l16 16 32-38" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      ),
    },
    {
      title: 'Ocena pilności',
      text: 'Sygnały pilniejsze są oznaczane w zgłoszeniu.',
      icon: (
        <path d="M105 36 30 164h150L105 36Zm0 45v35m0 30h.1" stroke="currentColor" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      ),
    },
    {
      title: 'Kontakt zwrotny',
      text: 'Rozmowa pomaga ustalić sensowny następny krok.',
      icon: (
        <path d="M52 58h106c15 0 27 12 27 27v42c0 15-12 27-27 27H91l-39 30v-30H42c-15 0-27-12-27-27V85c0-15 12-27 27-27Z" stroke="currentColor" strokeWidth="10" strokeLinejoin="round" />
      ),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title} className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <svg viewBox="0 0 210 210" aria-hidden="true" className="h-9 w-9 fill-none">
              {item.icon}
            </svg>
          </div>
          <h3 className="text-lg font-black tracking-[-0.02em] text-slate-950">{item.title}</h3>
          <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{item.text}</p>
        </div>
      ))}
    </div>
  );
}
