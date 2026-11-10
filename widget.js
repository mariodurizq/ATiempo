// ATiempo · widget para Scriptable
// Lee el horario.txt que envía la web ATiempo y muestra tu próxima alarma y a qué hora salir.
// Requisito: en Scriptable → Settings → File Bookmarks, crea un marcador llamado "ATiempo"
// que apunte a la carpeta donde se guarda horario.txt (por ejemplo, Chrome).

const BOOKMARK = "ATiempo";
const FILE = "horario.txt";
const WEB = "https://mariodurizq.github.io/atiempo/";

const C = {
  bg1: new Color("#1b2b63"), bg2: new Color("#0b0b10"),
  txt: Color.white(), mut: new Color("#9a9aab"),
  accent: new Color("#f2a33a"), green: new Color("#34d399"), red: new Color("#ef4444"),
};

function pad(n) { return String(n).padStart(2, "0"); }
function ymd(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function toDate(day, hhmm) { const [h, m] = hhmm.split(":").map(Number); const d = new Date(day + "T00:00:00"); d.setHours(h, m, 0, 0); return d; }
function dayLabel(day) {
  const t = new Date(); const tm = new Date(); tm.setDate(t.getDate() + 1);
  if (day === ymd(t)) return "Hoy";
  if (day === ymd(tm)) return "Mañana";
  const d = new Date(day + "T12:00:00");
  return ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][d.getDay()] + " " + d.getDate();
}

async function readSchedule() {
  // El marcador puede apuntar a iCloud Drive o a "En mi iPhone": probamos ambos
  const managers = [FileManager.iCloud(), FileManager.local()];
  let fm = managers.find(m => { try { return m.bookmarkExists(BOOKMARK); } catch (e) { return false; } });
  if (!fm) return { error: `Crea el marcador "${BOOKMARK}" en Scriptable → Settings → File Bookmarks` };
  const dir = fm.bookmarkedPath(BOOKMARK);
  let files = [];
  try { files = fm.listContents(dir); } catch (e) {}
  // horario.txt, o cualquier "horario*.txt" (por si iOS lo renombró a "horario 2.txt")
  const name = files.includes(FILE) ? FILE : files.filter(f => /^horario.*\.txt$/i.test(f)).sort().pop();
  if (!name) {
    const folder = dir.split("/").filter(Boolean).slice(-2).join("/");
    return { error: `No hay horario.txt en "${folder}". Veo: ${files.slice(0, 6).join(", ") || "(carpeta vacía)"}` };
  }
  const path = fm.joinPath(dir, name);
  try { if (fm.isFileStoredIniCloud && fm.isFileStoredIniCloud(path)) await fm.downloadFileFromiCloud(path); } catch (e) {}
  const text = fm.readString(path) || "";
  const alarms = {}, info = {};
  for (const line of text.split(/\r?\n/)) {
    let m = line.match(/^(\d{4}-\d{2}-\d{2})=(.+)$/);
    if (m) { alarms[m[1]] = m[2].split("|").filter(Boolean); continue; }
    m = line.match(/^@(\d{4}-\d{2}-\d{2});(.*)$/);
    if (m) {
      const parts = m[2].split(";"), o = { type: parts[0], name: parts[1] };
      for (const p of parts.slice(2)) { const [k, v] = p.split("="); o[k] = v; }
      info[m[1]] = o;
    }
  }
  return { alarms, info };
}

function nextEntry(data) {
  const now = new Date();
  const days = [...new Set([...Object.keys(data.alarms), ...Object.keys(data.info)])].sort();
  for (const d of days) {
    const inf = data.info[d] || {};
    const end = inf.llegar ? toDate(d, inf.llegar) : toDate(d, (data.alarms[d] || ["23:59"]).slice(-1)[0]);
    if (end > now) return { day: d, alarms: data.alarms[d] || [], info: inf };
  }
  return null;
}

function lastDay(data) { const d = Object.keys(data.alarms).sort(); return d[d.length - 1]; }

