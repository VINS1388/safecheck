/**
 * SafeCheck - Spike PDF (Sprint Tecnico 0)
 * ------------------------------------------------------------------
 * Script standalone: legge il template JSON clean-room, genera un
 * verbale di sopralluogo in PDF e lo salva su filesystem.
 *
 * Libreria: PDFKit (font standard Helvetica -> nessun embedding ->
 * file leggero; text-flow e paginazione nativi).
 *
 * VINCOLI RISPETTATI (vedi docs/struttura-pdf.v0.1.md e spike-pdf-spec.md):
 *  - Nessun database, UI, API: solo questo script.
 *  - Campi internal_only del template (note_tecnico, rif_normativo,
 *    rif_normativo_certo, correzione_default) NON vengono mai stampati.
 *  - Nessun hash/SHA256, nessun URL pubblico nel PDF.
 *  - Dati di copertina/risposte fittizi e marcati "Demo": nessun dato
 *    reale di clienti o aziende.
 *  - Guardia runtime assertClean(): ogni stringa scritta nel PDF e'
 *    verificata contro la lista di stringhe vietate; in caso di match
 *    lo script si interrompe (lo spike non e' valido finche' non e' pulito).
 */

import * as fs from "fs";
import * as path from "path";
import PDFDocument from "pdfkit";

// ----------------------------------------------------------------------------
// 0. Percorsi
// ----------------------------------------------------------------------------
const ROOT = path.resolve(__dirname, "..");
const TEMPLATE_PATH = path.join(
  ROOT,
  "seed",
  "templates",
  "verbale-sopralluogo-sicurezza-lavoro-v1.cleanroom.json"
);
const OUTPUT_DIR = path.join(ROOT, "output");
const OUTPUT_PATH = path.join(OUTPUT_DIR, "spike-verbale-demo.pdf");

// ----------------------------------------------------------------------------
// 1. Guardia stringhe vietate (controllo by-construction sul testo del PDF)
// ----------------------------------------------------------------------------
const FORBIDDEN: string[] = [
  "Gruppo Maurizi",
  "Alice Pizza",
  "Galligani",
  "Calligani",
  "Template A",
  "Template B",
  "Excel aziendale",
  "DA VERIFICARE NORMATIVAMENTE",
  "SHA256",
  "sha256",
  "2025",
];

function assertClean(s: string): string {
  for (const bad of FORBIDDEN) {
    if (s.includes(bad)) {
      throw new Error(
        `[SPIKE BLOCCANTE] Stringa vietata "${bad}" trovata in un testo destinato al PDF: ${JSON.stringify(
          s.slice(0, 120)
        )}`
      );
    }
  }
  return s;
}

// ----------------------------------------------------------------------------
// 2. Tipi minimi del template
// ----------------------------------------------------------------------------
interface Domanda {
  id: string;
  ordine: number;
  testo: string;
  tipo_risposta: string;
  obbligatoria: boolean;
  // campi internal_only del template: NON vanno mai stampati
  rif_normativo?: string;
  rif_normativo_certo?: boolean;
  correzione_default?: string;
  note_tecnico?: string;
}
interface Sezione {
  sezione_id: string;
  nome: string;
  ordine: number;
  descrizione: string;
  domande: Domanda[];
}
interface Template {
  template_id: string;
  nome: string;
  versione: string;
  sezioni: Sezione[];
}

const template: Template = JSON.parse(fs.readFileSync(TEMPLATE_PATH, "utf-8"));
const sezioni = [...template.sezioni].sort((a, b) => a.ordine - b.ordine);

// ----------------------------------------------------------------------------
// 3. Dati fittizi della visita (copertina) - clearly Demo, nessun dato reale
//    Fonte: docs/spike-pdf-spec.md sezione 4 (dataset fittizio dello spike).
// ----------------------------------------------------------------------------
const visita = {
  numero_verbale: "VRB-2026-SPIKE-001",
  document_id: "VST-A1B2C3D4",
  versione_documento: "1.0",
  data_visita: "2026-06-25",
  data_generazione: "2026-06-26",
  cliente: "Cliente Demo Sicurezza S.r.l.",
  sede_nome: "Sede Demo Roma Centro",
  sede_indirizzo: "Via Roma 1, 00100 Roma RM",
  referente: "Mario Bianchi (Referente Demo)",
  tecnico: "Marco Demo (RSPP)",
  note_finali:
    "A seguito del sopralluogo effettuato presso la sede Demo si rileva una situazione complessiva che richiede interventi prioritari nelle aree della documentazione di sicurezza e della gestione delle emergenze. Si raccomanda al datore di lavoro di procedere con urgenza all'aggiornamento del documento di valutazione dei rischi e alla revisione del piano di emergenza. Il tecnico rimane disponibile per un sopralluogo di verifica a novanta giorni dalla comunicazione delle azioni intraprese. Si raccomanda inoltre di pianificare un ciclo formativo completo per tutti i lavoratori entro il primo semestre dell'anno in corso, con particolare attenzione agli addetti antincendio e primo soccorso.",
};

