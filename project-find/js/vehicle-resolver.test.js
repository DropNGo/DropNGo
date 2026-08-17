import { resolveVehicle } from './vehicle-resolver.js';

const cases = [
  ['Mercedes E 220d W213 Automatik Diesel ab 2017', {make:'mercedes',fuel:'diesel',transmission:'automatic',generation:'w213'}],
  ['VW Golf 7 2.0 TDI unter 15000 Euro', {make:'volkswagen',fuel:'diesel',max_price_eur:15000}],
  ['BMW 440i Coupé mindestens 300 PS', {make:'bmw',body:'coupe',power_min_ps:300}],
  ['Kia Stinger Diesel unter 20k', {make:'kia',fuel:'diesel',max_price_eur:20000}]
];

for (const [input, expected] of cases) {
  const r = resolveVehicle(input);
  for (const [path, value] of Object.entries(expected)) {
    const actual = path in r.identity ? r.identity[path] : r.constraints[path];
    if (actual !== value) throw new Error(`${input}: expected ${path}=${value}, got ${actual}`);
  }
}
console.log(`Vehicle resolver smoke tests passed: ${cases.length}`);
