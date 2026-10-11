// Uso (con la API encendida): node scripts/seed-semana-06.mjs [http://localhost:5500]
const BASE = process.argv[2] ?? 'http://localhost:5500';
const H = { 'Content-Type': 'application/json' };

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, { method: 'POST', headers: H, body: JSON.stringify(body) });
  const data = await res.json();
  if (!res.ok) console.log(`  ! ${path} -> ${res.status}`, data.message ?? data);
  return data;
}
const patch = (path, body) =>
  fetch(`${BASE}${path}`, { method: 'PATCH', headers: H, body: JSON.stringify(body) });

const becas = [
  'Beca de Excelencia Académica', 'Beca Deportiva', 'Beca Cultural',
  'Beca de Alimentación', 'Beca de Transporte', 'Beca de Investigación',
  'Beca de Vinculación', 'Beca para Software', 'Beca de Movilidad',
  'Beca de Idiomas', 'Beca Socioeconómica', 'Beca de Emprendimiento',
];
const estudiantes = [
  ['Ana', 'Zambrano', 'Software', 5, true],
  ['Anabel', 'Mero', 'Software', 6, true],
  ['Carlos', 'Loor', 'Derecho', 3, true],
  ['Lucia', 'Cedeno', 'Enfermería', 7, false], // inactiva
  ['Mateo', 'Vera', 'Software', 2, true],
  ['Daniela', 'Parraga', 'Contabilidad', 4, true],
];

console.log('Creando becas...');
const b = [];
for (const [i, name] of becas.entries()) {
  b.push(await post('/scholarships', {
    name, description: `Descripción de ${name}`, amount: 100 + i * 25,
    startDate: '2026-01-01', endDate: '2026-12-31', isActive: i % 4 !== 3,
  }));
}

console.log('Creando estudiantes...');
const s = [];
for (const [i, [firstName, lastName, career, semester, isActive]] of estudiantes.entries()) {
  s.push(await post('/students', {
    firstName, lastName, nationalId: `130000000${i}`,
    email: `${firstName}.${lastName}@live.uleam.edu.ec`.toLowerCase(),
    age: 18 + i, career, semester, isActive,
  }));
}

console.log('Creando solicitudes...');
// Solo se crean solicitudes para estudiantes activos: activamos a Lucia un momento.
const lucia = s[3];
await patch(`/students/${lucia.id}`, { isActive: true });
const pares = [[0,0],[0,7],[1,0],[1,7],[2,1],[3,2],[3,3],[4,7],[5,4],[5,5]];
const apps = [];
for (const [si, bi] of pares) {
  apps.push(await post('/applications', {
    studentId: s[si].id, scholarshipId: b[bi].id,
    gpa: 7.5 + si * 0.3, income: 400 + bi * 30,
    comment: `Solicitud de ${estudiantes[si][0]}`,
  }));
}
await patch(`/students/${lucia.id}`, { isActive: false });

console.log('Creando documentos y seguimientos...');
for (const a of apps.slice(0, 6)) {
  await post('/documents', { applicationId: a.id, name: `Cédula solicitud ${a.id}`, url: `https://example.com/doc-${a.id}.pdf` });
  await post('/tracking', { applicationId: a.id, status: 'revision', comment: 'Solicitud en revisión' });
}
console.log('Listo: 12 becas, 6 estudiantes (1 inactiva), 10 solicitudes.');