// ----------------------------------------------------------------------------
// 4. Generazione risposte fittizie deterministiche
//    Pattern per sezione per garantire la distribuzione e lo spread NC.
// ----------------------------------------------------------------------------
type Esito =
  | "CONFORME"
  | "PARZIALMENTE_CONFORME"
  | "NON_CONFORME"
  | "NON_VERIFICATO"
  | "NON_APPLICABILE";

const PATTERN: Record<string, Esito[]> = {
  "SEZ-01": ["NON_CONFORME", "NON_CONFORME", "NON_CONFORME", "PARZIALMENTE_CONFORME", "PARZIALMENTE_CONFORME", "NON_VERIFICATO", "NON_APPLICABILE", "CONFORME"],
  "SEZ-02": ["NON_CONFORME", "NON_CONFORME", "NON_CONFORME", "PARZIALMENTE_CONFORME", "NON_VERIFICATO", "NON_APPLICABILE", "CONFORME", "PARZIALMENTE_CONFORME"],
  "SEZ-03": ["NON_CONFORME", "NON_CONFORME", "NON_CONFORME", "PARZIALMENTE_CONFORME", "PARZIALMENTE_CONFORME", "NON_VERIFICATO", "NON_APPLICABILE", "CONFORME"],
  "SEZ-04": ["NON_CONFORME", "NON_CONFORME", "NON_CONFORME", "PARZIALMENTE_CONFORME", "NON_VERIFICATO", "NON_VERIFICATO", "NON_APPLICABILE"],
  "SEZ-05": ["NON_CONFORME", "NON_CONFORME", "NON_CONFORME", "PARZIALMENTE_CONFORME", "NON_VERIFICATO", "NON_APPLICABILE", "CONFORME"],
  "SEZ-06": ["NON_CONFORME", "NON_CONFORME", "NON_CONFORME", "PARZIALMENTE_CONFORME", "NON_VERIFICATO"],
  "SEZ-07": ["NON_CONFORME", "NON_CONFORME", "PARZIALMENTE_CONFORME", "NON_VERIFICATO", "NON_APPLICABILE"],
};

// Testi demo longform (nessun riferimento normativo: vietati nel PDF MVP).
const OSS_LUNGA =
  "Durante il sopralluogo si e' verificato che la documentazione relativa a questo punto non risulta reperibile presso la sede visitata. Il personale presente non ha saputo indicare dove reperire tale documentazione e non e' stato possibile contattare la direzione per chiarimenti nel corso della visita. La situazione e' da considerarsi non conforme rispetto a quanto atteso e richiede una azione correttiva tracciabile.";
const COR_LUNGA =
  "Procedere entro trenta giorni alla formalizzazione e all'archiviazione della documentazione mancante, individuando un responsabile interno per la gestione e l'aggiornamento periodico. Conservare copia degli atti presso la sede e comunicare al referente l'avvenuta regolarizzazione, predisponendo un promemoria per le scadenze successive.";
const OSS_MEDIA =
  "Rilievo riscontrato durante il sopralluogo: il requisito risulta soddisfatto solo in parte e necessita di integrazione documentale o operativa.";
const COR_MEDIA =
  "Integrare quanto rilevato e pianificare una verifica di controllo entro il termine concordato con il referente.";
const OSS_NV =
  "Non e' stato possibile verificare il punto durante il sopralluogo per indisponibilita' della documentazione o impossibilita' di accesso all'area.";

interface Risposta {
  esito: Esito;
  osservazioni: string;
  // testo confermato dal tecnico: stampabile. Vuoto -> "Azione suggerita" assente.
  correzione_suggerita_finale: string;
}

let ncLongCount = 0;
function buildRisposta(esito: Esito): Risposta {
  switch (esito) {
    case "NON_CONFORME": {
      const useLong = ncLongCount < 10;
      ncLongCount++;
      return {
        esito,
        osservazioni: useLong ? OSS_LUNGA : OSS_MEDIA,
        correzione_suggerita_finale: useLong ? COR_LUNGA : COR_MEDIA,
      };
    }
    case "PARZIALMENTE_CONFORME":
      return { esito, osservazioni: OSS_MEDIA, correzione_suggerita_finale: COR_MEDIA };
    case "NON_VERIFICATO":
      return { esito, osservazioni: OSS_NV, correzione_suggerita_finale: "" };
    case "NON_APPLICABILE":
      return { esito, osservazioni: "", correzione_suggerita_finale: "" };
    case "CONFORME":
    default:
      return { esito, osservazioni: "", correzione_suggerita_finale: "" };
  }
}

interface Punto {
  sezione: Sezione;
  domanda: Domanda;
  risposta: Risposta;
}

const punti: Punto[] = [];
for (const sez of sezioni) {
  const pat = PATTERN[sez.sezione_id] || [];
  const domande = [...sez.domande].sort((a, b) => a.ordine - b.ordine);
  domande.forEach((d, i) => {
    const esito = pat[i] ?? "CONFORME";
    punti.push({ sezione: sez, domanda: d, risposta: buildRisposta(esito) });
  });
}

