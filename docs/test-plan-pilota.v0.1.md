# test-plan-pilota.v0.1.md
# SafeCheck — Piano di test MVP-A e Pilota Personale Controllato MVP-B

**Versione:** 0.1.2  
**Data:** 2026-06-25  
**Stato:** DRAFT OPERATIVO — baseline candidata per spike PDF statico, non approvata per sviluppo applicativo  
**Dipende da:** `contratto-mvp.v0.1.md`, `spike-pdf-spec.md`  

> **Nota nome:** `SafeCheck` è nome provvisorio di lavoro, non ancora verificato come marchio, dominio o denominazione commerciale.

---

## 1. Scopo del test

Questo documento definisce il piano di test per validare MVP-A e MVP-B di SafeCheck.

**MVP-A** verifica che il flusso tecnico funzioni end-to-end con dati fittizi.  
**MVP-B** verifica che il sistema sia usabile in condizioni operative simulate (pilota personale controllato).

Il test plan **non prevede**:
- test su dati reali senza autorizzazione scritta;
- test su clienti reali aziendali;
- test su dati sanitari;
- test del mansionario;
- feature non incluse nel perimetro MVP definito in `contratto-mvp.v0.1.md`.

---

## 2. Precondizioni obbligatorie

Prima di avviare qualsiasi test, le seguenti precondizioni devono essere soddisfatte:

### 2.1 Precondizioni tecniche

| Precondizione | Critico |
|---|---|
| Spike PDF superato con tutti i criteri di accettazione | ✅ BLOCCANTE |
| JSON template validato (nessun errore di parsing) | ✅ BLOCCANTE |
| Seed dati fittizi caricato e verificato | ✅ BLOCCANTE |
| Ambiente di sviluppo locale funzionante | ✅ BLOCCANTE |
| Supabase Auth configurato e testato | ✅ BLOCCANTE |
| Bucket storage privato configurato | ✅ BLOCCANTE |
| Audit log attivato | ✅ ALTO |

### 2.2 Precondizioni clean-room e privacy

| Precondizione | Critico |
|---|---|
| Nessun dato reale di clienti aziendali nei seed | ✅ BLOCCANTE |
| Nessun dato sanitario in nessun file di test | ✅ BLOCCANTE |
| Nessun mansionario nominativo | ✅ BLOCCANTE |
| Autorizzazione scritta se si usano dati reali (solo MVP-B e solo se applicabile) | ✅ BLOCCANTE |
| Repository personale, nessun file aziendale | ✅ BLOCCANTE |

---

## 3. Dataset fittizi per il test

### 3.1 Clienti fittizi

| ID | Ragione sociale | Indirizzo | Referente |
|---|---|---|---|
| CLI-001 | Cliente Demo Sicurezza S.r.l. | Via Roma 1, 00100 Roma RM | Mario Bianchi |
| CLI-002 | Demo Industria Srl | Via Torino 22, 20100 Milano MI | Anna Verdi |
| CLI-003 | Servizi Demo SpA | Via Napoli 5, 80100 Napoli NA | Luca Neri |

### 3.2 Sedi fittizie

| ID | Cliente | Nome sede | Indirizzo |
|---|---|---|---|
| SEDE-001 | CLI-001 | Sede Demo Roma Centro | Via Roma 1, 00100 Roma RM |
| SEDE-002 | CLI-001 | Sede Demo Roma Nord | Via dei Prati 10, 00195 Roma RM |
| SEDE-003 | CLI-002 | Stabilimento Demo Milano | Via Torino 22, 20100 Milano MI |
| SEDE-004 | CLI-003 | Uffici Demo Napoli | Via Napoli 5, 80100 Napoli NA |

### 3.3 Tecnici fittizi

| ID | Nome | Cognome | Ruolo |
|---|---|---|---|
| TEC-001 | Marco | Demo RSPP | Tecnico |
| TEC-002 | Giulia | Test Tecnico | Tecnico |

---

## 4. Test MVP-A — Validazione tecnica personale

### 4.1 Descrizione

- **Chi esegue:** il solo progettista del sistema
- **Dati:** esclusivamente fittizi, precaricati via seed
- **Visite:** 1-2 visite di test complete
- **Obiettivo:** verificare che il flusso end-to-end funzioni senza errori bloccanti

### 4.2 Caso di test MVP-A-01 — Flusso completo visita (happy path)

**Obiettivo:** Il tecnico esegue il flusso completo dall'accesso al download PDF.

