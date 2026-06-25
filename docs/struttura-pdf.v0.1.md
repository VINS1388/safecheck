# struttura-pdf.v0.1.md
# SafeCheck — Struttura operativa del verbale PDF

**Versione:** 0.1.2  
**Data:** 2026-06-25  
**Stato:** DRAFT OPERATIVO — baseline candidata per spike PDF statico, non approvata per sviluppo applicativo  
**Dipende da:** `contratto-mvp.v0.1.md`, `verbale-sopralluogo-sicurezza-lavoro-v1.cleanroom.json`  

> **Nota nome:** `SafeCheck` è nome provvisorio di lavoro, non ancora verificato come marchio, dominio o denominazione commerciale.

---

## 1. Obiettivo PDF

Il PDF è il **prodotto percepito dal cliente finale** del sopralluogo. Non è una trascrizione dell'interfaccia digitale. Non deve replicare l'aspetto di un file Excel o di un modulo cartaceo.

Il verbale PDF deve:
- apparire come un documento professionale autonomo;
- essere comprensibile senza accesso al sistema;
- contenere tutte le informazioni rilevanti del sopralluogo in modo strutturato;
- distinguere chiaramente conformità, non conformità, osservazioni e azioni suggerite;
- essere adatto alla consegna al cliente o al datore di lavoro.

Il verbale PDF **non deve**:
- contenere istruzioni interne per il tecnico (`note_tecnico`);
- contenere hash crittografici (SHA256) nel footer o in qualsiasi sezione stampata;
- contenere URL pubblici al file PDF stesso;
- contenere dati personali non pertinenti al sopralluogo;
- replicare strutture di file Excel o checklist interne.

---

## 2. Regole di sicurezza PDF

| Regola | Dettaglio |
|---|---|
| Nessun URL pubblico | Il PDF è in bucket privato; il documento stesso non contiene il proprio URL |
| Nessun SHA256 nel documento | Gli hash sono solo metadati interni nel database |
| Document ID sì | Identificatore univoco della visita, stampato nel footer |
| Numero verbale sì | Numero progressivo del verbale, stampato nel footer e in copertina |
| Dati fittizi negli esempi | Tutti gli esempi in questo documento usano dati fittizi |
| Note tecnico mai stampate | I campi `note_tecnico` (internal_only: true) non compaiono mai nel PDF |
| Disclaimer correzioni | Le correzioni suggerite sono accompagnate da disclaimer operativo |

---

## 3. Nome prodotto nel documento

Il documento usa il nome provvisorio:

> **SafeCheck**  
> *Verbale di sopralluogo sicurezza sul lavoro*

Nessun logo reale. Nessun riferimento aziendale. Il nome è provvisorio e modificabile senza impatto sulla struttura.

---

## 4. Struttura generale del documento

Il PDF è composto dai seguenti blocchi, in questo ordine:

| # | Blocco | Obbligatorio |
|---|---|---|
| 1 | Copertina | ✅ |
| 2 | Disclaimer correzioni suggerite | ✅ |
| 3 | Riepilogo esecutivo | ✅ |
| 4 | Tabella conteggi per sezione | ✅ |
| 5 | Elenco rilievi (NC e Parziali) | ✅ se NC > 0 |
| 6 | Dettaglio sezioni | ✅ |
| 7 | Note finali visita | ✅ se compilate |
| 8 | Spazio firme | ✅ |
| 9 | Footer (ogni pagina) | ✅ |

---

## 5. Note sulle macroaree e struttura del PDF

Le macroaree `Anagrafica e contesto visita` e `Rilievi conclusivi` non sono sezioni checklist del template JSON. Si traducono nel PDF come segue:

- **Anagrafica e contesto visita** → **Copertina** (§6): i dati cliente, sede, tecnico, data sono campi dell'entità `visite`, non domande compilate dalla checklist.
- **Rilievi conclusivi** → composizione automatica di: riepilogo NC calcolato (§8-9), elenco rilievi (§10), note finali visita (§12). Non è una sezione con domande strutturate.

Il corpo del PDF con domande e risposte (§11) corrisponde alle 7 sezioni operative del template (SEZ-01 → SEZ-07).

---

## 6. Campi copertina