// ----------------------------------------------------------------------------
// 5. Conteggi (calcolati dai dati: sempre coerenti col dataset)
// ----------------------------------------------------------------------------
const ESITI: Esito[] = [
  "CONFORME",
  "PARZIALMENTE_CONFORME",
  "NON_CONFORME",
  "NON_VERIFICATO",
  "NON_APPLICABILE",
];
function emptyCounts(): Record<Esito, number> {
  return { CONFORME: 0, PARZIALMENTE_CONFORME: 0, NON_CONFORME: 0, NON_VERIFICATO: 0, NON_APPLICABILE: 0 };
}
const globalCounts = emptyCounts();
const perSezione: Record<string, Record<Esito, number>> = {};
for (const sez of sezioni) perSezione[sez.sezione_id] = emptyCounts();
for (const p of punti) {
  globalCounts[p.risposta.esito]++;
  perSezione[p.sezione.sezione_id][p.risposta.esito]++;
}
const totaleDomande = punti.length;
const totaleVerificato =
  globalCounts.CONFORME +
  globalCounts.PARZIALMENTE_CONFORME +
  globalCounts.NON_CONFORME +
  globalCounts.NON_VERIFICATO;
const pct = (n: number) =>
  totaleVerificato === 0 ? "0%" : `${Math.round((n / totaleVerificato) * 1000) / 10}%`;
const ncPiuParziali = globalCounts.NON_CONFORME + globalCounts.PARZIALMENTE_CONFORME;
const quotaCritica = totaleVerificato === 0 ? 0 : (ncPiuParziali / totaleVerificato) * 100;
let semaforo: string;
if (ncPiuParziali === 0) semaforo = "Nessuna non conformita' rilevata";
else if (quotaCritica <= 10) semaforo = "Non conformita' lievi";
else if (quotaCritica <= 30) semaforo = "Non conformita' significative";
else semaforo = "Non conformita' rilevanti - intervento prioritario";

// ----------------------------------------------------------------------------
// 6. Helper di presentazione
// ----------------------------------------------------------------------------
const ESITO_LABEL: Record<Esito, string> = {
  CONFORME: "Conforme",
  PARZIALMENTE_CONFORME: "Parziale",
  NON_CONFORME: "Non Conforme",
  NON_VERIFICATO: "Non verif.",
  NON_APPLICABILE: "N/A",
};
const ESITO_COLOR: Record<Esito, string> = {
  CONFORME: "#1a7f37",
  PARZIALMENTE_CONFORME: "#b35900",
  NON_CONFORME: "#b3261e",
  NON_VERIFICATO: "#3a5a7a",
  NON_APPLICABILE: "#777777",
};
const ESITO_BG: Record<Esito, string | null> = {
  CONFORME: null,
  PARZIALMENTE_CONFORME: "#fff4e6",
  NON_CONFORME: "#fdecea",
  NON_VERIFICATO: "#eef3f8",
  NON_APPLICABILE: "#f3f3f3",
};

