# spike-pdf-spec.md
# SafeCheck — Spike PDF — Sprint Tecnico 0

**Versione:** 0.1.3  
**Data:** 2026-06-25  
**Stato:** DRAFT OPERATIVO — baseline candidata per spike PDF statico, non approvata per sviluppo applicativo  
**Priorità:** MASSIMA — precede qualsiasi altro sviluppo  

> **Nota nome:** `SafeCheck` è nome provvisorio di lavoro, non ancora verificato come marchio, dominio o denominazione commerciale.

---

## 1. Obiettivo dello spike

Verificare in modo definitivo se `@react-pdf/renderer` è tecnicamente adatto a produrre il verbale SafeCheck **prima** di costruire qualsiasi altra componente del sistema.

Lo spike risponde a una sola domanda:

> **@react-pdf/renderer è in grado di generare un verbale di sopralluogo sicurezza sul lavoro professionale, con il layout definito in `struttura-pdf.v0.1.md`, in modo affidabile e performante?**

Se la risposta è sì, si procede con lo sviluppo dell'app.  
Se la risposta è no, si valuta l'alternativa (Puppeteer/HTML-to-PDF) prima di costruire qualsiasi altra cosa.

---

## 2. Vincolo assoluto — Sprint 0

Lo spike PDF viene **prima di tutto**. In nessun caso si inizia lo sviluppo di:

- Schema dati o migration SQL
- Database (Supabase o altro)
- Interfaccia utente (qualsiasi schermata)
- API route (qualsiasi endpoint)
- Autenticazione
- Qualsiasi altro componente applicativo

Il motivo è semplice: se la generazione PDF non funziona come atteso, tutto il resto è costruito su una base non verificata. Lo spike è il gate di ingresso allo sviluppo.

---

## 3. Perimetro dello spike

Lo spike è uno **script locale standalone** che:

1. Carica un dataset fittizio hardcoded (nessun database, nessuna API)
2. Genera un PDF usando `@react-pdf/renderer`
3. Salva il PDF su filesystem locale
4. Termina

Non richiede:
- Server web
- Database
- Autenticazione
- Storage remoto
- Qualsiasi infrastruttura cloud

---

---

## 3a. Nota sulle macroaree e sul mismatch domande template / spike

### Macroaree nel PDF dello spike

Le macroaree `Anagrafica e contesto visita` e `Rilievi conclusivi` non sono sezioni checklist. Nello spike:

- **Anagrafica e contesto visita** → copertina, con dati hardcoded (cliente, sede, tecnico, data).
- **Rilievi conclusivi** → riepilogo automatico NC + sezione note finali, entrambi generati dai dati hardcoded.

Il corpo delle domande (7 sezioni, SEZ-01 → SEZ-07) corrisponde al template funzionale.

### Mismatch domande: template MVP (48) vs dataset spike (≥60)

Il template JSON `verbale-sopralluogo-sicurezza-lavoro-v1` contiene **48 domande** nelle 7 sezioni operative. Lo spike richiede **almeno 60 domande** nel dataset.

Questa differenza è **intenzionale e non costituisce una modifica al template funzionale**:

> Il dataset dello spike può contenere domande fittizie aggiuntive rispetto al template MVP per simulare casi peggiorativi di impaginazione. Non costituisce modifica al template funzionale.

Le domande aggiuntive servono a stressare il layout PDF in condizioni peggiori di quelle reali: tabelle più lunghe, più NC da elencare, più righe da gestire. Se il layout regge con 60+ domande, reggerà con certezza con 48.

Le domande aggiuntive fittizi per lo spike devono essere aggiunte nel dataset hardcoded dello script (non nel JSON del template), distribuite nelle sezioni esistenti o in sezioni fittizie aggiuntive dello spike.

---

## 4. Dataset fittizio minimo per lo spike

Il dataset è hardcoded nello script. Non viene caricato da database o API.

### 4.1 Visita fittizia