| Campo | Fonte | Esempio fittizio |
|---|---|---|
| Titolo documento | Statico | "Verbale di sopralluogo sicurezza sul lavoro" |
| Nome sistema | Statico | "SafeCheck" |
| Numero verbale | `verbali_pdf.numero_verbale` | "VRB-2026-0042" |
| Document ID | `verbali_pdf.document_id` | "VST-A1B2C3D4" |
| Versione documento | `verbali_pdf.versione_documento` | "1.0" |
| Cliente | `clienti.ragione_sociale` | "Cliente Demo Sicurezza S.r.l." |
| Sede | `sedi.nome_sede` + indirizzo | "Sede Demo — Via Roma 1, 00100 Roma RM" |
| Referente cliente | `visite.referente_cliente` | "Mario Rossi (Referente Demo)" |
| Tecnico incaricato | `utenti_profili.nome` + cognome | "Tecnico Demo RSPP" |
| Data sopralluogo | `visite.data_visita` | "25 giugno 2026" |
| Data generazione verbale | `verbali_pdf.generato_il` | "25 giugno 2026" |
| Versione template | `template_versioni.versione` | "verbale-sopralluogo-sicurezza-lavoro-v1" |

**Non compaiono in copertina:**
- SHA256 o qualsiasi hash
- URL del file PDF
- Note interne del tecnico
- Dati sanitari
- Codici fiscali

---

## 7. Disclaimer correzioni suggerite

Il disclaimer compare **subito dopo la copertina**, prima di qualsiasi rilievo. Testo proposto:

> **Nota sulle indicazioni operative**
>
> Le correzioni e le indicazioni operative riportate in questo verbale sono suggerimenti di supporto redatti dal tecnico incaricato sulla base dei rilievi effettuati durante il sopralluogo. Tali indicazioni non sostituiscono valutazioni tecniche specialistiche, progettazioni, verifiche di conformità, pareri legali o adempimenti specifici a carico del datore di lavoro e/o del committente. La responsabilità dell'adozione delle misure di sicurezza resta in capo ai soggetti obbligati ai sensi della normativa vigente.

> **Nota sul sistema SafeCheck**
>
> SafeCheck supporta il tecnico nella raccolta strutturata dei rilievi e nella generazione del verbale di sopralluogo. Non certifica né attesta la conformità normativa del cliente o del datore di lavoro. La valutazione professionale dei rilievi, la loro classificazione e le indicazioni operative restano in capo al tecnico utilizzatore.

---

## 8. Riepilogo esecutivo

Il riepilogo esecutivo è la seconda sezione del documento dopo il disclaimer. Deve fornire una lettura immediata dell'esito del sopralluogo.

### 8.1 Testo introduttivo

Testo fisso con campi variabili:

> In data [DATA_SOPRALLUOGO] è stato effettuato un sopralluogo presso [SEDE] — [CLIENTE]. Il sopralluogo ha riguardato [N_SEZIONI] aree tematiche per un totale di [N_DOMANDE] punti di verifica.

### 8.2 Tabella riepilogo globale

| Esito | Conteggio | % sul totale verificato |
|---|---|---|
| ✅ Conforme | N | % |
| ⚠️ Parzialmente Conforme | N | % |
| ❌ Non Conforme | N | % |
| 🔲 Non Verificato | N | % |
| — Non Applicabile | N | (escluso dal calcolo %) |

**Regole di calcolo:**
- Il totale verificato = Conformi + Parzialmente Conformi + Non Conformi + Non Verificati
- Non Applicabili non entrano nel denominatore della percentuale
- Parzialmente Conforme pesa come NC ai fini del semaforo di esito globale

### 8.3 Semaforo esito globale

| Soglia NC+Parziali | Esito |
|---|---|
| 0 | ✅ Nessuna non conformità rilevata |
| 1-10% del totale verificato | ⚠️ Non conformità lievi |
| 11-30% | ⚠️ Non conformità significative |
| > 30% | ❌ Non conformità rilevanti — intervento prioritario |

*(Le soglie sono indicative e DA VERIFICARE ai fini di una classificazione normativa.)*

---

## 9. Tabella conteggi per sezione

Dopo il riepilogo globale, una tabella riepiloga i conteggi divisi per sezione:

| Sezione | C | PC | NC | NV | NA | Totale |
|---|---|---|---|---|---|---|
| Organizzazione della sicurezza | 5 | 1 | 2 | 0 | 1 | 9 |
| Documentazione di sicurezza | 4 | 0 | 3 | 1 | 2 | 10 |
| ... | | | | | | |
| **TOTALE** | **N** | **N** | **N** | **N** | **N** | **N** |

*Legenda: C = Conforme, PC = Parzialmente Conforme, NC = Non Conforme, NV = Non Verificato, NA = Non Applicabile*

---

## 10. Elenco rilievi (NC e Parziali)

L'elenco rilievi è una sezione dedicata che raccoglie in modo compatto solo i punti critici, prima del dettaglio sezioni.

### 10.1 Ordine di presentazione

1. **Non Conformi** — ordinati per sezione, poi per ordine domanda
2. **Parzialmente Conformi** — dopo tutti i NC
3. **Non Verificati** — sezione separata, solo se NV > 0
4. **Non Applicabili** — non compaiono in questa sezione

