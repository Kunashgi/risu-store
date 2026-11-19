#!/usr/bin/env node
/*
 * publicar.js — Asistente semanal para republicar en Facebook Marketplace.
 * NO se conecta a Facebook ni automatiza el navegador: solo elige textos/fotos/precio,
 * prepara la carpeta publicaciones/hoy/ y copia cada dato al portapapeles.
 * Antes de cada tanda imprime (y copia) un prompt para que Claude Code borre las publicaciones
 * antiguas con la extensión de Chrome; el script en sí nunca toca Facebook.
 *
 *   node publicar.js              → modo interactivo: elige la tanda según la hora
 *                                   (antes de las 17:00 = mañana, después = noche)
 *   node publicar.js --manana     → fuerza la tanda de la mañana
 *   node publicar.js --noche      → fuerza la tanda de la noche
 *   node publicar.js --nueva      → descarta el plan de esta semana y genera uno nuevo
 *   node publicar.js --prueba     → igual que siempre, pero sin guardar historial (se combina con lo demás)
 *   node publicar.js --historial  → muestra lo usado cada semana
 *   node publicar.js --validar    → revisa productos.json / grupos.json / fotos
 */
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execFileSync, spawn } = require('child_process');

const PUB = path.join(__dirname, 'publicaciones');
const F_PRODUCTOS = path.join(PUB, 'productos.json');
const F_GRUPOS = path.join(PUB, 'grupos.json');
const F_HISTORIAL = path.join(PUB, 'historial.json');
// --prueba: hace todo igual pero NO guarda el historial y arma las fotos en una carpeta temporal
const PRUEBA = process.argv.includes('--prueba');
// todo queda dentro del proyecto (disco F), nunca en la carpeta temporal del sistema (disco C)
const HOY = PRUEBA ? path.join(PUB, 'hoy-prueba') : path.join(PUB, 'hoy');
const EXT_FOTOS = ['.jpg', '.jpeg', '.png', '.webp'];

// ---------- utilidades ----------
const c = {
  b: (s) => `\x1b[1m${s}\x1b[0m`,
  g: (s) => `\x1b[32m${s}\x1b[0m`,
  y: (s) => `\x1b[33m${s}\x1b[0m`,
  r: (s) => `\x1b[31m${s}\x1b[0m`,
  cy: (s) => `\x1b[36m${s}\x1b[0m`,
  d: (s) => `\x1b[2m${s}\x1b[0m`,
};
const aviso = (m) => console.log(c.y('⚠ ' + m));
const error = (m) => console.log(c.r('✖ ' + m));
const pesos = (n) => '$' + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const azar = (arr) => arr[Math.floor(Math.random() * arr.length)];

function leerJSON(file, porDefecto) {
  if (!fs.existsSync(file)) return porDefecto;
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    error(`No pude leer ${path.relative(__dirname, file)}: ${e.message}`);
    return porDefecto;
  }
}
function guardarJSON(file, data) {
  if (PRUEBA && file === F_HISTORIAL) return; // en modo prueba el historial nunca se toca
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, file);
}