const MESI = [
  "gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno",
  "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre",
];
function dataEstesa(iso: string): string {
  const [y, m, d] = iso.split("-").map((x) => parseInt(x, 10));
  return `${d} ${MESI[m - 1]} ${y}`;
}
function dataBreve(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

// ----------------------------------------------------------------------------
// 7. Costruzione PDF
// ----------------------------------------------------------------------------
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const APP = "SafeCheck";
const COLOR_TEXT = "#1a1a1a";
const COLOR_MUTED = "#555555";
const COLOR_LINE = "#cccccc";
const COLOR_ACCENT = "#1f3a5f";

// margini ~ A4: top 20mm, bottom 25mm, left/right 20mm
const M = { top: 57, bottom: 71, left: 57, right: 57 };

const doc = new PDFDocument({
  size: "A4",
  margins: M,
  bufferPages: true,
  autoFirstPage: true,
  info: {
    Title: "Verbale di sopralluogo sicurezza sul lavoro (Demo)",
    Author: "SafeCheck (spike)",
    Subject: "Spike PDF - dataset fittizio",
  },
});

const PAGE_W = doc.page.width;
const PAGE_H = doc.page.height;
const CONTENT_LEFT = M.left;
const CONTENT_RIGHT = PAGE_W - M.right;
const CONTENT_WIDTH = CONTENT_RIGHT - CONTENT_LEFT;
const CONTENT_BOTTOM = PAGE_H - M.bottom;

const stream = fs.createWriteStream(OUTPUT_PATH);
doc.pipe(stream);

// --- primitive di testo (passano sempre da assertClean) ----------------------
function txt(s: string, opts?: PDFKit.Mixins.TextOptions): void {
  // I blocchi di flusso partono sempre dal margine sinistro del contenuto.
  // Dopo le tabelle (disegnate con coordinate assolute via txtAt) doc.x resta
  // spostato su una colonna: senza questo reset i titoli partirebbero indentati
  // e sforerebbero il margine destro, apparendo troncati.
  doc.x = CONTENT_LEFT;
  doc.text(assertClean(s), opts);
}
function txtAt(s: string, x: number, y: number, opts?: PDFKit.Mixins.TextOptions): void {
  doc.text(assertClean(s), x, y, opts);
}
function ensureSpace(needed: number): void {
  if (doc.y + needed > CONTENT_BOTTOM) doc.addPage();
}
function hr(y?: number): void {
  const yy = y ?? doc.y;
  doc.save().moveTo(CONTENT_LEFT, yy).lineTo(CONTENT_RIGHT, yy).lineWidth(0.5).stroke(COLOR_LINE).restore();
}
function heading(label: string, size = 13): void {
  ensureSpace(size + 18);
  doc.font("Helvetica-Bold").fontSize(size).fillColor(COLOR_ACCENT);
  txt(label, { width: CONTENT_WIDTH });
  doc.moveDown(0.3);
  hr();
  doc.moveDown(0.5);
  doc.fillColor(COLOR_TEXT);
}
function paragraph(s: string, size = 10, color = COLOR_TEXT): void {
  doc.font("Helvetica").fontSize(size).fillColor(color);
  txt(s, { width: CONTENT_WIDTH, align: "justify", lineGap: 2 });
  doc.moveDown(0.5);
}

// ============================================================================
// BLOCCO 1 - COPERTINA
// ============================================================================
function renderCopertina(): void {
  doc.y = M.top + 30;
  doc.font("Helvetica-Bold").fontSize(11).fillColor(COLOR_ACCENT);
  txt(APP, { align: "center", width: CONTENT_WIDTH });
  doc.moveDown(0.2);
  doc.font("Helvetica").fontSize(9).fillColor(COLOR_MUTED);
  txt("nome provvisorio di lavoro", { align: "center", width: CONTENT_WIDTH });

  doc.moveDown(3);
  doc.font("Helvetica-Bold").fontSize(20).fillColor(COLOR_TEXT);
  txt("Verbale di sopralluogo", { align: "center", width: CONTENT_WIDTH });
  txt("sicurezza sul lavoro", { align: "center", width: CONTENT_WIDTH });

  doc.moveDown(2.5);
  hr();
  doc.moveDown(1);

  const rows: Array<[string, string]> = [
    ["Numero verbale", visita.numero_verbale],
    ["Document ID", visita.document_id],
    ["Versione documento", `v${visita.versione_documento}`],
    ["Cliente", visita.cliente],
    ["Sede", `${visita.sede_nome} - ${visita.sede_indirizzo}`],
    ["Referente cliente", visita.referente],
    ["Tecnico incaricato", visita.tecnico],
    ["Data sopralluogo", dataEstesa(visita.data_visita)],
    ["Data generazione verbale", dataEstesa(visita.data_generazione)],
    ["Template", template.template_id],
  ];
  const labelW = 165;
  for (const [k, v] of rows) {
    const yStart = doc.y;
    doc.font("Helvetica-Bold").fontSize(10).fillColor(COLOR_MUTED);
    txtAt(k, CONTENT_LEFT, yStart, { width: labelW });
    doc.font("Helvetica").fontSize(10).fillColor(COLOR_TEXT);
    txtAt(v, CONTENT_LEFT + labelW, yStart, { width: CONTENT_WIDTH - labelW });
    doc.y = Math.max(doc.y, yStart) + 6;
  }

  doc.moveDown(2);
  hr();
  doc.moveDown(1);
  doc.font("Helvetica").fontSize(9).fillColor(COLOR_MUTED);
  txt(
    "Documento generato automaticamente a supporto dell'attivita' tecnica. I dati di copertina e le risposte sono fittizi e a scopo dimostrativo.",
    { width: CONTENT_WIDTH, align: "center" }
  );
}

// ============================================================================
// BLOCCO 2 - DISCLAIMER
// ============================================================================
function renderDisclaimer(): void {
  doc.addPage();
  heading("Note e avvertenze");
  doc.font("Helvetica-Bold").fontSize(10).fillColor(COLOR_TEXT);
  txt("Nota sulle indicazioni operative", { width: CONTENT_WIDTH });
  doc.moveDown(0.2);
  paragraph(
    "Le correzioni e le indicazioni operative riportate in questo verbale sono suggerimenti di supporto redatti dal tecnico incaricato sulla base dei rilievi effettuati durante il sopralluogo. Tali indicazioni non sostituiscono valutazioni tecniche specialistiche, progettazioni, verifiche di conformita', pareri legali o adempimenti specifici a carico del datore di lavoro e/o del committente. La responsabilita' dell'adozione delle misure di sicurezza resta in capo ai soggetti obbligati ai sensi della normativa vigente."
  );
  doc.moveDown(0.3);
  doc.font("Helvetica-Bold").fontSize(10).fillColor(COLOR_TEXT);
  txt(`Nota sul sistema ${APP}`, { width: CONTENT_WIDTH });
  doc.moveDown(0.2);
  paragraph(
    `${APP} supporta il tecnico nella raccolta strutturata dei rilievi e nella generazione del verbale di sopralluogo. Non certifica ne' attesta la conformita' normativa del cliente o del datore di lavoro. La valutazione professionale dei rilievi, la loro classificazione e le indicazioni operative restano in capo al tecnico utilizzatore.`
  );
}

// ============================================================================
// BLOCCO 3-4 - RIEPILOGO ESECUTIVO + TABELLA GLOBALE + PER SEZIONE
// ============================================================================
function renderRiepilogo(): void {
  doc.addPage();
  heading("Riepilogo esecutivo");
  paragraph(
    `In data ${dataEstesa(visita.data_visita)} e' stato effettuato un sopralluogo presso ${visita.sede_nome} - ${visita.cliente}. Il sopralluogo ha riguardato ${sezioni.length} aree tematiche per un totale di ${totaleDomande} punti di verifica.`
  );

  // tabella globale
  const colA = CONTENT_WIDTH * 0.5;
  const colB = CONTENT_WIDTH * 0.25;
  const colC = CONTENT_WIDTH * 0.25;
  drawSimpleHeader(["Esito", "Conteggio", "% sul verificato"], [colA, colB, colC]);
  const rip: Array<[Esito, string]> = [
    ["CONFORME", pct(globalCounts.CONFORME)],
    ["PARZIALMENTE_CONFORME", pct(globalCounts.PARZIALMENTE_CONFORME)],
    ["NON_CONFORME", pct(globalCounts.NON_CONFORME)],
    ["NON_VERIFICATO", pct(globalCounts.NON_VERIFICATO)],
    ["NON_APPLICABILE", "escluso dal calcolo"],
  ];
  for (const [e, p] of rip) {
    const y = doc.y;
    const h = 16;
    doc.font("Helvetica").fontSize(9);
    doc.fillColor(ESITO_COLOR[e]);
    txtAt(ESITO_LABEL[e], CONTENT_LEFT + 4, y + 3, { width: colA - 8 });
    doc.fillColor(COLOR_TEXT);
    txtAt(String(globalCounts[e]), CONTENT_LEFT + colA + 4, y + 3, { width: colB - 8 });
    txtAt(p, CONTENT_LEFT + colA + colB + 4, y + 3, { width: colC - 8 });
    doc.save().moveTo(CONTENT_LEFT, y + h).lineTo(CONTENT_RIGHT, y + h).lineWidth(0.3).stroke(COLOR_LINE).restore();
    doc.y = y + h;
  }
  doc.moveDown(0.7);
  doc.font("Helvetica-Bold").fontSize(10).fillColor(COLOR_TEXT);
  txt(`Esito complessivo: ${semaforo}`, { width: CONTENT_WIDTH });
  doc.moveDown(0.3);
  doc.font("Helvetica-Oblique").fontSize(8).fillColor(COLOR_MUTED);
  txt(
    "Le soglie di esito sono indicative e non costituiscono una classificazione normativa. I punti Non Applicabile non rientrano nel denominatore della percentuale.",
    { width: CONTENT_WIDTH }
  );
  doc.fillColor(COLOR_TEXT);

  // tabella per sezione
  doc.moveDown(1);
  heading("Conteggi per sezione", 12);
  const wSez = CONTENT_WIDTH - 6 * 34 - 40;
  const widths = [wSez, 34, 34, 34, 34, 34, 40];
  drawSimpleHeader(["Sezione", "C", "PC", "NC", "NV", "NA", "Tot"], widths, 8);
  for (const sez of sezioni) {
    const c = perSezione[sez.sezione_id];
    const tot = c.CONFORME + c.PARZIALMENTE_CONFORME + c.NON_CONFORME + c.NON_VERIFICATO + c.NON_APPLICABILE;
    const y = doc.y;
    const cells = [
      `${sez.sezione_id} - ${sez.nome}`,
      String(c.CONFORME), String(c.PARZIALMENTE_CONFORME), String(c.NON_CONFORME),
      String(c.NON_VERIFICATO), String(c.NON_APPLICABILE), String(tot),
    ];
    doc.font("Helvetica").fontSize(8).fillColor(COLOR_TEXT);
    const rowH = Math.max(14, doc.heightOfString(assertClean(cells[0]), { width: widths[0] - 6 }) + 6);
    let x = CONTENT_LEFT;
    cells.forEach((cell, i) => {
      txtAt(cell, x + 3, y + 3, { width: widths[i] - 6, align: i === 0 ? "left" : "center" });
      x += widths[i];
    });
    doc.save().moveTo(CONTENT_LEFT, y + rowH).lineTo(CONTENT_RIGHT, y + rowH).lineWidth(0.3).stroke(COLOR_LINE).restore();
    doc.y = y + rowH;
  }
  doc.moveDown(0.4);
  doc.font("Helvetica-Oblique").fontSize(7.5).fillColor(COLOR_MUTED);
  txt("Legenda: C = Conforme, PC = Parzialmente Conforme, NC = Non Conforme, NV = Non Verificato, NA = Non Applicabile.", { width: CONTENT_WIDTH });
  doc.fillColor(COLOR_TEXT);
}

function drawSimpleHeader(labels: string[], widths: number[], size = 9): void {
  const y = doc.y;
  const h = size + 8;
  doc.save().rect(CONTENT_LEFT, y, CONTENT_WIDTH, h).fill(COLOR_ACCENT).restore();
  doc.font("Helvetica-Bold").fontSize(size).fillColor("#ffffff");
  let x = CONTENT_LEFT;
  labels.forEach((l, i) => {
    txtAt(l, x + 3, y + 4, { width: widths[i] - 6, align: i === 0 ? "left" : "center" });
    x += widths[i];
  });
  doc.fillColor(COLOR_TEXT);
  doc.y = y + h;
}

// ============================================================================
// BLOCCO 5 - ELENCO RILIEVI (NC, poi Parziali, poi NV)
// ============================================================================
function renderRilievo(p: Punto): void {
  const r = p.risposta;
  const innerW = CONTENT_WIDTH - 16;
  // calcola altezza necessaria
  doc.font("Helvetica-Bold").fontSize(9);
  const hHead = doc.heightOfString(assertClean(`${p.sezione.sezione_id} - ${p.domanda.id}`), { width: innerW });
  doc.font("Helvetica").fontSize(9);
  const hQ = doc.heightOfString(assertClean(p.domanda.testo), { width: innerW });
  const hEsito = 12;
  const hOss = r.osservazioni ? doc.heightOfString(assertClean(r.osservazioni), { width: innerW }) + 12 : 0;
  const hAz = r.correzione_suggerita_finale
    ? doc.heightOfString(assertClean(r.correzione_suggerita_finale), { width: innerW }) + 12
    : 0;
  const pad = 8;
  const boxH = hHead + 4 + hQ + 4 + hEsito + hOss + hAz + pad * 2;

  if (doc.y + boxH > CONTENT_BOTTOM) doc.addPage();
  const top = doc.y;

  const bg = ESITO_BG[r.esito];
  if (bg) doc.save().rect(CONTENT_LEFT, top, CONTENT_WIDTH, boxH).fill(bg).restore();
  doc.save().rect(CONTENT_LEFT, top, CONTENT_WIDTH, boxH).lineWidth(0.6).stroke(ESITO_COLOR[r.esito]).restore();

  let y = top + pad;
  const x = CONTENT_LEFT + 8;
  doc.font("Helvetica-Bold").fontSize(9).fillColor(COLOR_ACCENT);
  txtAt(`${p.sezione.sezione_id} - ${p.domanda.id}`, x, y, { width: innerW });
  y += hHead + 4;
  doc.font("Helvetica").fontSize(9).fillColor(COLOR_TEXT);
  txtAt(p.domanda.testo, x, y, { width: innerW });
  y += hQ + 4;
  doc.font("Helvetica-Bold").fontSize(9).fillColor(ESITO_COLOR[r.esito]);
  txtAt(`Esito: ${ESITO_LABEL[r.esito]}`, x, y, { width: innerW });
  y += hEsito;
  if (r.osservazioni) {
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLOR_MUTED);
    txtAt("Osservazione:", x, y, { width: innerW });
    y += 11;
    doc.font("Helvetica").fontSize(9).fillColor(COLOR_TEXT);
    txtAt(r.osservazioni, x, y, { width: innerW, align: "justify" });
    y += doc.heightOfString(assertClean(r.osservazioni), { width: innerW }) + 1;
  }
  if (r.correzione_suggerita_finale) {
    doc.font("Helvetica-Bold").fontSize(8.5).fillColor(COLOR_MUTED);
    txtAt("Azione suggerita:", x, y, { width: innerW });
    y += 11;
    doc.font("Helvetica").fontSize(9).fillColor(COLOR_TEXT);
    txtAt(r.correzione_suggerita_finale, x, y, { width: innerW, align: "justify" });
  }
  doc.y = top + boxH + 8;
  doc.fillColor(COLOR_TEXT);
}

