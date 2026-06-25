# contratto-mvp.v0.1.md
# SafeCheck — Contratto di perimetro MVP

**Versione:** 0.1.2  
**Data:** 2026-06-25  
**Stato:** DRAFT OPERATIVO — baseline candidata per spike PDF statico, non approvata per sviluppo applicativo  
**Autore:** Progetto personale clean-room  

> **Nota nome:** `SafeCheck` è nome provvisorio di lavoro, non ancora verificato come marchio, dominio o denominazione commerciale. Va trattato come placeholder fino a verifica separata.

---

## 1. Scopo del documento

Questo file definisce il perimetro contrattuale del MVP di SafeCheck. Il suo scopo primario è **impedire lo scope creep** durante le fasi di sviluppo. Ogni funzione non esplicitamente elencata come inclusa è da considerarsi esclusa. Qualsiasi proposta di aggiunta deve essere valutata rispetto a questo documento prima di essere implementata.

Il documento è da considerarsi vincolante per tutte le decisioni di sviluppo fino a revisione esplicita e versionata.

---

## 2. Obiettivo prodotto

SafeCheck è un sistema personale per la produzione di **verbali digitali di sopralluogo sicurezza sul lavoro**, partendo da dati strutturati raccolti durante una visita.

**Problema risolto:**  
Eliminare la rielaborazione manuale del verbale post-visita. Il tecnico compila i dati una volta sola, il sistema genera automaticamente il documento finale senza ulteriore lavoro di redazione.

**Risultato atteso:**  
Un verbale PDF professionale, completo, conforme al contenuto rilevato in sopralluogo, scaricabile in modo sicuro, prodotto senza aprire Excel.

**Non è:**
- un sistema di gestione delle scadenze;
- un sistema di pianificazione delle visite;
- un sistema di firma digitale;
- un portale per clienti;
- un sistema di ticketing NC;
- una piattaforma SaaS.

---

## 3. Principio clean-room e titolarità personale

Il progetto SafeCheck è un **asset personale originale**. È sviluppato:

- su dispositivi personali;
- fuori dall'orario lavorativo;
- con account personali;
- in repository personale;
- senza riuso di checklist, verbali, template, format o documenti di terzi o dell'azienda di riferimento professionale.

La titolarità intellettuale è esclusivamente personale. Eventuali usi futuri da parte di aziende o terzi richiedono accordo scritto separato.

Tutto il contenuto del repository (codice, template, seed data, documentazione) deve essere originale o rilasciato sotto licenza compatibile.

---

## 4. Obiettivo MVP-A — Validazione tecnica personale

### Definizione
MVP-A è il perimetro **ultra-minimo** per verificare che il flusso tecnico funzioni end-to-end. Non richiede clienti reali, non richiede dati reali, non richiede utenti multipli.

### Finalità
Dimostrare a se stessi che il sistema funziona: login → compilazione → generazione PDF → download sicuro.

### Requisiti funzionali inclusi

| Funzione | Inclusa |
|---|---|
| Login con email e password | ✅ |
| Lista visite (tabella semplice) | ✅ |
| Nuova visita con dati precaricati (seed) | ✅ |
| Compilazione template `verbale-sopralluogo-sicurezza-lavoro-v1` | ✅ |
| Autosave online durante compilazione | ✅ |
| Riepilogo NC per visita | ✅ |
| Generazione PDF dal template compilato | ✅ |
| Download PDF autenticato (route protetta, bucket privato) | ✅ |
| Audit log del download | ✅ |

### Requisiti esclusi da MVP-A

- CRUD clienti/sedi da UI;
- filtri e ricerca visite;
- gestione utenti da UI;
- salvataggio locale/offline;
- qualsiasi funzione non elencata sopra.

### Dati

- Solo dati fittizi precaricati (`seed`). Per la baseline 0.1.2, MVP-A e MVP-B usano solo dati fittizi o casi simulati realistici. Qualsiasi uso di dati reali, anche legittimamente disponibili e non aziendali, è escluso da questa baseline e richiede revisione separata del perimetro privacy, contrattuale e operativo.
- Un solo tecnico;
- 1-2 visite di test;
- Nessun cliente reale;
- Nessun dato sanitario;
- Nessun mansionario.