```javascript
const visitaFittizia = {
  id: "VST-SPIKE-001",
  document_id: "VST-A1B2C3D4",
  numero_verbale: "VRB-2026-SPIKE-001",
  versione_documento: "1.0",
  data_visita: "2026-06-25",
  data_generazione: "2026-06-25",
  stato: "VERBALE_GENERATO",
  note_finali_visita: "A seguito del sopralluogo effettuato in data odierna presso la sede Demo di Via Roma 1, si rileva una situazione complessiva che richiede interventi prioritari nelle aree della documentazione di sicurezza e della gestione delle emergenze. Si raccomanda al datore di lavoro di procedere con urgenza all'aggiornamento del DVR e alla revisione del Piano di Emergenza. Il tecnico rimane disponibile per un sopralluogo di verifica a 90 giorni dalla comunicazione delle azioni intraprese. Si raccomanda inoltre di pianificare un ciclo formativo completo per tutti i lavoratori entro il primo semestre dell'anno in corso, con particolare attenzione agli addetti antincendio e primo soccorso."
};
```

### 4.2 Cliente e sede fittizi

```javascript
const clienteFittizio = {
  ragione_sociale: "Cliente Demo Sicurezza S.r.l.",
  codice: "CLI-DEMO-001"
};

const sedeFittizia = {
  nome_sede: "Sede Demo Roma Centro",
  indirizzo: "Via Roma 1",
  citta: "Roma",
  cap: "00100",
  provincia: "RM"
};

const referenteFittizio = {
  nome: "Mario",
  cognome: "Bianchi (Demo)",
  ruolo: "Referente Sicurezza"
};
```

### 4.3 Tecnico fittizio

```javascript
const tecnicoFittizio = {
  nome: "Marco",
  cognome: "Demo RSPP",
  qualifica: "RSPP"
};
```

### 4.4 Distribuzione risposte per lo spike

Il dataset deve contenere le seguenti risposte distribuite sulle 48 domande del template:

| Stato | Numero minimo | Note |
|---|---|---|
| NON_CONFORME | 20 | Distribuiti in almeno 4 sezioni diverse |
| PARZIALMENTE_CONFORME | 10 | Distribuiti in almeno 3 sezioni diverse |
| NON_VERIFICATO | 8 | Distribuiti in almeno 2 sezioni diverse |
| NON_APPLICABILE | 15 | Concentrabili in 2-3 sezioni |
| CONFORME | restanti (~0, si completano con NC/Parziali/NV/NA) | |

> **Nota:** 20+10+8+15 = 53 > 48. Questo è intenzionale: alcune domande possono essere NC E avere osservazioni lunghe. Il numero totale di domande nel template è 48; la distribuzione sopra va adattata: es. 20 NC, 10 Parziali, 8 NV, 10 NA, 0 Conformi. Il dataset fittizio può contenere più NC del solito per testare il layout in condizioni di stress.

### 4.5 Testi fittizi per osservazioni e correzioni (longform)

Usare testi lunghi per testare il layout:

```javascript
const osservazioneLunga = "Durante il sopralluogo si è verificato che la documentazione relativa alla nomina del RSPP è assente dagli archivi della sede visitata. Non è stato possibile verificare la presenza di un atto formale di accettazione dell'incarico da parte del nominato. Si precisa che il personale presente non ha saputo indicare dove reperire tale documentazione, né è stato possibile contattare la direzione aziendale per chiarimenti. La situazione è da considerarsi Non Conforme ai sensi delle norme vigenti.";

const correzioneLunga = "Procedere entro 30 giorni alla formalizzazione dell'atto di nomina del RSPP, sottoscritto dal datore di lavoro, con allegata accettazione dell'incarico da parte del nominato. Verificare che il RSPP possedesse, al momento della nomina, i requisiti di capacità e di formazione previsti dall'art. 32 del D.Lgs. 81/2008. Conservare copia degli atti in sede e comunicare all'RLS l'avvenuta formalizzazione.";
```

---

## 5. Struttura PDF da generare nello spike

Il PDF di output dello spike deve includere tutti i blocchi definiti in `struttura-pdf.v0.1.md`:

| Blocco | Incluso nello spike |
|---|---|
| Copertina con tutti i campi | ✅ |
| Disclaimer correzioni suggerite | ✅ |
| Riepilogo esecutivo con conteggi globali | ✅ |
| Tabella conteggi per sezione | ✅ |
| Elenco rilievi (NC ordinati per sezione, poi Parziali) | ✅ |
| Elenco Non Verificati | ✅ |
| Dettaglio sezioni (tutte e 7) | ✅ |
| Note finali visita | ✅ |
| Spazio firme | ✅ |
| Footer su ogni pagina (numero verbale, Document ID, versione, data, pagina X di Y) | ✅ |
| **SHA256 nel footer** | ❌ MAI |
| **note_tecnico nel testo** | ❌ MAI |
| **URL pubblico al PDF** | ❌ MAI |

---

## 6. Criteri di accettazione dello spike

Lo spike è superato se **tutti** i seguenti criteri sono verificati:

| Criterio | Verifica |
|---|---|
| Il PDF viene generato senza errori JavaScript o di rendering | Console pulita |
| Il file .pdf è apribile in Adobe Acrobat Reader | Apertura manuale |
| Il file .pdf è apribile in Chrome e Firefox | Apertura manuale |
| Il tempo di generazione è < 5 secondi in locale | `console.time` nell'output |
| La dimensione del file è < 500 KB (senza foto) | `ls -lh output.pdf` |
| Nessun testo è tagliato in nessuna cella della tabella | Revisione visiva ogni pagina |
| Nessuna tabella ha colonne sovrapposte o illeggibili | Revisione visiva |
| Header e footer non si sovrappongono al contenuto | Revisione visiva |
| I page break sono in posizioni accettabili (nessuna riga spezzata a metà) | Revisione visiva |
| La copertina contiene tutti i campi previsti | Revisione visiva con checklist |
| Il riepilogo esecutivo mostra i conteggi corretti rispetto al dataset | Verifica numerica manuale |
| L'elenco NC contiene tutti i 20 NC nell'ordine corretto | Verifica manuale |
| Il disclaimer correzioni è presente | Verifica visiva |
| Il disclaimer prodotto (SafeCheck non certifica conformità) è presente | Verifica visiva |
| SHA256 non compare nel footer né in nessun'altra sezione | Ricerca testo in PDF ("sha256", "hash") |
| Le note_tecnico del template NON compaiono nel PDF | Verifica visiva su ogni domanda + ricerca testo |
| Nessun testo DA VERIFICARE NORMATIVAMENTE o rif_normativo nel PDF | Ricerca testo in PDF |
| Nessuna correzione_default grezza nel PDF: compare solo correzione_suggerita_finale confermata | Verifica visiva NC |
| Il Document ID è presente nel footer di ogni pagina | Verifica visiva footer |
| Le note_finali_visita compaiono in sezione dedicata | Verifica visiva |
| Lo spazio firme è presente e formattato | Verifica visiva |
| Il PDF è giudicato "presentabile a un cliente senza modifiche manuali" | Giudizio soggettivo del progettista |

---

## 7. Criteri di fallimento dello spike

