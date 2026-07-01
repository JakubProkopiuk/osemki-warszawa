import type { NextConfig } from "next";

const currentStreetSlugs = [
  'komisji-edukacji-narodowej',
  'pulawska',
  'plaskowickiej',
  'rosola',
  'ciszewskiego',
  'indiry-gandhi',
  'dereniowa',
  'belgradzka',
  'wawozowa',
  'pileckiego',
  'roentgena',
  'stryjenskich',
  'nowoursynowska',
  'przy-bazantarni',
  'pasaz-ursynowski',
  'kulczynskiego',
  'cynamonowa',
  'kabacki-dukt',
  'relaksowa',
  'lanciego',
  'migdalowa',
  'rzymowskiego',
  'surowieckiego',
  'herbsta',
  'romera',
  'na-uboczu',
  'wokalna',
  'taneczna',
  'poloneza',
  'krasnowolska',
  'baletowa',
  'klobucka',
  'makolagwy',
  'lokajskiego',
  'raabego',
  'zaruby',
  'gawota',
  'trombity',
  'kiedacza',
  'nugat',
  'jurajska',
  'mielczarskiego',
  'senger',
  'meander',
  'kazubow',
  'mandarynki',
  'arbuzowa',
  'korbonskiego',
  'syta',
  'vogla',
];

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/[slug]': ['./data/locations.json', './src/data/locations.json'],
  },
  async redirects() {
    return [
      ...currentStreetSlugs.map((slug) => ({
        source: `/ulica-${slug}`,
        destination: `/ul-${slug}`,
        permanent: true,
      })),
      {
        source: '/ulica-:slug',
        destination: '/ursynow',
        permanent: true,
      },
      {
        source: '/osiedle-:slug',
        destination: '/ursynow',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