function renderElencoRilievi(): void {
  // Nessun page-break forzato: l'elenco prosegue sulla pagina del riepilogo
  // se c'e' spazio, evitando di lasciarla riempita a meta'. heading() inserisce
  // comunque una nuova pagina se non resta spazio sufficiente.
  doc.moveDown(1.5);
  heading("Elenco rilievi");
  const nc = punti.filter((p) => p.risposta.esito === "NON_CONFORME");
  const pc = punti.filter((p) => p.risposta.esito === "PARZIALMENTE_CONFORME");
  const nv = punti.filter((p) => p.risposta.esito === "NON_VERIFICATO");

  doc.font("Helvetica-Bold").fontSize(11).fillColor("#b3261e");
  ensureSpace(20);
  txt(`Non Conformi (${nc.length})`, { width: CONTENT_WIDTH });
  doc.moveDown(0.4);
  doc.fillColor(COLOR_TEXT);
  nc.forEach(renderRilievo);

  ensureSpace(30);
  doc.moveDown(0.5);
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#b35900");
  txt(`Parzialmente Conformi (${pc.length})`, { width: CONTENT_WIDTH });
  doc.moveDown(0.4);
  doc.fillColor(COLOR_TEXT);
  pc.forEach(renderRilievo);

  if (nv.length > 0) {
    ensureSpace(30);
    doc.moveDown(0.5);
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#3a5a7a");
    txt(`Non Verificati (${nv.length})`, { width: CONTENT_WIDTH });
    doc.moveDown(0.4);
    doc.fillColor(COLOR_TEXT);
    nv.forEach(renderRilievo);
  }
}