### 10.2 Struttura di ogni rilievo

```
[SEZIONE] — [ID DOMANDA]
Punto di verifica: [TESTO DOMANDA]
Esito: ❌ Non Conforme / ⚠️ Parzialmente Conforme
Osservazione: [osservazioni del tecnico, stampabile]
Azione suggerita: [correzione_suggerita_finale, stampabile — solo se confermata dal tecnico]
```

### 10.3 Regole

- `note_tecnico` (internal_only: true) non compaiono mai
- Nel PDF compare solo `correzione_suggerita_finale`: il testo che il tecnico ha confermato o modificato durante la compilazione. La `correzione_default` del template è solo un suggerimento iniziale interno, **mai stampata automaticamente**.
- `osservazioni` è stampabile
- I campi `rif_normativo` e `rif_normativo_certo` sono interni al template. **Nessun riferimento normativo, certo o incerto, compare nel PDF MVP.** In particolare, qualsiasi testo `DA VERIFICARE NORMATIVAMENTE` non deve mai essere incluso nel documento stampato.
- Se `correzione_suggerita_finale` è vuota (il tecnico non ha confermato né modificato il suggerimento), la riga "Azione suggerita" non compare nel PDF.
- Ogni rilievo è separato visivamente (bordo, sfondo leggero o separatore)

---

## 11. Dettaglio sezioni

Dopo l'elenco rilievi, il documento presenta il dettaglio completo di ogni sezione.

### 11.1 Intestazione sezione

```
[NUMERO SEZIONE] — [NOME SEZIONE]
[N] punti verificati — [N] Conformi — [N] NC — [N] Parziali — [N] NV — [N] NA
```

### 11.2 Colonne tabella domande

| # | Punto di verifica | Esito | Osservazioni | Azione suggerita |
|---|---|---|---|---|

### 11.3 Badge stato

| Valore | Badge |
|---|---|
| `CONFORME` | ✅ Conforme |
| `PARZIALMENTE_CONFORME` | ⚠️ Parziale |
| `NON_CONFORME` | ❌ Non Conforme |
| `NON_VERIFICATO` | 🔲 NV |
| `NON_APPLICABILE` | — NA |

### 11.4 Regole visualizzazione

- Le righe NA possono essere presentate in grigio chiaro o con font ridotto per de-enfatizzare
- Le righe NC sono in evidenza (bordo rosso leggero o testo in grassetto)
- Le righe Parziali sono in evidenza (bordo arancione leggero)
- Le righe Conformi sono standard
- Le righe NV sono in evidenza neutra
- `note_tecnico` non compare mai in questa tabella
- `osservazioni` compare nella colonna "Osservazioni" solo se compilata
- Nella colonna "Azione suggerita" compare **solo** `correzione_suggerita_finale` (testo confermato o modificato dal tecnico). La `correzione_default` del template non viene mai stampata automaticamente.
- I campi `rif_normativo`, `rif_normativo_certo` e qualsiasi testo `DA VERIFICARE NORMATIVAMENTE` non compaiono mai nel PDF.

### 11.5 Page break sezioni

- Ogni sezione inizia su una nuova pagina **oppure** con almeno 6 righe disponibili nella pagina corrente
- Le righe della tabella non vengono spezzate tra pagina e pagina
- Se una singola riga (domanda + osservazioni lunghe) è più alta di mezza pagina, va su pagina propria

---

## 12. Note finali visita

Se `visite.note_finali_visita` è compilato, compare una sezione dedicata prima delle firme:

```
NOTE CONCLUSIVE DEL TECNICO

[testo note_finali_visita]
```

Le note finali sono:
- testo libero del tecnico;
- stampabili e visibili al cliente;
- non corrispondenti a nessuna domanda del template;
- non contenenti note interne.

Se `note_finali_visita` è vuoto, la sezione non compare.

---

## 13. Spazio firme

Spazio per firme non digitali al fondo del documento:

```
Il Tecnico incaricato                    Il Referente del cliente / Datore di lavoro

_______________________________          _______________________________
[NOME TECNICO]                           [NOME REFERENTE]
Data: ___________________                Data: ___________________
```

**Regole:**
- Lo spazio firme è sempre presente, anche se il verbale non viene firmato fisicamente
- Le firme non sono digitali (fuori perimetro MVP)
- Il nome del tecnico è stampato; il nome del referente è stampato se disponibile, altrimenti riga vuota

---

## 14. Footer (ogni pagina)

Il footer compare su ogni pagina del documento, compresi copertina e pagine interne.

### 14.1 Contenuto footer

| Campo | Esempio fittizio |
|---|---|
| Nome sistema | SafeCheck |
| Numero verbale | VRB-2026-0042 |
| Document ID | VST-A1B2C3D4 |
| Versione documento | v1.0 |
| Data generazione | 25/06/2026 |
| Paginazione | Pagina 3 di 12 |