Lo spike è **fallito** (e richiede valutazione dell'alternativa) se si verifica uno qualsiasi dei seguenti:

| Criterio di fallimento | Conseguenza |
|---|---|
| Il PDF non viene generato (errore runtime) | Valutare alternativa immediatamente |
| Contenuto tagliato in celle | Valutare se risolvibile con CSS/configurazione oppure alternativa |
| Righe di tabella spezzate tra pagine | Valutare se risolvibile oppure alternativa |
| Footer sovrapposto al contenuto | Valutare se risolvibile oppure alternativa |
| Tabelle con più di 50 righe ingestibili | Valutare alternativa |
| Tempo di generazione > 15 secondi in locale | Valutare ottimizzazione o alternativa |
| File > 2 MB senza foto | Valutare ottimizzazione o alternativa |
| Layout non presentabile (giudizio soggettivo) | Valutare alternativa |
| Impossibilità di controllare header/footer in modo stabile | Valutare alternativa |
| Una o più stringhe vietate trovate nel PDF o nei file sorgente spike | BLOCCANTE — correggere prima di dichiarare lo spike valido |

---

## 7b. Controllo testuale post-generazione — stringhe vietate

Dopo la generazione del PDF, eseguire il seguente controllo su: (a) testo estratto dal PDF, (b) file sorgente dello script spike, (c) dataset fittizio hardcoded.

**Le seguenti stringhe non devono comparire in nessuno dei tre artefatti:**

| Stringa vietata | Contesto vietato |
|---|---|
| `Gruppo Maurizi` | Qualsiasi |
| `Alice Pizza` | Qualsiasi |
| `Galligani` | Qualsiasi |
| `Calligani` | Qualsiasi |
| `Template B` | Qualsiasi |
| `Template A` | Qualsiasi |
| `Excel aziendale` | Qualsiasi |
| `file Excel aziendale` | Qualsiasi |
| `note_tecnico` | Nel testo del PDF (ammessa nel codice sorgente come nome campo) |
| `rif_normativo` | Nel testo del PDF (ammessa nel codice sorgente come nome campo) |
| `DA VERIFICARE NORMATIVAMENTE` | Nel testo del PDF |
| `SHA256` | Nel testo del PDF |
| `sha256` | Nel testo del PDF |
| `2025` | Nel testo del PDF e nel dataset hardcoded |
| nomi di clienti reali identificabili | Qualsiasi |
| nomi di aziende reali identificabili | Qualsiasi |
| riferimenti a verbali reali | Qualsiasi |

**Controllo raccomandato (script bash post-generazione):**

```bash
# Estrai testo dal PDF (richiede pdftotext o equivalente)
pdftotext output/spike-verbale-demo.pdf - | grep -iE \
  "Gruppo Maurizi|Alice Pizza|Galligani|Calligani|Template [AB]|SHA256|DA VERIFICARE|2025"

# Controlla file sorgente spike
grep -rE \
  "Gruppo Maurizi|Alice Pizza|Galligani|Calligani|Template [AB]|SHA256|2025" \
  scripts/spike-pdf.ts
```

Se il controllo trova risultati: lo spike non è superato fino a correzione.

---

## 8. Decisione post-spike

### 8.1 Spike superato

Se tutti i criteri di accettazione sono soddisfatti:

> ✅ **@react-pdf/renderer è adeguato. Procedere con la definizione dello schema dati.**

Il passo successivo è definire lo schema dati (entità e relazioni) nel documento `docs/schema-dati.md` prima di aprire Claude Code per lo sviluppo applicativo.

### 8.2 Spike fallito

Se uno o più criteri di accettazione non sono soddisfatti:

> ❌ **@react-pdf/renderer non è adeguato. Valutare Puppeteer/HTML-to-PDF prima di procedere.**

In questo caso, eseguire uno spike alternativo con:
- **Puppeteer** (headless Chromium che stampa HTML in PDF)
- **Playwright** (alternativa a Puppeteer)
- **wkhtmltopdf** (DA VERIFICARE compatibilità e manutenzione)

Il nuovo spike alternativo segue gli stessi criteri di accettazione e la stessa struttura di dataset.

Solo dopo il superamento di uno spike (principale o alternativo) si procede allo sviluppo applicativo.

---

## 9. Librerie suggerite per lo spike

| Libreria | Versione | Ruolo | Note |
|---|---|---|---|
| `@react-pdf/renderer` | latest stable | Rendering PDF | Principale da testare |
| `react` | 18.x | Peer dependency | |
| `typescript` | 5.x | Tipizzazione | |

Lo spike deve essere eseguito come **script locale standalone**, ad esempio `scripts/spike-pdf.ts`, con dataset fittizio hardcoded o importato da file JSON locale. Non richiede server web, framework, route API o qualsiasi componente applicativo.

---

## 10. Prompt per Claude Code (primo utilizzo futuro)

Il seguente prompt è da usare come **prima e unica richiesta** a Claude Code per lo spike PDF. Non deve contenere richieste di database, UI, API o qualsiasi altra componente.

---

```
Devi generare uno spike PDF standalone per il progetto SafeCheck.

VINCOLO ASSOLUTO: non devi creare database, UI, API route, autenticazione, connessioni cloud o qualsiasi componente applicativo. Solo uno script che genera un file PDF.

OBIETTIVO: verificare che @react-pdf/renderer sia adatto a generare il verbale SafeCheck.

STRUTTURA DEL PDF da rispettare (definita in docs/struttura-pdf.v0.1.md):
1. Copertina
2. Disclaimer correzioni suggerite
3. Riepilogo esecutivo con conteggi globali
4. Tabella conteggi per sezione
5. Elenco rilievi (NC prima, poi Parziali, poi NV)
6. Dettaglio sezioni (tutte e 7)
7. Note finali visita
8. Spazio firme
9. Footer su ogni pagina: [NomeApp | Numero verbale | Document ID | Versione | Data generazione | Pagina X di Y]

REGOLE ASSOLUTE:
- SHA256 non deve comparire mai nel PDF (né nel footer né altrove); ricerca nel testo del PDF generato per conferma
- Le note_tecnico non devono comparire nel PDF (internal_only: true)
- I campi rif_normativo e qualsiasi testo "DA VERIFICARE NORMATIVAMENTE" non devono comparire nel PDF
- Nel PDF compare solo correzione_suggerita_finale (testo confermato dal tecnico nel dataset hardcoded); la correzione_default del template non viene mai stampata automaticamente
- Il Document ID deve essere presente nel footer di ogni pagina
- Il disclaimer correzioni deve essere presente
- Il disclaimer prodotto (SafeCheck non certifica la conformità normativa; supporta la raccolta strutturata; la valutazione resta al tecnico) deve essere presente
- Nessun URL pubblico nel PDF

DATASET: usa i dati fittizi hardcoded in docs/spike-pdf-spec.md §4. Non caricare dati da file JSON o database.

DISTRIBUZIONE RISPOSTE: includi nel dataset hardcoded almeno 20 NC, 10 Parziali, 8 NV, 10 NA su 48 domande totali (7 sezioni, struttura definita in seed/templates/verbale-sopralluogo-sicurezza-lavoro-v1.cleanroom.json).

TESTI LUNGHI: usa osservazioni e correzioni di almeno 200 caratteri per almeno 10 domande, per testare il layout con contenuto realistico.

OUTPUT: un file PDF salvato in ./output/spike-verbale-demo.pdf

DOPO LA GENERAZIONE: mostrami:
- console.time del tempo di generazione
- dimensione del file in KB
- conferma testuale che SHA256, note_tecnico, rif_normativo e DA VERIFICARE NORMATIVAMENTE non compaiono nel PDF (verifica nel testo estratto)
- un elenco dei potenziali problemi di layout che hai identificato durante la scrittura del codice

NON fare nulla oltre a questo script. Non proporre il passo successivo. Non creare file aggiuntivi. Solo lo spike PDF.
```

---

## Checklist qualità file

- [ ] Lo spike è definito come prerequisito assoluto a qualsiasi sviluppo applicativo
- [ ] Il vincolo "nessun database, UI, API, Supabase" è esplicito e ripetuto
- [ ] Il dataset fittizio non contiene dati reali
- [ ] Il mismatch 48 (template MVP) vs 60+ (dataset spike) è spiegato e giustificato
- [ ] La frase "non costituisce modifica al template funzionale" è presente
- [ ] Le macroaree anagrafica e rilievi conclusivi sono spiegate come non-sezioni checklist
- [ ] I criteri di accettazione includono verifica esplicita dell'assenza di SHA256
- [ ] I criteri di accettazione includono verifica dell'assenza di note_tecnico
- [ ] I criteri di accettazione includono verifica dell'assenza di rif_normativo e DA VERIFICARE NORMATIVAMENTE
- [ ] I criteri di accettazione includono verifica che solo correzione_suggerita_finale sia stampata
- [ ] I criteri di accettazione includono presenza del Document ID nel footer
- [ ] I criteri di accettazione includono entrambi i disclaimer (correzioni + prodotto)
- [ ] La distribuzione risposte include almeno 20 NC, 10 Parziali, 8 NV
- [ ] I testi longform sono inclusi per testare il layout sotto stress
- [ ] La decisione post-spike definisce chiaramente le due strade (passa/fallisce)
- [ ] Il prompt per Claude Code è limitato allo spike e non richiede sviluppo applicativo
- [ ] Lo stato del file è DRAFT OPERATIVO
- [ ] La data è aggiornata a 2026-06-25
- [ ] Il nome SafeCheck è marcato come provvisorio