### Criteri di successo MVP-A

1. Il flusso completo (login → compilazione → PDF → download) funziona senza errori bloccanti.
2. Il PDF generato è leggibile e non contiene testi tagliati o tabelle illeggibili.
3. Il download PDF avviene tramite route autenticata (non URL pubblico).
4. Il tempo di generazione PDF è inferiore a 5 secondi in locale.
5. Nessuna risposta compilata viene persa tra autosave e generazione.
6. Il PDF contiene tutti i dati della visita seed: intestazione, sezioni, NC, riepilogo, note finali.
7. SHA256 non compare nel footer del PDF.

---

## 5. Obiettivo MVP-B — Pilota personale controllato

### Definizione
MVP-B è il perimetro per un **pilota personale controllato** con casi simulati realistici. Include funzioni minime aggiuntive per rendere il sistema usabile da più di una visita fittizia e da più di un utente di test.

### Finalità
Validare che il sistema sia utilizzabile in condizioni operative simulate, con volumi e complessità realistici.

### Requisiti funzionali inclusi (aggiuntivi rispetto a MVP-A)

| Funzione | Inclusa |
|---|---|
| CRUD minimo clienti (nome, indirizzo, referente) | ✅ |
| CRUD minimo sedi (nome, indirizzo, cliente) | ✅ |
| Filtro base visite per cliente o data | ✅ |
| Salvataggio locale leggero (localStorage o stato React) | ✅ |
| Secondo utente tecnico (creato direttamente via seed/script, non da UI) | ✅ |
| Metriche operative (tempo compilazione, PDF generati) — solo log interno | ✅ |

### Dati

- Massimo 5 visite simulate;
- Massimo 2 tecnici di test;
- Almeno 3 clienti/sedi fittizi;
- **Solo dati fittizi o casi simulati realistici.** Qualsiasi uso di dati reali, anche legittimamente disponibili e non aziendali, è escluso da questa baseline e richiede revisione separata del perimetro privacy, contrattuale e operativo.

### Criteri di successo MVP-B

1. 5 visite complete generate senza errori.
2. 2 tecnici operativi senza conflitti di sessione.
3. CRUD clienti/sedi funzionante e stabile.
4. Filtro visite per cliente funzionante.
5. Tempo medio di compilazione inferiore al metodo Excel precedente (riferimento soggettivo dichiarato dal tecnico pilota).
6. Nessun dato perso tra sessioni diverse.
7. PDF di qualità presentabile per tutte le 5 visite.
8. Nessun caso in cui il tecnico è costretto a riaprire Excel per completare il lavoro.

---

## 6. Differenza MVP-A / MVP-B

| Dimensione | MVP-A | MVP-B |
|---|---|---|
| **Finalità** | Validazione tecnica personale | Pilota personale controllato |
| **Utenti** | 1 tecnico (il progettista) | 2 tecnici di test |
| **Dati** | Solo fittizi/precaricati | Fittizi + eventuale reale autorizzato |
| **Visite** | 1-2 seed | 5 simulate |
| **Schermate** | 6 schermate core | +2 schermate CRUD |
| **Offline** | Non previsto | Salvataggio locale leggero |
| **PDF** | Generato da seed | Generato da compilazione reale |
| **Clienti/sedi** | Precaricati da seed | CRUD minimo da UI |
| **Criteri successo** | Flusso end-to-end funzionante | Usabilità reale, nessun ritorno a Excel |
| **Rischi accettati** | UX grezza, layout non ottimizzato | Dati non reali, volumi ridotti |

---

## 7. Stati visita

Il sistema usa solo questi tre stati:

| Stato | Significato |
|---|---|
| `IN_CORSO` | Visita avviata, compilazione in corso, dati non finalizzati |
| `COMPLETATA` | Compilazione finalizzata, dati bloccati, PDF non ancora generato |
| `VERBALE_GENERATO` | PDF generato e disponibile per il download |