### 14.2 Layout footer

```
SafeCheck | VRB-2026-0042 | Doc ID: VST-A1B2C3D4 | v1.0 | Gen: 25/06/2026 | Pag. 3 di 12
```

### 14.3 Ciò che NON compare nel footer

- SHA256 o qualsiasi hash crittografico
- URL pubblici
- Note interne
- Dati personali dei lavoratori
- Codici fiscali

---

## 15. Regole di layout

| Parametro | Valore |
|---|---|
| Formato | A4 (210 × 297 mm) |
| Orientamento | Portrait |
| Margini | Top 20mm, Bottom 25mm, Left 20mm, Right 20mm |
| Font principale | Inter o Helvetica, fallback sans-serif |
| Font dimensione corpo | 10pt |
| Font dimensione intestazioni sezione | 13pt bold |
| Font dimensione titolo copertina | 20pt bold |
| Interlinea corpo | 1.4 |
| Header fisso | Sì, su ogni pagina tranne copertina (nome sistema + nome cliente) |
| Footer fisso | Sì, su ogni pagina |
| Righe non spezzate | Le righe delle tabelle non vengono spezzate tra pagine |
| Testi lunghi | Le celle con testo lungo espandono la riga in altezza |
| Tabelle lunghe | Le tabelle che superano una pagina ripetono l'intestazione colonne |
| Page break | Ogni sezione inizia con almeno 6 righe disponibili o su nuova pagina |
| Dimensione file target | < 500 KB senza allegati/foto |
| Dimensione file massima accettabile | < 2 MB |

---

## 16. Criteri di accettazione PDF

I seguenti criteri devono essere verificati manualmente dopo lo spike PDF:

| Criterio | Metodo di verifica |
|---|---|
| Il PDF si genera senza errori JavaScript/Node | Console di sviluppo |
| Il file è apribile in Adobe Acrobat Reader | Apertura manuale |
| Il file è apribile nei principali browser (Chrome, Firefox) | Apertura manuale |
| Nessun testo tagliato in nessuna cella | Revisione visiva ogni pagina |
| Nessuna tabella con colonne sovrapposte | Revisione visiva |
| Header e footer non si sovrappongono al contenuto | Revisione visiva |
| I page break sono in posizioni accettabili | Revisione visiva |
| Il riepilogo NC è corretto rispetto ai dati | Verifica numerica manuale |
| SHA256 non compare nel footer né altrove nel PDF | Ricerca testo nel PDF |
| Il disclaimer correzioni è presente | Verifica visiva |
| Il disclaimer prodotto (SafeCheck non certifica conformità) è presente | Verifica visiva |
| Le `note_tecnico` non compaiono | Verifica visiva su ogni domanda |
| Nessun campo `rif_normativo` o testo `DA VERIFICARE NORMATIVAMENTE` nel PDF | Ricerca testo nel PDF |
| Nessuna `correzione_default` grezza nel PDF (solo `correzione_suggerita_finale` confermata) | Verifica visiva NC |
| Il `Document ID` è presente nel footer | Verifica visiva footer |
| La dimensione del file è < 500 KB | Verifica dimensione file |
| Il tempo di generazione è < 5 secondi in locale | Misurazione con console.time |
| Il PDF è presentabile a un cliente senza modifiche manuali | Giudizio del tecnico |

---

## Checklist qualità file

- [ ] Il PDF non usa URL pubblici per accesso al file
- [ ] SHA256 non è menzionato come campo stampabile in nessuna sezione
- [ ] Il nome del prodotto è neutro e marcato come provvisorio
- [ ] Gli esempi usano solo dati fittizi (Cliente Demo, Tecnico Demo, ecc.)
- [ ] Le `note_tecnico` sono esplicitamente escluse dal contenuto stampabile
- [ ] Il disclaimer correzioni è presente e formulato correttamente
- [ ] Il disclaimer prodotto (non certifica conformità) è presente
- [ ] Nel PDF compare solo `correzione_suggerita_finale`, mai `correzione_default` grezza
- [ ] I campi `rif_normativo` e testo `DA VERIFICARE NORMATIVAMENTE` sono esclusi dal PDF
- [ ] Il `Document ID` è presente nel footer
- [ ] Il footer contiene solo i campi consentiti
- [ ] Le note finali visita sono a livello visita, non come sezione del template
- [ ] `Anagrafica e contesto visita` è spiegata come copertina/entità visita
- [ ] `Rilievi conclusivi` è spiegata come composizione automatica
- [ ] Lo stato del file è DRAFT OPERATIVO
- [ ] La data è aggiornata a 2026-06-25