| Step | Azione | Risultato atteso | Esito |
|---|---|---|---|
| 1 | Login con email e password seed | Redirect a /visite | |
| 2 | Click "Nuova visita" | Apertura /visite/nuova con clienti/sedi seed precaricati | |
| 3 | Seleziona CLI-001 / SEDE-001, data odierna | Form compilato | |
| 4 | Crea visita | Redirect a /visite/[id]/compila, stato IN_CORSO | |
| 5 | Completa tutte le 7 sezioni (almeno 48 domande) | Tutte le risposte salvate con autosave | |
| 6 | Naviga a /visite/[id]/riepilogo | Riepilogo NC corretto rispetto alle risposte inserite | |
| 7 | Procedi a /visite/[id]/verbale | Schermata generazione PDF | |
| 8 | Click "Genera PDF" | PDF generato in < 5 secondi, stato VERBALE_GENERATO | |
| 9 | Click "Scarica PDF" | Download tramite route autenticata, file .pdf scaricato | |
| 10 | Prova accesso diretto URL bucket (link non autenticato) | HTTP 403 o equivalente — accesso negato | |
| 11 | Verifica audit log | Log di generazione e download presenti | |
| 12 | Verifica PDF | Apribile, leggibile, completo, nessun SHA256 nel footer | |

### 4.3 Caso di test MVP-A-02 — Resilienza autosave

**Obiettivo:** Le risposte non vengono perse in caso di ricarica pagina.

| Step | Azione | Risultato atteso | Esito |
|---|---|---|---|
| 1 | Apri visita esistente in compilazione | Caricamento risposte esistenti | |
| 2 | Modifica 10 risposte in sezione 1 | Autosave si attiva | |
| 3 | Ricarica la pagina (F5) | Le 10 risposte modificate sono presenti | |
| 4 | Chiudi il browser, riapri, torna alla visita | Le risposte sono ancora presenti | |

### 4.4 Caso di test MVP-A-03 — Riepilogo NC

**Obiettivo:** Il riepilogo NC riflette esattamente le risposte inserite.

| Step | Azione | Risultato atteso | Esito |
|---|---|---|---|
| 1 | Inserisci 5 NC, 3 Parziali, 2 NV, 15 NA, resto Conformi | | |
| 2 | Naviga al riepilogo | Conteggi esatti: 5 NC, 3 PC, 2 NV, 15 NA | |
| 3 | Verifica tabella per sezione | Ogni sezione mostra conteggio corretto | |
| 4 | Verifica PDF generato | NC e Parziali nell'elenco rilievi, conteggi corretti | |

### 4.5 Criteri go/no-go MVP-A

Il MVP-A è superato se:

- Tutti gli step dei casi di test MVP-A-01, MVP-A-02, MVP-A-03 risultano "OK"
- Nessun bug classificato come BLOCCANTE è aperto
- Il PDF supera la revisione visiva del progettista
- Il download URL non autenticato restituisce 403
- SHA256 non compare nel PDF

### 4.6 Caso di test MVP-A-04 — Assenza stringhe vietate nel PDF e nel repository

**Obiettivo:** Verificare che il PDF non contenga contenuti interni o non conformi al perimetro clean-room.

| Verifica | Metodo | Risultato atteso | Esito |
|---|---|---|---|
| SHA256 assente dal PDF | Ricerca testo nel PDF ("sha256", "hash") | Nessun risultato | |
| `note_tecnico` assenti dal PDF | Ricerca visiva e testuale di porzioni di testo `note_tecnico` noti | Nessun risultato | |
| Nessun riferimento normativo `DA VERIFICARE` nel PDF | Ricerca testo nel PDF ("DA VERIFICARE", "rif_normativo") | Nessun risultato | |
| Nessuna `correzione_default` grezza nel PDF senza conferma tecnico | Verificare che le azioni suggerite nel PDF corrispondano solo a testi confermati/modificati | Solo `correzione_suggerita_finale` stampata | |
| `Document ID` presente nel footer | Revisione visiva footer ogni pagina | Presente su ogni pagina | |
| Nessun nome cliente reale nel repository | `grep -r` su termini reali noti nel repo | Nessun risultato | |
| Nessun file aziendale (Excel, PDF, ZIP) nel repository | `git ls-files` | Nessun file non consentito | |

---

## 5. Test MVP-B — Pilota personale controllato

### 5.1 Descrizione