### Perché `PIANIFICATA` è esclusa dal MVP

Lo stato `PIANIFICATA` implica un sistema di agenda, notifiche, calendario o gestione degli impegni futuri. Questo è fuori perimetro MVP. La visita esiste nel sistema dal momento in cui il tecnico inizia a compilarla, non prima.

---

## 8. Schermate incluse MVP-A

Il sistema MVP-A prevede **al massimo 7 schermate**. Nessuna schermata aggiuntiva può essere introdotta senza modifica esplicita di questo documento.

### `/login`
- **Obiettivo:** Autenticare il tecnico
- **Utente:** Tecnico (ruolo unico in MVP-A)
- **Dati:** Email, password
- **Azioni:** Login
- **Esclusioni:** Registrazione, recupero password, OAuth, SSO

### `/visite`
- **Obiettivo:** Lista delle visite dell'utente autenticato
- **Utente:** Tecnico
- **Dati:** Elenco visite con cliente, sede, data, stato
- **Azioni:** Apri visita esistente, crea nuova visita
- **Esclusioni:** Filtri, ricerca, ordinamenti multipli, paginazione avanzata

### `/visite/nuova`
- **Obiettivo:** Inizializzare una nuova visita
- **Utente:** Tecnico
- **Dati:** Selezione cliente/sede (da seed in MVP-A), data, tecnico assegnato
- **Azioni:** Crea visita → redirect a `/visite/[id]/compila`
- **Esclusioni:** CRUD clienti/sedi (MVP-B), caricamento allegati

### `/visite/[id]/compila`
- **Obiettivo:** Compilazione della checklist della visita
- **Utente:** Tecnico
- **Dati:** Template caricato, risposte esistenti, sezioni, domande
- **Azioni:** Rispondere a ogni domanda (conforme/NC/parziale/NV/NA), inserire osservazioni, correzioni, autosave
- **Esclusioni:** Upload foto, firma digitale, note tecnico visibili al cliente, mansionario

### `/visite/[id]/riepilogo`
- **Obiettivo:** Revisione delle NC prima della generazione PDF
- **Utente:** Tecnico
- **Dati:** Elenco NC per sezione, conteggi per stato, osservazioni, correzioni
- **Azioni:** Tornare a compilazione, procedere a generazione PDF, finalizzare visita
- **Esclusioni:** Modifica stati NC dopo finalizzazione, assegnazione NC a responsabili

### `/visite/[id]/verbale`
- **Obiettivo:** Conferma generazione e download PDF
- **Utente:** Tecnico
- **Dati:** Stato generazione PDF, Document ID, data generazione, versione
- **Azioni:** Genera PDF (se non ancora generato), scarica PDF
- **Esclusioni:** Anteprima inline nel browser, condivisione link, invio email

### `/visite/[id]` *(opzionale)*
- **Obiettivo:** Dettaglio visita (riepilogo metadati)
- **Utente:** Tecnico
- **Dati:** Anagrafica visita, stato, storico PDF generati
- **Azioni:** Navigazione verso compilazione o verbale
- **Esclusioni:** Editing post-finalizzazione, storico modifiche

---

## 9. Schermate aggiuntive MVP-B

### `/clienti`
- **Obiettivo:** Lista clienti
- **Azioni:** Visualizza, crea nuovo, modifica, elimina (soft delete)

### `/clienti/[id]/sedi`
- **Obiettivo:** Lista e gestione sedi per cliente
- **Azioni:** Visualizza, crea, modifica, elimina sede

*(La schermata `/visite` acquisisce un filtro base per cliente o data)*

---

## 10. Note sulle macroaree del template

Le macroaree originariamente elencate nella fase di analisi includono `Anagrafica e contesto visita` e `Rilievi conclusivi`. Queste **non sono sezioni della checklist** nel template JSON:

- **Anagrafica e contesto visita** è un blocco dati dell'entità `visite` nel database (cliente, sede, tecnico, data, referente). Viene popolato alla creazione della visita e forma la copertina del PDF; non contiene domande da compilare.
- **Rilievi conclusivi** non è una sezione autonoma. Deriva dalla composizione automatica di: (a) riepilogo NC calcolato dalle risposte, (b) campo `note_finali_visita` compilato liberamente dal tecnico a livello visita. Entrambi compaiono in sezioni dedicate del PDF ma non sono sezioni del template con domande strutturate.

Il template JSON `verbale-sopralluogo-sicurezza-lavoro-v1` contiene quindi 7 sezioni operative di verifica (SEZ-01 → SEZ-07), non 9.

---

## 11. Entità concettuali MVP-A

Le seguenti sono entità concettuali, non migration SQL. La struttura fisica verrà definita nello schema dati successivo allo spike PDF.

### `clienti`
- **Scopo:** Anagrafica cliente
- **Campi minimi:** id, ragione_sociale, indirizzo, referente, created_at
- **Relazioni:** ha_molte → sedi
- **Note:** In MVP-A precaricata da seed, nessun CRUD da UI

### `sedi`
- **Scopo:** Sede operativa oggetto del sopralluogo
- **Campi minimi:** id, cliente_id, nome_sede, indirizzo, created_at
- **Relazioni:** appartiene_a → clienti; ha_molte → visite
- **Note:** In MVP-A precaricata da seed

### `utenti_profili`
- **Scopo:** Profilo tecnico collegato all'account di autenticazione
- **Campi minimi:** id, auth_user_id, nome, cognome, ruolo, created_at
- **Relazioni:** ha_molte → visite (come tecnico assegnato)
- **Note:** Ruolo in MVP-A è sempre `tecnico`; nessun CRUD da UI

### `template_checklist`
- **Scopo:** Definizione del template (metadati, versione, struttura sezioni/domande)
- **Campi minimi:** id, nome, versione, stato (attivo/archiviato), created_at
- **Relazioni:** ha_molte → template_versioni; ha_molte → visite
- **Note:** In MVP-A un solo template attivo: `verbale-sopralluogo-sicurezza-lavoro-v1`

### `template_versioni`
- **Scopo:** Contenuto JSON della versione specifica del template
- **Campi minimi:** id, template_id, versione, json_content, created_at
- **Relazioni:** appartiene_a → template_checklist
- **Note:** Il JSON è immutabile dopo pubblicazione; le visite referenziano la versione usata

### `visite`
- **Scopo:** Istanza di un sopralluogo
- **Campi minimi:** id, cliente_id, sede_id, tecnico_id, template_versione_id, data_visita, stato, note_finali_visita, created_at, updated_at
- **Relazioni:** appartiene_a → clienti, sedi, utenti_profili, template_versioni; ha_molte → risposte; ha_uno → verbali_pdf
- **Note:** `note_finali_visita` è campo libero a livello visita, non sezione del template

### `risposte`
- **Scopo:** Risposta del tecnico a ogni singola domanda del template
- **Campi minimi:** id, visita_id, domanda_id, valore_risposta, osservazioni, correzione_suggerita, created_at, updated_at
- **Relazioni:** appartiene_a → visite
- **Note:** `osservazioni` e `correzione_suggerita` sono stampabili nel PDF; nessuna nota tecnico interna in questa tabella (le note tecnico sono nel template JSON, non nelle risposte)

### `riepiloghi_sezione`
- **Scopo:** Aggregazione pre-calcolata dei conteggi per sezione (opzionale, per performance)
- **Campi minimi:** id, visita_id, sezione_id, totale_conformi, totale_nc, totale_parziali, totale_nv, totale_na, updated_at
- **Relazioni:** appartiene_a → visite
- **Note:** Può essere derivato dalle risposte; utile per PDF e riepilogo senza ricalcolo real-time

