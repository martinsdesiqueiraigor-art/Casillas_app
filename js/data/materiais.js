// materiais.js — Base de materiais usinados: Vc (m/min) para HSS e metal duro

export const MATERIAIS = [
  {
    id: 'aco-1020',
    nome: 'Aço ABNT 1020',
    grupo: 'Aço carbono',
    vcHSS: 30,
    vcMD: 150,
    dureza: '120 HB'
  },
  {
    id: 'aco-1045',
    nome: 'Aço ABNT 1045',
    grupo: 'Aço carbono',
    vcHSS: 25,
    vcMD: 120,
    dureza: '180 HB'
  },
  {
    id: 'aco-4140',
    nome: 'Aço ABNT 4140',
    grupo: 'Aço liga',
    vcHSS: 20,
    vcMD: 100,
    dureza: '280 HB'
  },
  {
    id: 'aco-8620',
    nome: 'Aço ABNT 8620',
    grupo: 'Aço liga',
    vcHSS: 22,
    vcMD: 110,
    dureza: '200 HB'
  },
  {
    id: 'aco-inox-304',
    nome: 'Aço Inox 304',
    grupo: 'Inoxidável',
    vcHSS: 12,
    vcMD: 60,
    dureza: '180 HB'
  },
  {
    id: 'aco-inox-316',
    nome: 'Aço Inox 316',
    grupo: 'Inoxidável',
    vcHSS: 10,
    vcMD: 50,
    dureza: '200 HB'
  },
  {
    id: 'ferro-fundido',
    nome: 'Ferro Fundido Cinzento',
    grupo: 'Ferro fundido',
    vcHSS: 18,
    vcMD: 90,
    dureza: '180 HB'
  },
  {
    id: 'aluminio-6061',
    nome: 'Alumínio 6061',
    grupo: 'Alumínio',
    vcHSS: 120,
    vcMD: 500,
    dureza: '95 HB'
  },
  {
    id: 'aluminio-7075',
    nome: 'Alumínio 7075',
    grupo: 'Alumínio',
    vcHSS: 100,
    vcMD: 400,
    dureza: '150 HB'
  },
  {
    id: 'latao',
    nome: 'Latão',
    grupo: 'Não ferroso',
    vcHSS: 80,
    vcMD: 300,
    dureza: '110 HB'
  },
  {
    id: 'bronze',
    nome: 'Bronze',
    grupo: 'Não ferroso',
    vcHSS: 50,
    vcMD: 200,
    dureza: '140 HB'
  },
  {
    id: 'cobre',
    nome: 'Cobre',
    grupo: 'Não ferroso',
    vcHSS: 60,
    vcMD: 250,
    dureza: '80 HB'
  },
  {
    id: 'nylon',
    nome: 'Nylon',
    grupo: 'Plástico',
    vcHSS: 200,
    vcMD: 600,
    dureza: '—'
  },
  {
    id: 'pom',
    nome: 'POM (Delrin)',
    grupo: 'Plástico',
    vcHSS: 220,
    vcMD: 700,
    dureza: '—'
  },
  {
    id: 'teflon',
    nome: 'PTFE (Teflon)',
    grupo: 'Plástico',
    vcHSS: 180,
    vcMD: 550,
    dureza: '—'
  }
];

export function getMaterialById(id) {
  return MATERIAIS.find((m) => m.id === id) || null;
}