function semanaISO(d = new Date()) {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dia = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - dia);
  const inicio = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const n = Math.ceil(((t - inicio) / 86400000 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(n).padStart(2, '0')}`;
}

// ---------- datos ----------
function cargarDatos() {
  const datos = leerJSON(F_PRODUCTOS, null);
  if (!datos || !Array.isArray(datos.productos)) {
    error('publicaciones/productos.json no existe o no tiene la lista "productos".');
    process.exit(1);
  }
  const grupos = leerJSON(F_GRUPOS, { grupos: {} });
  const carpetaFotos = path.resolve(PUB, datos.carpetaFotos || '../imgenes-alter-facebook');
  return {
    productos: datos.productos,
    tandas: datos.tandas || {},
    pie: datos.pieDescripcion || [],
    maxFotos: datos.maxFotosPorPublicacion || 5,
    carpetaFotos,
    grupos: grupos.grupos || {},
    maxGrupos: grupos.maxGruposPorPublicacion || 15,
  };
}

function fotosDe(p, cfg) {
  if (!p.carpeta) return [];
  const dir = path.join(cfg.carpetaFotos, p.carpeta);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => EXT_FOTOS.includes(path.extname(f).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
}

// Junta los grupos de todas las etiquetas intercalándolos (uno de cada etiqueta por turno),
// así cualquier ventana de 15 tiene una mezcla pareja de todas las etiquetas.
function gruposDe(p, cfg) {
  const listas = [];
  const desconocidas = [];
  for (const tag of p.grupos || []) {
    if (!cfg.grupos[tag]) desconocidas.push(tag);
    else listas.push(cfg.grupos[tag]);
  }
  const lista = [];
  const largo = Math.max(0, ...listas.map((l) => l.length));
  for (let i = 0; i < largo; i++)
    for (const l of listas) if (i < l.length && !lista.includes(l[i])) lista.push(l[i]);
  return { lista, desconocidas };
}

// ---------- tandas ----------
const TANDAS = ['mañana', 'noche'];
const HORA_CORTE = 17; // antes de esta hora se ofrece la tanda de la mañana
const tandaNombre = (t) => (t === 'tarde' ? 'noche' : t); // planes antiguos usaban "tarde"

// Devuelve la tanda de un producto según "tandas" en productos.json (null si no está en ninguna)
function tandaDe(id, cfg) {
  for (const t of TANDAS) if (((cfg.tandas[t] || {}).productos || []).includes(id)) return t;
  return null;
}
// Posición del producto dentro de su tanda (para respetar el orden de productos.json)
function ordenEnTanda(id, cfg) {
  const t = tandaDe(id, cfg);
  return t ? cfg.tandas[t].productos.indexOf(id) : Infinity;
}
function horarioDe(t, cfg) {
  const h = (cfg.tandas[t] || {}).horario;
  return h ? ` (~${h})` : '';
}

function cargarHistorial() {
  const h = leerJSON(F_HISTORIAL, { semanas: [] });
  if (!Array.isArray(h.semanas)) h.semanas = [];
  return h;
}

// ---------- elección semanal ----------
function distintoDe(opciones, anterior) {
  const resto = opciones.filter((o) => o !== anterior);
  return azar(resto.length ? resto : opciones);
}

function planificarProducto(p, cfg, anterior, vecesPublicado) {
  const avisos = [];
  const fotos = fotosDe(p, cfg);
  if (!fotos.length) avisos.push('no tiene fotos');

  // portada: rota por las fotos aptas, sin repetir la de la semana anterior
  const noPortada = new Set(p.noPortada || []);
  let candidatas = fotos.filter((f) => !noPortada.has(f));
  if (!candidatas.length) candidatas = fotos;
  let portada = null;
  if (candidatas.length) {
    const i = anterior ? candidatas.indexOf(anterior.portada) : -1;
    portada = candidatas[(i + 1) % candidatas.length];
  }
  // resto de fotos: en orden, partiendo después de la portada (así también varían)
  let resto = [];
  if (portada) {
    const k = fotos.indexOf(portada);
    resto = [...fotos.slice(k + 1), ...fotos.slice(0, k)].slice(0, cfg.maxFotos - 1);
  }

  const titulos = (p.titulos || []).filter(Boolean);
  if (!titulos.length) avisos.push('no tiene títulos (uso el nombre)');
  const titulo = titulos.length ? distintoDe(titulos, anterior && anterior.titulo) : p.nombre || p.id;

  const descs = (p.descripciones || []).filter(Boolean);
  if (!descs.length) avisos.push('no tiene descripciones');
  const descripcion = descs.length ? distintoDe(descs, anterior && anterior.descripcion) : '';

  const precios = (p.variacionesPrecio && p.variacionesPrecio.length ? p.variacionesPrecio : [p.precioBase])
    .filter((x) => typeof x === 'number');
  if (!precios.length) avisos.push('no tiene precio');
  const precio = precios.length ? distintoDe(precios, anterior && anterior.precio) : null;

  // grupos: si son más que el máximo, rota cuáles se marcan cada semana
  const { lista, desconocidas } = gruposDe(p, cfg);
  if (desconocidas.length) avisos.push(`etiquetas sin grupos en grupos.json: ${desconocidas.join(', ')}`);
  let grupos = lista;
  if (lista.length > cfg.maxGrupos) {
    const offset = (vecesPublicado * cfg.maxGrupos) % lista.length;
    grupos = Array.from({ length: cfg.maxGrupos }, (_, j) => lista[(offset + j) % lista.length]);
  }

  return { nombre: p.nombre || p.id, portada, fotos: resto, titulo, descripcion, precio, grupos, estado: 'pendiente', avisos };
}

function crearPlan(cfg, hist, semana) {
  const anteriorSemana = hist.semanas[hist.semanas.length - 1];
  const A = cfg.productos.filter((p) => p.tier === 'A' && !p.inactivo);
  const plan = { semana, creada: new Date().toISOString(), completada: false, productos: {} };
  const mitad = Math.ceil(A.length / 2);
  const conTanda = A.map((p, i) => {
    let t = p.id && tandaDe(p.id, cfg);
    if (p.id && !t) {
      t = i < mitad ? 'mañana' : 'noche';
      aviso(`${p.id} no está en "tandas" de productos.json; lo pongo en la ${t}.`);
    }
    return { p, t };
  });
  // orden: primero la mañana, luego la noche; dentro de cada una, el orden de productos.json
  conTanda.sort((a, b) => TANDAS.indexOf(a.t) - TANDAS.indexOf(b.t) || ordenEnTanda(a.p.id, cfg) - ordenEnTanda(b.p.id, cfg));
  for (const { p, t } of conTanda) {
    if (!p.id) { aviso(`Producto sin "id" (${p.nombre || '¿?'}), lo salto.`); continue; }
    const ant = anteriorSemana && anteriorSemana.productos[p.id];
    const veces = hist.semanas.filter((s) => s.productos[p.id]).length;
    const pl = planificarProducto(p, cfg, ant, veces);
    pl.tanda = t;
    plan.productos[p.id] = pl;
  }
  return plan;
}

// ---------- carpeta hoy/ ----------
// publicaciones/hoy/manana/01_id, publicaciones/hoy/noche/01_id ...
function carpetaHoy(id, plan) {
  const t = tandaNombre(plan.productos[id].tanda);
  const ids = Object.keys(plan.productos).filter((x) => tandaNombre(plan.productos[x].tanda) === t);
  const sub = t === 'mañana' ? 'manana' : t;
  return path.join(HOY, sub, `${String(ids.indexOf(id) + 1).padStart(2, '0')}_${id}`);
}

function textoDescripcion(pl, cfg) {
  return [pl.descripcion, cfg.pie.join('\n')].filter(Boolean).join('\n\n');
}

function generarHoy(plan, cfg) {
  fs.rmSync(HOY, { recursive: true, force: true });
  fs.mkdirSync(HOY, { recursive: true });
  fs.writeFileSync(path.join(HOY, 'SEMANA.txt'), plan.semana, 'utf8');
  for (const [id, pl] of Object.entries(plan.productos)) {
    const p = cfg.productos.find((x) => x.id === id) || {};
    const dir = carpetaHoy(id, plan);
    fs.mkdirSync(dir, { recursive: true });
    const origen = path.join(cfg.carpetaFotos, p.carpeta || '');
    const lista = pl.portada ? [pl.portada, ...pl.fotos] : [];
    lista.forEach((f, k) => {
      const ext = path.extname(f).toLowerCase();
      const nombre = k === 0 ? `1_portada${ext}` : `${k + 1}_${f}`;
      try {
        fs.copyFileSync(path.join(origen, f), path.join(dir, nombre));
      } catch (e) {
        aviso(`${id}: no pude copiar ${f} (${e.code || e.message})`);
      }
    });
    if (!lista.length) fs.writeFileSync(path.join(dir, 'SIN_FOTOS.txt'), 'Este producto no tiene fotos en ' + origen, 'utf8');
    fs.writeFileSync(
      path.join(dir, 'textos.txt'),
      `TÍTULO:\n${pl.titulo}\n\nPRECIO:\n${pl.precio ?? '(sin precio)'}\n\nDESCRIPCIÓN:\n${textoDescripcion(pl, cfg)}\n\nGRUPOS (${pl.grupos.length}):\n${pl.grupos.map((g) => '- ' + g).join('\n')}\n`,
      'utf8'
    );
  }
}

function hoyAlDia(plan) {
  try {
    if (fs.readFileSync(path.join(HOY, 'SEMANA.txt'), 'utf8').trim() !== plan.semana) return false;
    // si cambió la forma de las carpetas (o faltan), se regenera
    return Object.keys(plan.productos).every((id) => fs.existsSync(carpetaHoy(id, plan)));
  } catch {
    return false;
  }
}

// ---------- portapapeles / explorador ----------
function copiar(texto) {
  const s = String(texto);
  try {
    if (process.platform === 'win32') {
      const tmp = path.join(PUB, '.portapapeles.tmp');
      fs.writeFileSync(tmp, s, 'utf8');
      const ruta = tmp.replace(/'/g, "''");
      execFileSync('powershell.exe', ['-NoProfile', '-NonInteractive', '-Command',
        `Set-Clipboard -Value ([IO.File]::ReadAllText('${ruta}', [Text.Encoding]::UTF8))`], { stdio: 'ignore' });
    } else if (process.platform === 'darwin') {
      execFileSync('pbcopy', { input: s });
    } else {
      execFileSync('xclip', ['-selection', 'clipboard'], { input: s });
    }
    return true;
  } catch (e) {
    aviso('No pude copiar al portapapeles. Cópialo a mano:');
    console.log(s);
    return false;
  }
}

function abrirCarpeta(dir) {
  try {
    const cmd = process.platform === 'win32' ? 'explorer.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    spawn(cmd, [dir], { detached: true, stdio: 'ignore' }).unref();
  } catch (e) {
    aviso(`No pude abrir la carpeta: ${dir}`);
  }
}

// ---------- interacción ----------
let rl;
const cola = [];
let esperando = null;
let cerrado = false;
function iniciarEntrada(alSalir) {
  rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  rl.on('line', (l) => (esperando ? (esperando(l), (esperando = null)) : cola.push(l)));
  rl.on('close', () => { cerrado = true; if (esperando) esperando('q'); });
  rl.on('SIGINT', alSalir);
}
// Enter = seguir; si se cierra la entrada (Ctrl+Z / EOF) se trata como "q".
function preguntar(q) {
  process.stdout.write(q);
  const norm = (l) => String(l).trim().toLowerCase();
  if (cola.length) return Promise.resolve(norm(cola.shift()));
  if (cerrado) return Promise.resolve('q');
  return new Promise((res) => (esperando = (l) => res(norm(l))));
}

function mostrarProducto(id, pl, n, total) {
  console.log('\n' + c.cy('━'.repeat(60)));
  console.log(c.b(`[${n}/${total}] ${pl.nombre}`) + c.d(`  (${id})`));
  console.log(`Precio: ${c.g(pl.precio != null ? pesos(pl.precio) : '(sin precio)')}`);
  console.log(`Título: ${pl.titulo}`);
  console.log(`Portada: ${pl.portada || c.r('(sin fotos)')}  · ${pl.portada ? pl.fotos.length + 1 : 0} fotos`);
  for (const a of pl.avisos || []) aviso(a);
  console.log(c.b(`Grupos a marcar (${pl.grupos.length}):`));
  pl.grupos.forEach((g) => console.log('  ☐ ' + g));
}

// ---------- borrar las publicaciones antiguas (lo hace Claude Code con la extensión de Chrome) ----------
// Última vez que el producto quedó publicado antes del plan actual = la publicación que hoy está en Marketplace
function publicacionAnterior(hist, plan, id) {
  for (let k = hist.semanas.length - 1; k >= 0; k--) {
    const s = hist.semanas[k];
    if (s === plan || s.semana === plan.semana) continue;
    const p = s.productos[id];
    if (p && p.estado === 'publicado') return { ...p, semana: s.semana };
  }
  return null;
}

function promptBorrado(items, tandas) {
  const lista = items.map(({ pl, ant }, i) => ant
    ? `${i + 1}. "${ant.titulo}" — ${ant.precio != null ? pesos(ant.precio) : 'sin precio'}` +
      `  (producto: ${pl.nombre}; publicada ${ant.publicadoEn ? ant.publicadoEn.slice(0, 10) : 'la semana ' + ant.semana})`
    : `${i + 1}. ${pl.nombre} — NO hay registro de cómo quedó publicada: búscala por el nombre del producto y pregúntame antes de borrarla`);
  return [
    'Usa la extensión Claude in Chrome para borrar mis publicaciones antiguas de Facebook Marketplace, antes de que suba las nuevas.',
    '',
    '1. Abre una pestaña nueva en https://www.facebook.com/marketplace/you/selling (ya tengo la sesión iniciada).',
    '2. Busca cada publicación de la lista por su título (el precio sirve para confirmar) y elimínala.',
    '   Si Facebook pregunta si la vendiste, elige la opción que NO diga que la vendí en Facebook.',
    '3. Borra SOLO lo que está en la lista. Si hay más de una que calza o el título no coincide, no la borres y pregúntame.',
    '   Si una no aparece, sáltala (puede que ya la haya borrado).',
    '4. Al terminar, dime cuáles borraste y cuáles no.',
    '',
    `Publicaciones a borrar (tanda de la ${tandas.join(' y ')}):`,
    ...lista,
  ].join('\n');
}

function checklistB(cfg) {
  const B = cfg.productos.filter((p) => p.tier === 'B' && !p.inactivo);
  if (!B.length) return;
  console.log('\n' + c.b('Grupo B — solo RENOVAR en Marketplace:'));
  B.forEach((p) => console.log('  ☐ ' + (p.nombre || p.id)));
}

async function modoInteractivo(cfg, forzarNueva, tandaPedida) {
  if (PRUEBA) {
    console.log(c.y('══ MODO PRUEBA ══ No se guarda el historial; lo que marques como publicado se olvida al salir.'));
    console.log(c.d(`Las fotos se preparan en ${HOY}`));
  }
  const hist = cargarHistorial();
  const semana = semanaISO();
  let plan = hist.semanas[hist.semanas.length - 1];

  if (plan && plan.semana === semana && forzarNueva) {
    hist.semanas.pop();
    plan = null;
    aviso('Descarté el plan de esta semana; genero uno nuevo.');
  }
  if (!plan || plan.semana !== semana) {
    plan = crearPlan(cfg, hist, semana);
    hist.semanas.push(plan);
    guardarJSON(F_HISTORIAL, hist);
    console.log(c.g(`Plan nuevo para la semana ${semana}.`));
  } else {
    console.log(c.g(`Retomando la semana ${semana}.`));
  }
  // la tanda de cada producto sale siempre de productos.json (así un cambio ahí aplica al plan en curso)
  for (const [id, pl] of Object.entries(plan.productos)) pl.tanda = tandaDe(id, cfg) || tandaNombre(pl.tanda);
  guardarJSON(F_HISTORIAL, hist);

  if (PRUEBA || !hoyAlDia(plan)) {
    console.log(`Preparando la carpeta ${PRUEBA ? HOY : 'publicaciones/hoy/'} ...`);
    generarHoy(plan, cfg);
  }

  const ids = Object.keys(plan.productos);
  const pendientesDe = (t) => ids.filter((id) => plan.productos[id].tanda === t && plan.productos[id].estado !== 'publicado');
  if (!ids.some((id) => plan.productos[id].estado !== 'publicado')) {
    console.log(c.g('✔ Ya publicaste todo el grupo A esta semana.') + c.d('  (usa --nueva para rehacer el plan)'));
    checklistB(cfg);
    return;
  }

  iniciarEntrada(() => {
    guardarJSON(F_HISTORIAL, hist);
    console.log(PRUEBA ? '\nModo prueba: no se guardó nada. Hasta luego.' : '\nGuardado. Hasta luego.');
    process.exit(0);
  });

  // ¿qué tanda toca? la pedida por flag o, si no, según la hora
  const tandaHora = new Date().getHours() < HORA_CORTE ? 'mañana' : 'noche';
  const tanda = tandaPedida || tandaHora;
  let tandas = [tanda];
  let salir = false;
  console.log(c.d(`Tanda: ${tanda}${tandaPedida ? ' (elegida con flag)' : ' (según la hora)'}`));

  // si es de noche y quedó algo pendiente de la mañana, ofrecer hacerlo primero
  if (tanda === 'noche' && pendientesDe('mañana').length) {
    const n = pendientesDe('mañana').length;
    const r = await preguntar(`${c.y(`Quedaron ${n} pendiente(s) de la mañana.`)} [Enter] hacerlos primero, n = solo la noche, q = salir: `);
    if (r === 'q') salir = true;
    else if (r !== 'n') tandas = ['mañana', 'noche'];
  }

  // antes de subir: prompt para que Claude Code borre las publicaciones antiguas de lo que toca hoy
  const aBorrar = salir ? [] : tandas.flatMap((t) => pendientesDe(t))
    .map((id) => ({ pl: plan.productos[id], ant: publicacionAnterior(hist, plan, id) }));
  if (aBorrar.length) {
    const texto = promptBorrado(aBorrar, tandas);
    console.log('\n' + c.b('════ Antes de subir: borrar las publicaciones antiguas ════'));
    const copiado = copiar(texto);
    if (copiado) {
      console.log(c.d('Pega esto en Claude Code (ya quedó copiado en el portapapeles):') + '\n');
      console.log(texto);
    }
    const r = await preguntar(`\n  [Enter] cuando estén borradas ${c.d('(q = salir)')} `);
    if (r === 'q') salir = true;
  }

  for (let t = 0; t < tandas.length && !salir; t++) {
    const tanda = tandas[t];
    const lista = pendientesDe(tanda);
    const enTanda = ids.filter((id) => plan.productos[id].tanda === tanda).length;
    if (!lista.length) {
      console.log(c.g(`\n✔ La tanda de la ${tanda} ya está completa.`));
      continue;
    }
    console.log('\n' + c.b(`════ Tanda de la ${tanda.toUpperCase()}${horarioDe(tanda, cfg)} — faltan ${lista.length} de ${enTanda} ════`));

    for (let i = 0; i < lista.length && !salir; i++) {
      const id = lista[i];
      const pl = plan.productos[id];
      mostrarProducto(id, pl, i + 1, lista.length);
      const pasos = [
        ['copiar TÍTULO', () => copiar(pl.titulo) && console.log(c.g('  ✔ Título copiado'))],
        ['copiar PRECIO', () => pl.precio != null ? copiar(pl.precio) && console.log(c.g(`  ✔ Precio copiado (${pl.precio})`)) : aviso('Sin precio')],
        ['copiar DESCRIPCIÓN', () => copiar(textoDescripcion(pl, cfg)) && console.log(c.g('  ✔ Descripción copiada'))],
        ['abrir carpeta de fotos', () => { abrirCarpeta(carpetaHoy(id, plan)); console.log(c.g('  ✔ Carpeta abierta (arrastra las fotos en orden)')); }],
        ['marcar como PUBLICADO', () => {
          pl.estado = 'publicado';
          pl.publicadoEn = new Date().toISOString();
          guardarJSON(F_HISTORIAL, hist);
          console.log(c.g('  ✔ Publicado'));
        }],
      ];
      for (const [texto, accion] of pasos) {
        const r = await preguntar(`  [Enter] ${texto}   ${c.d('(s = saltar, q = salir)')} `);
        if (r === 'q') { salir = true; break; }
        if (r === 's') {
          pl.estado = 'saltado';
          guardarJSON(F_HISTORIAL, hist);
          console.log(c.y('  ↷ Saltado (aparecerá de nuevo cuando retomes)'));
          break;
        }
        accion();
      }
    }
  }

  const faltan = ids.filter((id) => plan.productos[id].estado !== 'publicado');
  plan.completada = faltan.length === 0;
  guardarJSON(F_HISTORIAL, hist);
  rl.close();

  console.log('\n' + c.cy('━'.repeat(60)));
  if (faltan.length) {
    for (const t of TANDAS) {
      const f = pendientesDe(t);
      if (f.length) console.log(c.y(`Pendientes de la ${t}${horarioDe(t, cfg)}: `) + f.map((id) => plan.productos[id].nombre).join(', '));
    }
    if (!pendientesDe('mañana').length && pendientesDe('noche').length && tanda === 'mañana')
      console.log(c.g('✔ Mañana lista.') + c.d(` La noche${horarioDe('noche', cfg)}: "node publicar.js --noche"`));
    else if (!PRUEBA) console.log(c.d('Ejecuta otra vez "node publicar.js" para retomar donde quedaste.'));
  } else {
    console.log(c.g('✔ ¡Grupo A completo esta semana!'));
  }
  if (PRUEBA) console.log(c.y('Modo prueba: no se guardó nada en el historial.'));
  checklistB(cfg);
}

// ---------- --historial ----------
function mostrarHistorial() {
  const hist = cargarHistorial();
  if (!hist.semanas.length) return console.log('Aún no hay historial.');
  for (const s of hist.semanas) {
    const prods = Object.entries(s.productos);
    const pub = prods.filter(([, p]) => p.estado === 'publicado').length;
    console.log('\n' + c.b(`Semana ${s.semana}`) + c.d(`  (creada ${s.creada.slice(0, 10)}) — ${pub}/${prods.length} publicados`));
    for (const [id, p] of prods) {
      const marca = p.estado === 'publicado' ? c.g('✔') : p.estado === 'saltado' ? c.y('↷') : c.d('·');
      console.log(`  ${marca} ${p.nombre}`);
      console.log(c.d(`      ${p.precio != null ? pesos(p.precio) : 's/precio'} · portada: ${p.portada || '-'} · ${p.grupos.length} grupos`));
      console.log(c.d(`      "${p.titulo}"`));
    }
  }
}

// ---------- --validar ----------
function validar(cfg) {
  let errores = 0, avisos = 0;
  const E = (m) => { errores++; error(m); };
  const W = (m) => { avisos++; aviso(m); };

  if (!fs.existsSync(cfg.carpetaFotos)) E(`No existe la carpeta de fotos: ${cfg.carpetaFotos}`);
  const obligatorias = ['Metro Lo Blanco', 'San Bernardo', '2.900', 'Transferencia'];
  for (const o of obligatorias) if (!cfg.pie.join('\n').includes(o)) W(`pieDescripcion no menciona "${o}"`);
  for (const [tag, lista] of Object.entries(cfg.grupos)) if (!Array.isArray(lista) || !lista.length) W(`grupos.json: "${tag}" está vacío`);

  // tandas
  const enTandas = new Map();
  for (const t of Object.keys(cfg.tandas)) if (!TANDAS.includes(t)) E(`tandas: "${t}" no existe (usa ${TANDAS.join(' / ')})`);
  for (const t of TANDAS) {
    if (!cfg.tandas[t]) { W(`tandas: falta la tanda "${t}"`); continue; }
    for (const id of cfg.tandas[t].productos || []) {
      if (enTandas.has(id)) E(`tandas: ${id} está en "${enTandas.get(id)}" y en "${t}"`);
      enTandas.set(id, t);
      const p = cfg.productos.find((x) => x.id === id);
      if (!p) E(`tandas: el producto "${id}" no existe`);
      else if (p.tier !== 'A') W(`tandas: ${id} es tier ${p.tier}; solo se publica el tier A`);
    }
  }

  const ids = new Set();
  for (const p of cfg.productos) {
    const n = p.id || p.nombre || '(sin id)';
    console.log(c.b(`\n${n}`) + c.d(` [${p.tier || '?'}]`));
    if (!p.id) E('falta "id"');
    else if (ids.has(p.id)) E(`id repetido: ${p.id}`);
    ids.add(p.id);
    if (!p.nombre) W('falta "nombre"');
    if (!['A', 'B'].includes(p.tier)) E('tier debe ser "A" o "B"');

    const dir = p.carpeta ? path.join(cfg.carpetaFotos, p.carpeta) : null;
    const fotos = fotosDe(p, cfg);
    if (!p.carpeta) E('falta "carpeta"');
    else if (!fs.existsSync(dir)) (p.tier === 'A' ? E : W)(`no existe la carpeta ${p.carpeta}`);
    else if (!fotos.length) (p.tier === 'A' ? E : W)('la carpeta no tiene fotos');
    else if (fotos.length < 3) W(`solo ${fotos.length} foto(s); conviene tener 3 o más`);
    for (const f of p.noPortada || []) if (!fotos.includes(f)) W(`noPortada: no existe ${f}`);

    const { lista, desconocidas } = gruposDe(p, cfg);
    if (!(p.grupos || []).length) W('no tiene grupos');
    if (desconocidas.length) E(`etiquetas que no están en grupos.json: ${desconocidas.join(', ')}`);

    if (p.tier === 'A') {
      if (typeof p.precioBase !== 'number') E('precioBase debe ser un número');
      const v = p.variacionesPrecio || [];
      if (v.length < 2) W('variacionesPrecio: pon al menos 2 para poder variar');
      if (v.some((x) => typeof x !== 'number')) E('variacionesPrecio debe tener solo números');
      if (typeof p.precioBase === 'number' && v.some((x) => Math.abs(x - p.precioBase) / p.precioBase > 0.05))
        W('alguna variación de precio se aleja más de 5% del precio base');
      if ((p.titulos || []).length < 3) E(`titulos: tiene ${(p.titulos || []).length}, mínimo 3`);
      if ((p.descripciones || []).length < 2) E(`descripciones: tiene ${(p.descripciones || []).length}, mínimo 2`);
      if (!p.inactivo && p.id && !enTandas.has(p.id)) W('no está en ninguna tanda (mañana / noche)');
      else if (enTandas.has(p.id)) console.log(c.d(`  tanda: ${enTandas.get(p.id)}`));
      if (lista.length > cfg.maxGrupos) console.log(c.d(`  ${lista.length} grupos → se rotan ${cfg.maxGrupos} por semana`));
    }
    console.log(c.d(`  ${fotos.length} fotos · ${lista.length} grupos`));
  }
  console.log('\n' + (errores ? c.r(`${errores} error(es)`) : c.g('Sin errores')) + `, ${avisos} aviso(s).`);
  process.exitCode = errores ? 1 : 0;
}

// ---------- main ----------
async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log('Uso: node publicar.js [--manana | --noche] [--nueva] [--prueba]  |  --historial  |  --validar');
    return;
  }
  if (args.includes('--historial')) return mostrarHistorial();
  const cfg = cargarDatos();
  if (args.includes('--validar')) return validar(cfg);
  const tanda = args.some((a) => ['--manana', '--mañana'].includes(a)) ? 'mañana' : args.includes('--noche') ? 'noche' : null;
  await modoInteractivo(cfg, args.includes('--nueva'), tanda);
}

main().catch((e) => {
  error(e.stack || e.message);
  process.exit(1);
});