### `verbali_pdf`
- **Scopo:** Registro dei PDF generati per ogni visita
- **Campi minimi:** id, visita_id, numero_verbale, document_id, versione_documento, percorso_bucket, pdf_file_hash (SHA256, interno), source_data_hash (SHA256, interno), generato_da, generato_il, created_at
- **Relazioni:** appartiene_a → visite
- **Note:** `pdf_file_hash` e `source_data_hash` sono metadati interni, mai stampati nel PDF; il file è in bucket privato, non accessibile tramite URL pubblico

### `audit_log`
- **Scopo:** Tracciamento operazioni sensibili (generazione PDF, download PDF, login)
- **Campi minimi:** id, utente_id, azione, entita_tipo, entita_id, ip_address, user_agent, created_at
- **Relazioni:** appartiene_a → utenti_profili
- **Note:** Obbligatorio per ogni download PDF; obbligatorio per ogni generazione PDF

---

## 12. Funzioni escluse senza eccezioni

Le seguenti funzioni sono escluse dal MVP e non possono essere aggiunte senza revisione formale di questo documento:

- **Dashboard** con KPI, grafici, metriche aggregate
- **Gestione utenti da UI** (creazione, modifica, disattivazione account)
- **Portale cliente** o qualsiasi accesso per soggetti esterni al tecnico
- **Template builder da UI** (la modifica dei template avviene solo tramite JSON e seed)
- **Foto e allegati** ai rilievi
- **Firma digitale** (anche legalmente valida o tramite OTP)
- **SaaS** (multi-tenant, onboarding clienti, fatturazione, piani)
- **Notifiche email automatiche** (invio verbale al cliente, promemoria scadenze)
- **Tracciamento NC con stato e scadenza** (assegnazione responsabile, workflow approvazione)
- **Mansionario lavoratori** (elenco addetti, ruoli, attestati)
- **Integrazione DVR/DUVRI/PEE/formazione/scadenze**
- **PWA offline-first completa** (service worker, cache, sync in background)
- **App mobile nativa** (iOS/Android)
- **URL pubblici per PDF** (i PDF devono essere sempre in bucket privato con download autenticato)
- **SHA256 nel footer PDF** (gli hash sono solo metadati interni nel database)

---

## 13. Criteri di successo MVP-A

I seguenti criteri devono essere verificati e documentati prima di dichiarare MVP-A completato:

1. ✅ Login funzionante con email e password su Supabase Auth
2. ✅ Lista visite mostra le visite del tecnico autenticato
3. ✅ Nuova visita creabile con dati seed precaricati
4. ✅ Compilazione completa del template `verbale-sopralluogo-sicurezza-lavoro-v1` senza errori
5. ✅ Autosave salva ogni risposta entro 3 secondi dalla modifica
6. ✅ Riepilogo NC mostra correttamente conteggi per sezione e totale
7. ✅ PDF generato senza errori da dati compilati
8. ✅ PDF scaricabile solo tramite route autenticata (verifica: URL diretto al bucket restituisce 403)
9. ✅ Audit log registra ogni generazione e ogni download
10. ✅ SHA256 non compare nel footer del PDF
11. ✅ Il PDF è apribile e leggibile in Adobe Reader e nei principali browser

---

## 14. Criteri di successo MVP-B

1. ✅ 5 visite complete generate senza perdita dati
2. ✅ 2 tecnici operativi in sessioni separate senza conflitti
3. ✅ CRUD clienti: creazione, modifica, visualizzazione funzionanti
4. ✅ CRUD sedi: creazione, modifica, associazione a cliente funzionanti
5. ✅ Filtro visite per cliente funzionante
6. ✅ Nessun caso di ritorno a Excel dichiarato dai tecnici di test
7. ✅ Tempo medio compilazione visita completa < 45 minuti (DA VERIFICARE con baseline Excel)
8. ✅ PDF di qualità presentabile su tutte le 5 visite, inclusa visita con molte NC e visita con note lunghe
9. ✅ Tutti i PDF in bucket privato, nessun URL pubblico

---

## 15. Criteri di fallimento

I seguenti eventi costituiscono fallimento del MVP e richiedono blocco dello sviluppo e analisi:

| Evento | Livello |
|---|---|
| Perdita di dati compilati (risposte non salvate) | BLOCCANTE |
| PDF non generabile | BLOCCANTE |
| PDF con testo tagliato, tabelle illeggibili o layout non presentabile | BLOCCANTE |
| Download PDF tramite URL pubblico non autenticato | BLOCCANTE |
| SHA256 stampato nel footer del PDF | BLOCCANTE |
| Tecnico costretto a riaprire Excel per completare il lavoro | ALTO |
| Tempo di compilazione superiore al metodo Excel | ALTO |
| Crash dell'applicazione durante compilazione | ALTO |
| Autosave non funzionante (risposte perse al reload) | ALTO |
| Dati reali usati senza autorizzazione scritta | BLOCCANTE (privacy/IP) |
| File Excel o dati aziendali nel repository | BLOCCANTE (clean-room) |
| `correzione_default` grezza stampata nel PDF senza conferma del tecnico | BLOCCANTE |
| Riferimenti normativi `DA VERIFICARE` stampati nel PDF | ALTO |
| `note_tecnico` (internal_only) visibili nel PDF | BLOCCANTE |

---

## 16. Regole anti-scope-creep

Le seguenti regole sono operative e vincolanti:

1. **Nessuna funzione non elencata in questo documento può essere implementata** senza modifica versionata di questo file.
2. **"Sarebbe utile aggiungere…" non è una giustificazione sufficiente** per modificare il perimetro MVP.
3. **Qualsiasi richiesta di nuova funzione durante MVP-A o MVP-B** va registrata nel backlog e valutata dopo il completamento della fase corrente.
4. **Il feedback raccolto durante il pilota** va nel backlog, non nelle sprint correnti.
5. **Le funzioni escluse restano escluse** anche se tecnicamente facili da aggiungere.
6. **Il PDF deve rimanere il prodotto principale.** Qualsiasi funzione che non serve a produrre un verbale migliore è fuori perimetro.
7. **Lo spike PDF è prerequisito assoluto** per qualsiasi sviluppo applicativo. Senza spike approvato, non si apre Claude Code per sviluppo app.
8. **La clean-room è non negoziabile.** Nessun asset aziendale, dato reale, cliente reale o contenuto non originale entra nel repository senza revisione esplicita di `docs/clean-room-ip-policy.md`.
9. **`correzione_default` non è stampata automaticamente.** Nel PDF compare solo `correzione_suggerita_finale`, ovvero il testo confermato o modificato dal tecnico durante la compilazione. La `correzione_default` è solo un suggerimento interno iniziale visibile al tecnico nell'interfaccia.
10. **I riferimenti normativi non compaiono nel PDF.** I campi `rif_normativo` e `rif_normativo_certo` sono interni al template; qualsiasi testo `DA VERIFICARE NORMATIVAMENTE` è solo per uso interno e non viene mai stampato.

---

## Checklist qualità file

- [ ] Il file è coerente con MVP-A/MVP-B come definiti
- [ ] Non contiene funzioni escluse come incluse
- [ ] Non usa URL pubblici per PDF
- [ ] Non stampa SHA256 nel footer
- [ ] Non contiene dati reali o riferimenti aziendali
- [ ] Distingue note interne da contenuti stampabili
- [ ] La titolarità del progetto è descritta come personale clean-room
- [ ] Non prevede pilota su clienti aziendali reali
- [ ] I criteri di successo sono misurabili
- [ ] I criteri di fallimento includono violazioni privacy/IP
- [ ] `Anagrafica e contesto visita` è spiegata come entità visita, non sezione template
- [ ] `Rilievi conclusivi` è spiegato come composizione automatica, non sezione template
- [ ] `correzione_default` non è stampata; nel PDF compare solo `correzione_suggerita_finale`
- [ ] I riferimenti normativi sono marcati come interni e mai stampati nel PDF
- [ ] Il nome SafeCheck è marcato come provvisorio
- [ ] Lo stato del file è DRAFT OPERATIVO, non APPROVATO
- [ ] La data è aggiornata a 2026-06-25