- **Chi esegue:** 2 tecnici di test (il progettista + 1 tecnico di test noto)
- **Dati:** solo fittizi o casi simulati realistici. Qualsiasi uso di dati reali, anche legittimamente disponibili e non aziendali, è escluso da questa baseline e richiede revisione separata del perimetro privacy, contrattuale e operativo.
- **Visite:** 5 visite simulate con caratteristiche diverse
- **Obiettivo:** validare usabilità reale, volumi, CRUD, filtri

### 5.2 Visite pianificate MVP-B

| Visita | Cliente/Sede | Caratteristica speciale | Tecnico |
|---|---|---|---|
| VIS-B-01 | CLI-001 / SEDE-001 | Visita standard equilibrata | TEC-001 |
| VIS-B-02 | CLI-001 / SEDE-002 | Molte NC (>20 NC su 48) | TEC-001 |
| VIS-B-03 | CLI-002 / SEDE-003 | Molti NA (>20 NA su 48) | TEC-002 |
| VIS-B-04 | CLI-003 / SEDE-004 | Note lunghe (>500 caratteri per rilievo) | TEC-002 |
| VIS-B-05 | CLI-001 / SEDE-001 | Visita interrotta e ripresa in sessione diversa | TEC-001 |

### 5.3 Test CRUD clienti/sedi

| Test | Azione | Risultato atteso | Esito |
|---|---|---|---|
| CRUD-01 | Crea nuovo cliente con tutti i campi | Cliente salvato, compare in lista | |
| CRUD-02 | Modifica ragione sociale cliente | Modifica salvata, visibile in lista visite | |
| CRUD-03 | Crea nuova sede per cliente esistente | Sede disponibile nella creazione visita | |
| CRUD-04 | Modifica indirizzo sede | Modifica salvata | |
| CRUD-05 | Elimina sede non usata (soft delete) | Sede non compare nelle nuove visite | |
| CRUD-06 | Verifica che sede usata in visita non sia eliminabile definitivamente | Sistema impedisce eliminazione o soft delete | |

### 5.4 Test filtri visite

| Test | Filtro | Risultato atteso | Esito |
|---|---|---|---|
| FLT-01 | Filtra per CLI-001 | Solo visite di Cliente Demo Sicurezza S.r.l. | |
| FLT-02 | Filtra per data (range 7 giorni) | Solo visite nel range | |
| FLT-03 | Rimuovi filtro | Tutte le visite dell'utente autenticato | |

### 5.5 Test multi-utente

| Test | Scenario | Risultato atteso | Esito |
|---|---|---|---|
| MU-01 | TEC-001 compila VIS-B-01, TEC-002 in sessione parallela | Nessun conflitto | |
| MU-02 | TEC-001 vede solo le sue visite in lista | Le visite di TEC-002 non compaiono | |
| MU-03 | TEC-002 prova ad accedere alla visita di TEC-001 via URL diretto | HTTP 403 o redirect a /visite | |

---

## 6. Metriche operative

Le seguenti metriche devono essere rilevate e documentate durante MVP-B:

| Metrica | Come rilevarla | Target |
|---|---|---|
| Tempo medio compilazione visita completa | Cronometro manuale da inizio compilazione a click "Finalizza" | < 45 min (DA VERIFICARE) |
| Tempo generazione PDF | Log applicativo o console.time | < 5 secondi |
| Numero errori bloccanti riscontrati | Bug tracker | 0 in produzione |
| Numero risposte perse (autosave fallito) | Verifica post-sessione | 0 |
| Numero crash applicazione | Segnalazioni tecnico | 0 |
| Qualità PDF (scala 1-5) | Valutazione soggettiva tecnico | >= 4/5 |
| Numero volte in cui si apre Excel durante pilota | Dichiarazione tecnico | 0 |
| Necessità di rielaborazione manuale post-PDF | Dichiarazione tecnico | Nessuna |
| Feedback negativo critico da tecnico | Scheda feedback | 0 critici non indirizzati |

---

## 7. Scheda feedback tecnico

Al termine di ogni sessione di test MVP-B, il tecnico di test compila questa scheda:

```
SCHEDA FEEDBACK TECNICO — SafeCheck MVP-B
Data: _______________
Tecnico: _______________
Visita testata: _______________

1. Il flusso di compilazione è stato chiaro e intuitivo? (1=No, 5=Sì)
   Voto: ___ Note: _______________________________________

2. Hai perso risposte durante la compilazione? (Sì/No)
   Se sì, descrivi: _______________________________________

3. Il PDF generato è presentabile senza modifiche manuali? (Sì/No/Parzialmente)
   Note: _______________________________________

4. Il tempo di compilazione è stato accettabile rispetto al metodo precedente? (Sì/No)
   Stima tempo: ___ min   Stima Excel precedente: ___ min

5. Hai avuto bisogno di aprire Excel durante il test? (Sì/No)
   Se sì, perché: _______________________________________

6. Ci sono rilievi o osservazioni che non sei riuscito a inserire correttamente?
   Descrivi: _______________________________________

7. Cosa non ha funzionato o ti ha rallentato? (lista libera)
   -
   -
   -

8. Cosa invece ha funzionato bene? (lista libera)
   -
   -
   -

9. Priorità di miglioramento (max 3):
   1. _______________________________________
   2. _______________________________________
   3. _______________________________________

10. Useresti SafeCheck al posto del metodo attuale se fosse stabile? (Sì/No/Dipende)
    Note: _______________________________________
```

---

## 8. Bug classification

| Livello | Definizione | Azione |
|---|---|---|
| **BLOCCANTE** | Il sistema non funziona, dati persi, PDF non generabile, sicurezza compromessa | Stop sviluppo, fix immediato prima di continuare |
| **ALTA** | Funzione core non funziona correttamente, workaround difficile, impatta la completezza del verbale | Fix nella sprint corrente |
| **MEDIA** | Problema UX, lentezza, comportamento inatteso ma non bloccante | Backlog prioritizzato |
| **BASSA** | Estetica, testo, dettagli minori | Backlog non prioritario |

### Esempi per categoria

**BLOCCANTE:**
- Risposta salvata ma non presente al reload
- PDF non generato senza errore leggibile
- Download PDF non autenticato (URL pubblico)
- SHA256 stampato nel footer o altrove nel PDF
- Dati di una visita che appaiono in un'altra
- `note_tecnico` visibili nel PDF
- `correzione_default` grezza stampata nel PDF senza conferma del tecnico
- Testo `DA VERIFICARE NORMATIVAMENTE` o `rif_normativo` visibili nel PDF

**ALTA:**
- Riepilogo NC con conteggio errato
- PDF con testo tagliato
- Autosave non attivato per > 30 secondi
- Filtro visite non funzionante

**MEDIA:**
- Messaggio di errore non chiaro
- Lentezza > 3 secondi su operazioni non-PDF
- Layout mobile non ottimale

**BASSA:**
- Testo di un label impreciso
- Colore di un badge leggermente diverso da specifica
- Spaziatura non ottimale

---

## 9. Regole durante il pilota

Le seguenti regole sono operative e vincolanti durante tutto MVP-B:

1. **Nessuna nuova feature durante il pilota.** Il perimetro è quello di `contratto-mvp.v0.1.md`.
2. **Solo fix BLOCCANTI durante il pilota.** I bug di livello ALTA, MEDIA, BASSA vanno nel backlog.
3. **Il feedback va nel backlog**, non nelle sprint correnti.
4. **Excel è permesso solo come backup dichiarato.** Se un tecnico usa Excel perché il sistema non funziona, è un criterio di fallimento MVP da registrare.
5. **Nessun dato reale aziendale** entra nel sistema senza autorizzazione scritta preventiva.
6. **I PDF generati durante il pilota con dati fittizi** non vengono consegnati a clienti reali.
7. **I bug vengono registrati nel bug tracker** con livello di classificazione esplicito.
8. **Le schede feedback vengono compilate entro 24 ore** dalla sessione di test.

---

## Checklist qualità file

- [ ] Il test plan non prevede test su clienti reali aziendali
- [ ] Il test plan non prevede test su dati sanitari
- [ ] Il test plan non prevede test del mansionario
- [ ] Il dataset fittizio non contiene dati reali
- [ ] I criteri go/no-go sono misurabili e non soggettivi
- [ ] La scheda feedback è compilabile dal tecnico senza accesso al sistema
- [ ] La bug classification copre SHA256, URL pubblico, note_tecnico, correzione_default grezza come BLOCCANTI
- [ ] Il test MVP-A-04 verifica assenza stringhe vietate nel PDF e nel repository
- [ ] Il test VIS-B-05 (sessione interrotta e ripresa) verifica l'autosave
- [ ] Il test MU-03 verifica l'accesso non autorizzato tra tecnici
- [ ] La regola "no nuove feature durante pilota" è esplicita
- [ ] Lo stato del file è DRAFT OPERATIVO
- [ ] La data è aggiornata a 2026-06-25
- [ ] Il nome SafeCheck è marcato come provvisorio