// ============================================================================
// BLOCCO 6 - DETTAGLIO SEZIONI (tabella per sezione)
// ============================================================================
const DET_COLS = [
  { key: "n", label: "#", w: 22 },
  { key: "q", label: "Punto di verifica", w: 0 }, // riempie il resto
  { key: "e", label: "Esito", w: 60 },
  { key: "o", label: "Osservazioni", w: 120 },
  { key: "a", label: "Azione suggerita", w: 110 },
];
// calcola larghezza colonna "q"
(() => {
  const fixed = DET_COLS.reduce((s, c) => s + c.w, 0);
  const q = DET_COLS.find((c) => c.key === "q")!;
  q.w = CONTENT_WIDTH - fixed;
})();

function drawDetHeader(): void {
  const y = doc.y;
  const h = 18;
  doc.save().rect(CONTENT_LEFT, y, CONTENT_WIDTH, h).fill(COLOR_ACCENT).restore();
  doc.font("Helvetica-Bold").fontSize(8).fillColor("#ffffff");
  let x = CONTENT_LEFT;
  for (const c of DET_COLS) {
    txtAt(c.label, x + 3, y + 5, { width: c.w - 6, align: c.key === "q" || c.key === "o" || c.key === "a" ? "left" : "center" });
    x += c.w;
  }
  doc.fillColor(COLOR_TEXT);
  doc.y = y + h;
}

