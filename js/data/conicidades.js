// conicidades.js — Conicidades padrão: Morse, Jarno, Brown & Sharpe
// Cada registro possui dimensões em mm e relação de conicidade (1:x).

export const CONICIDADES = {
  morse: [
    { nome: 'Morse 0', d: 9.045,  D: 10.094, L: 56.5,  relacao: '1:19.212' },
    { nome: 'Morse 1', d: 12.065, D: 13.454, L: 62.0,  relacao: '1:20.047' },
    { nome: 'Morse 2', d: 17.780, D: 19.050, L: 75.0,  relacao: '1:20.020' },
    { nome: 'Morse 3', d: 23.825, D: 25.400, L: 94.0,  relacao: '1:19.922' },
    { nome: 'Morse 4', d: 31.267, D: 33.021, L: 117.5, relacao: '1:19.254' },
    { nome: 'Morse 5', d: 44.399, D: 46.762, L: 149.5, relacao: '1:19.002' },
    { nome: 'Morse 6', d: 63.348, D: 66.675, L: 210.0, relacao: '1:19.180' },
    { nome: 'Morse 7', d: 83.058, D: 88.900, L: 285.0, relacao: '1:19.231' }
  ],
  jarno: [
    { nome: 'Jarno 0',  d: 1.27, D: 6.35,  L: 76.2,  relacao: '1:20' },
    { nome: 'Jarno 2',  d: 3.81, D: 8.89,  L: 76.2,  relacao: '1:20' },
    { nome: 'Jarno 4',  d: 6.35, D: 11.43, L: 76.2,  relacao: '1:20' },
    { nome: 'Jarno 6',  d: 8.89, D: 13.97, L: 76.2,  relacao: '1:20' },
    { nome: 'Jarno 8',  d: 11.43, D: 16.51, L: 76.2, relacao: '1:20' },
    { nome: 'Jarno 10', d: 13.97, D: 19.05, L: 76.2, relacao: '1:20' },
    { nome: 'Jarno 12', d: 16.51, D: 21.59, L: 76.2, relacao: '1:20' },
    { nome: 'Jarno 14', d: 19.05, D: 24.13, L: 76.2, relacao: '1:20' },
    { nome: 'Jarno 16', d: 21.59, D: 26.67, L: 76.2, relacao: '1:20' },
    { nome: 'Jarno 18', d: 24.13, D: 29.21, L: 76.2, relacao: '1:20' },
    { nome: 'Jarno 20', d: 26.67, D: 31.75, L: 76.2, relacao: '1:20' }
  ],
  bs: [
    { nome: 'B&S 0',  d: 5.847,  D: 7.282,  L: 47.6,  relacao: '1:23.903' },
    { nome: 'B&S 1',  d: 6.696,  D: 8.128,  L: 47.6,  relacao: '1:23.903' },
    { nome: 'B&S 2',  d: 7.582,  D: 9.017,  L: 53.9,  relacao: '1:23.903' },
    { nome: 'B&S 3',  d: 8.468,  D: 9.900,  L: 53.9,  relacao: '1:23.903' },
    { nome: 'B&S 4',  d: 9.335,  D: 10.770, L: 60.3,  relacao: '1:23.903' },
    { nome: 'B&S 5',  d: 10.191, D: 11.630, L: 60.3,  relacao: '1:23.903' },
    { nome: 'B&S 6',  d: 11.086, D: 12.520, L: 66.7,  relacao: '1:23.903' },
    { nome: 'B&S 7',  d: 12.017, D: 13.450, L: 71.4,  relacao: '1:23.903' },
    { nome: 'B&S 8',  d: 13.017, D: 14.450, L: 76.2,  relacao: '1:23.903' },
    { nome: 'B&S 9',  d: 14.053, D: 15.490, L: 80.9,  relacao: '1:23.903' },
    { nome: 'B&S 10', d: 15.134, D: 16.570, L: 85.7,  relacao: '1:23.903' },
    { nome: 'B&S 11', d: 16.243, D: 17.680, L: 91.3,  relacao: '1:23.903' },
    { nome: 'B&S 12', d: 17.406, D: 18.840, L: 95.2,  relacao: '1:23.903' }
  ]
};

export function getConicidade(grupo, nome) {
  const lista = CONICIDADES[grupo];
  if (!Array.isArray(lista)) return null;
  return lista.find((c) => c.nome === nome) || null;
}