async function build() {
  const fam = config.widgetFamily || "medium";
  const w = new ListWidget();
  w.url = WEB;
  const g = new LinearGradient(); g.colors = [C.bg1, C.bg2]; g.locations = [0, 1]; w.backgroundGradient = g;

  const data = await readSchedule();
  if (data.error) {
    const t = w.addText("⏰ ATiempo"); t.font = Font.boldSystemFont(14); t.textColor = C.accent;
    w.addSpacer(4);
    const e = w.addText(data.error); e.font = Font.systemFont(11); e.textColor = C.txt;
    return w;
  }
  const n = nextEntry(data);
  if (!n) {
    const t = w.addText(fam.startsWith("accessory") ? "ATiempo: renueva el horario" : "⚠️ Horario caducado");
    t.font = Font.boldSystemFont(13); t.textColor = C.txt;
    if (!fam.startsWith("accessory")) { w.addSpacer(4); const s = w.addText("Abre ATiempo → Rutinas → Renovar"); s.font = Font.systemFont(11); s.textColor = C.mut; }
    return w;
  }

  const tele = n.info.type === "tele";
  const first = n.alarms[0] || n.info.despertar || "--:--";
  const label = dayLabel(n.day);
  const left = Math.round((new Date(lastDay(data) + "T12:00:00") - new Date()) / 864e5);

  // Pantalla de bloqueo
  if (fam === "accessoryRectangular") {
    const a = w.addText(`${tele ? "🏠" : "🏢"} ${label} · ⏰ ${first}`); a.font = Font.boldSystemFont(14);
    const b = w.addText(tele ? `Empiezas ${n.info.llegar || ""}` : `Sal a las ${n.info.salir || "--:--"}`); b.font = Font.systemFont(13);
    if (left <= 3) { const c = w.addText("Renueva el horario"); c.font = Font.systemFont(11); }
    return w;
  }
  if (fam === "accessoryInline") { w.addText(`⏰ ${first} · ${tele ? "🏠" : "sal " + (n.info.salir || "")}`); return w; }
  if (fam === "accessoryCircular") { const a = w.addText("⏰"); a.centerAlignText(); const b = w.addText(first); b.font = Font.boldSystemFont(12); b.centerAlignText(); return w; }

  // Pantalla de inicio
  const head = w.addStack(); head.centerAlignContent();
  const h1 = head.addText(`${tele ? "🏠" : "🏢"} ${label}`); h1.font = Font.semiboldSystemFont(12); h1.textColor = C.mut;
  head.addSpacer();
  if (n.info.name && fam !== "small") { const h2 = head.addText(n.info.name); h2.font = Font.systemFont(12); h2.textColor = C.mut; }
  w.addSpacer(6);

  const al = w.addText(`⏰ ${first}`); al.font = Font.lightSystemFont(fam === "small" ? 30 : 34); al.textColor = C.txt; al.minimumScaleFactor = 0.7;
  if (n.alarms.length > 1) { const r = w.addText(`${n.alarms.length} alarmas · hasta ${n.alarms[n.alarms.length - 1]}`); r.font = Font.systemFont(11); r.textColor = C.mut; }
  w.addSpacer(6);

  if (tele) {
    const t = w.addText(`💻 Empiezas a las ${n.info.llegar || "--:--"}`); t.font = Font.semiboldSystemFont(13); t.textColor = C.green;
  } else {
    const t = w.addText(`🚪 Sal a las ${n.info.salir || "--:--"}`); t.font = Font.boldSystemFont(15); t.textColor = C.accent;
    if (fam !== "small" && n.info.trayecto) { const u = w.addText(`🚗 ${n.info.trayecto} min · llegas ${n.info.llegar}`); u.font = Font.systemFont(11); u.textColor = C.mut; }
  }
  w.addSpacer();
  if (left <= 3) { const z = w.addText(left < 0 ? "⚠️ Horario caducado" : `⚠️ Renueva el horario (${left} d)`); z.font = Font.systemFont(10); z.textColor = C.red; }

  // Refrescar a medianoche o después de la hora de llegada
  const nx = new Date(); nx.setMinutes(nx.getMinutes() + 30); w.refreshAfterDate = nx;
  return w;
}

const widget = await build();
if (config.runsInWidget) Script.setWidget(widget);
else await widget.presentMedium();
Script.complete();