function renderDettaglioSezioni(): void {
  doc.addPage();
  heading("Dettaglio sezioni");
  sezioni.forEach((sez, idx) => {
    const c = perSezione[sez.sezione_id];
    const tot = c.CONFORME + c.PARZIALMENTE_CONFORME + c.NON_CONFORME + c.NON_VERIFICATO + c.NON_APPLICABILE;
    // ogni sezione: nuova pagina se non restano almeno ~6 righe
    if (idx > 0) {
      if (doc.y + 150 > CONTENT_BOTTOM) doc.addPage();
      else doc.moveDown(1);
    }
    doc.font("Helvetica-Bold").fontSize(12).fillColor(COLOR_ACCENT);
    ensureSpace(40);
    txt(`${sez.sezione_id} - ${sez.nome}`, { width: CONTENT_WIDTH });
    doc.font("Helvetica").fontSize(8.5).fillColor(COLOR_MUTED);
    txt(
      `${tot} punti - ${c.CONFORME} Conformi - ${c.NON_CONFORME} NC - ${c.PARZIALMENTE_CONFORME} Parziali - ${c.NON_VERIFICATO} NV - ${c.NON_APPLICABILE} NA`,
      { width: CONTENT_WIDTH }
    );
    doc.moveDown(0.4);
    doc.fillColor(COLOR_TEXT);
    drawDetHeader();

    const domande = punti.filter((p) => p.sezione.sezione_id === sez.sezione_id);
    domande.forEach((p, i) => {
      const r = p.risposta;
      const cells: Record<string, string> = {
        n: String(i + 1),
        q: p.domanda.testo,
        e: ESITO_LABEL[r.esito],
        o: r.osservazioni || "-",
        a: r.correzione_suggerita_finale || "-",
      };
      doc.font("Helvetica").fontSize(7.5);
      let rowH = 0;
      for (const col of DET_COLS) {
        const hh = doc.heightOfString(assertClean(cells[col.key]), { width: col.w - 6 });
        rowH = Math.max(rowH, hh);
      }
      rowH += 8;
      if (doc.y + rowH > CONTENT_BOTTOM) {
        doc.addPage();
        drawDetHeader();
      }
      const y = doc.y;
      const bg = ESITO_BG[r.esito];
      if (bg) doc.save().rect(CONTENT_LEFT, y, CONTENT_WIDTH, rowH).fill(bg).restore();
      let x = CONTENT_LEFT;
      for (const col of DET_COLS) {
        if (col.key === "e") {
          doc.fillColor(ESITO_COLOR[r.esito]).font("Helvetica-Bold").fontSize(7.5);
        } else {
          doc.fillColor(COLOR_TEXT).font("Helvetica").fontSize(7.5);
        }
        txtAt(cells[col.key], x + 3, y + 4, {
          width: col.w - 6,
          align: col.key === "n" || col.key === "e" ? "center" : "left",
        });
        x += col.w;
      }
      // bordi verticali leggeri
      doc.save().rect(CONTENT_LEFT, y, CONTENT_WIDTH, rowH).lineWidth(0.3).stroke(COLOR_LINE).restore();
      doc.y = y + rowH;
      doc.fillColor(COLOR_TEXT);
    });
  });
}

// ============================================================================
// BLOCCO 7 - NOTE FINALI
// ============================================================================
function renderNoteFinali(): void {
  if (!visita.note_finali) return;
  doc.addPage();
  heading("Note conclusive del tecnico");
  paragraph(visita.note_finali);
}

// ============================================================================
// BLOCCO 8 - FIRME
// ============================================================================
function renderFirme(): void {
  ensureSpace(140);
  doc.moveDown(2);
  heading("Spazio firme", 12);
  doc.moveDown(2);
  const colW = (CONTENT_WIDTH - 30) / 2;
  const y0 = doc.y;
  doc.font("Helvetica").fontSize(9).fillColor(COLOR_TEXT);
  txtAt("Il Tecnico incaricato", CONTENT_LEFT, y0, { width: colW });
  txtAt("Il Referente del cliente / Datore di lavoro", CONTENT_LEFT + colW + 30, y0, { width: colW });
  const lineY = y0 + 45;
  doc.save().moveTo(CONTENT_LEFT, lineY).lineTo(CONTENT_LEFT + colW, lineY).lineWidth(0.6).stroke(COLOR_LINE).restore();
  doc.save().moveTo(CONTENT_LEFT + colW + 30, lineY).lineTo(CONTENT_RIGHT, lineY).lineWidth(0.6).stroke(COLOR_LINE).restore();
  doc.font("Helvetica-Bold").fontSize(9);
  txtAt(visita.tecnico, CONTENT_LEFT, lineY + 4, { width: colW });
  txtAt(visita.referente, CONTENT_LEFT + colW + 30, lineY + 4, { width: colW });
  doc.font("Helvetica").fontSize(9).fillColor(COLOR_MUTED);
  txtAt("Data: ___________________", CONTENT_LEFT, lineY + 22, { width: colW });
  txtAt("Data: ___________________", CONTENT_LEFT + colW + 30, lineY + 22, { width: colW });
  doc.fillColor(COLOR_TEXT);
}

// ============================================================================
// HEADER + FOOTER su ogni pagina (buffered pages)
// ============================================================================
let TOTAL_PAGES = 0;
function renderHeaderFooter(): void {
  const range = doc.bufferedPageRange();
  const total = range.count;
  TOTAL_PAGES = total;
  for (let i = 0; i < total; i++) {
    doc.switchToPage(range.start + i);
    // azzero i margini di questa pagina: header/footer vengono disegnati
    // nell'area di margine (sopra/sotto il contenuto) e senza questo
    // accorgimento PDFKit aggiungerebbe una pagina nuova ad ogni footer.
    const savedTop = doc.page.margins.top;
    const savedBottom = doc.page.margins.bottom;
    doc.page.margins.top = 0;
    doc.page.margins.bottom = 0;
    const isCover = i === 0;
    // header (tranne copertina)
    if (!isCover) {
      doc.font("Helvetica").fontSize(8).fillColor(COLOR_MUTED);
      txtAt(`${APP}  -  ${visita.cliente}`, CONTENT_LEFT, 28, { width: CONTENT_WIDTH, lineBreak: false });
      doc.save().moveTo(CONTENT_LEFT, 40).lineTo(CONTENT_RIGHT, 40).lineWidth(0.4).stroke(COLOR_LINE).restore();
    }
    // footer (ogni pagina)
    const fy = PAGE_H - 40;
    doc.save().moveTo(CONTENT_LEFT, fy - 4).lineTo(CONTENT_RIGHT, fy - 4).lineWidth(0.4).stroke(COLOR_LINE).restore();
    doc.font("Helvetica").fontSize(7.5).fillColor(COLOR_MUTED);
    const footer = `${APP} | ${visita.numero_verbale} | Doc ID: ${visita.document_id} | v${visita.versione_documento} | Gen: ${dataBreve(visita.data_generazione)} | Pag. ${i + 1} di ${total}`;
    txtAt(footer, CONTENT_LEFT, fy, { width: CONTENT_WIDTH, align: "center", lineBreak: false });
    // ripristino i margini originali della pagina
    doc.page.margins.top = savedTop;
    doc.page.margins.bottom = savedBottom;
  }
  doc.fillColor(COLOR_TEXT);
}

// ----------------------------------------------------------------------------
// 8. Esecuzione + misurazioni
// ----------------------------------------------------------------------------
const t0 = process.hrtime.bigint();

renderCopertina();
renderDisclaimer();
renderRiepilogo();
renderElencoRilievi();
renderDettaglioSezioni();
renderNoteFinali();
renderFirme();
renderHeaderFooter();

doc.end();

stream.on("finish", () => {
  const t1 = process.hrtime.bigint();
  const ms = Number(t1 - t0) / 1e6;
  const bytes = fs.statSync(OUTPUT_PATH).size;
  const kb = bytes / 1024;
  const pages = TOTAL_PAGES;

  console.log("==================================================");
  console.log(" SafeCheck - Spike PDF - esito generazione");
  console.log("==================================================");
  console.log(` File:               ${path.relative(ROOT, OUTPUT_PATH)}`);
  console.log(` Pagine:             ${pages}`);
  console.log(` Punti di verifica:  ${totaleDomande}`);
  console.log(
    ` Distribuzione:      C=${globalCounts.CONFORME} PC=${globalCounts.PARZIALMENTE_CONFORME} NC=${globalCounts.NON_CONFORME} NV=${globalCounts.NON_VERIFICATO} NA=${globalCounts.NON_APPLICABILE}`
  );
  console.log(` Esito complessivo:  ${semaforo}`);
  console.log("--------------------------------------------------");
  console.log(` Dimensione file:    ${kb.toFixed(1)} KB  (${bytes} byte)`);
  console.log(` Tempo generazione:  ${ms.toFixed(1)} ms`);
  console.log("--------------------------------------------------");
  const okSize = kb < 500;
  const okTime = ms < 5000;
  console.log(` Target < 500 KB:    ${okSize ? "OK" : "FALLITO"}`);
  console.log(` Target < 5000 ms:   ${okTime ? "OK" : "FALLITO"}`);
  console.log(` Guardia stringhe vietate: NESSUNA violazione (assertClean su ogni testo)`);
  console.log("==================================================");
});

stream.on("error", (err) => {
  console.error("Errore scrittura PDF:", err);
  process.exit(1);
});
