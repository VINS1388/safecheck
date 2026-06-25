# clean-room-ip-policy.md
# SafeCheck — Policy di proprietà intellettuale e strategia clean-room

**Versione:** 1.2  
**Data:** 2026-06-25  
**Stato:** VINCOLANTE PER IL PROGETTO PERSONALE CLEAN-ROOM  

> **Nota nome:** `SafeCheck` è nome provvisorio di lavoro, non ancora verificato come marchio, dominio o denominazione commerciale.

> **Nota legale:** Questo documento è redatto a scopo organizzativo interno e non costituisce consulenza legale. Per valutazioni specifiche su diritto del lavoro, proprietà intellettuale e privacy, consultare un professionista abilitato.

---

## 1. Scopo del documento

Questo documento stabilisce le regole di proprietà intellettuale e la strategia clean-room per il progetto SafeCheck. Ha lo scopo di:

1. Dichiarare la titolarità personale esclusiva del progetto.
2. Definire cosa è consentito usare come base per il progetto.
3. Definire cosa è vietato includere nel progetto.
4. Proteggere la natura originale e personale del lavoro.
5. Prevenire ambiguità future sulla titolarità.

---

## 2. Dichiarazione di titolarità personale

SafeCheck è un progetto personale originale, sviluppato autonomamente dall'autore sulla base di:

- Competenze professionali personali acquisite in 16+ anni di attività come RSPP;
- Conoscenza delle normative pubbliche in materia di sicurezza sul lavoro (D.Lgs. 81/2008 e correlati);
- Principi generali di buona pratica professionale;
- Ragionamento originale su architettura del prodotto e flusso operativo;
- Dataset interamente fittizi;
- Template, checklist e strutture documentali create ex novo.

La titolarità intellettuale del progetto — codice, template, strutture dati, documentazione — è **esclusivamente personale**.

---

## 3. Strategia clean-room per proprietà esclusiva personale

La strategia clean-room definisce le condizioni operative che garantiscono che il progetto sia originale e non derivato da asset di terzi o aziendali.

### 3.1 Cosa è consentito usare

| Risorsa | Consentita | Note |
|---|---|---|
| Competenza professionale personale come RSPP | ✅ | Patrimonio personale dell'autore |
| Normative pubbliche (D.Lgs. 81/2008, DM, Accordi Stato-Regioni, Regolamenti UE) | ✅ | Atti pubblici |
| Principi generali di buona pratica in sicurezza sul lavoro | ✅ | Conoscenza professionale generale |
| Dataset fittizi creati ad hoc | ✅ | Nessun riferimento a soggetti reali |
| Template e checklist create ex novo con linguaggio originale | ✅ | Originali, non derivati |
| Strumenti di sviluppo personali (PC personale, account personali) | ✅ | Necessari |
| Framework, librerie open source con licenza compatibile | ✅ | Verificare singole licenze |
| Repository personale (GitHub account personale) | ✅ | Non account aziendale |
| Servizi cloud su account personali (Supabase, Vercel, ecc.) | ✅ | Non account aziendali |

### 3.2 Cosa è vietato

| Risorsa vietata | Motivazione |
|---|---|
| Checklist o template aziendali come base testuale | Proprietà dell'azienda di riferimento professionale |
| Copia o parafrasi riconoscibile di verbali aziendali esistenti | Proprietà dell'azienda |
| Clienti reali dell'azienda di riferimento professionale | Dati riservati, potenziale violazione privacy |
| Nominativi, dati di lavoratori o dipendenti reali | Dati personali, potenziale violazione privacy/GDPR |
| Dati sanitari o giudizi di idoneità lavorativa | Categorie particolari GDPR, vietati nel MVP |
| Loghi, intestazioni, format grafici aziendali | Proprietà dell'azienda |
| Verbali, report, PDF prodotti nell'ambito dell'attività lavorativa | Proprietà dell'azienda/committente |
| File Excel o strumenti di lavoro aziendali come base del prodotto | Proprietà dell'azienda |
| PC, email, account aziendali per lo sviluppo | Rischio di rivendicazione aziendale |
| Repository aziendali o account GitHub/GitLab aziendali | Rischio di rivendicazione aziendale |
| Sviluppo in orario lavorativo | Rischio di rivendicazione aziendale |
| Dati di configurazione o procedure interne aziendali riservate | Segreto aziendale |

---

## 4. Uso della competenza professionale personale

La competenza professionale dell'autore come RSPP è **personale e non ceduta** all'azienda di riferimento professionale. Il progettare un sistema per gestire sopralluoghi e verbali di sicurezza è un'applicazione legittima di competenze professionali generali, analogamente a un avvocato che crea uno strumento per gestire pratiche legali.

**Distinzione fondamentale:**
- La competenza (sapere come si fa un sopralluogo, cosa verificare, quali norme si applicano) è personale.
- I documenti prodotti nell'ambito del rapporto di lavoro (verbali reali, checklist aziendali, dati di clienti aziendali) appartengono al datore di lavoro o al committente.

SafeCheck usa la competenza, non i documenti.

---

## 5. Cosa è vietato includere nel repository

Le seguenti categorie di contenuto non devono mai entrare nel repository SafeCheck:

### 5.1 Contenuti aziendali

- File Excel, Word, PDF, ZIP o archivi prodotti nell'attività lavorativa corrente o passata
- Screenshot di sistemi o software aziendali
- Checklist o format con intestazione aziendale
- Clienti, sedi o nominativi reali dell'attività professionale
- Verbali reali, report, documenti interni di sicurezza di terzi

### 5.2 Dati personali reali

- Nomi di lavoratori reali
- Codici fiscali
- Dati sanitari o giudizi di idoneità
- Recapiti reali di persone fisiche

### 5.3 Asset di terze parti senza licenza

- Font proprietari senza licenza compatibile
- Immagini o icone non open source
- Codice di terzi non rilasciato sotto licenza compatibile

### 5.4 Credenziali e segreti

- API key, password, token, segreti di configurazione (usare `.env` escluso da `.gitignore`)
- Credenziali di database di produzione

### 5.5 Regole per le sessioni con strumenti AI (Claude, ChatGPT, ecc.)

- Le sessioni con strumenti AI devono essere condotte con **account personali**, non aziendali.
- Non inserire nelle sessioni AI dati reali di clienti, lavoratori o aziende, nemmeno a scopo di "esempio": i testi inseriti nel prompt possono essere loggati o usati per training dai provider.
- Non incollare nelle sessioni AI contenuti di verbali reali, checklist aziendali, dati di lavoratori o documenti interni.
- Usare esclusivamente dataset fittizi ("Cliente Demo", "Sede Demo", ecc.) anche nelle conversazioni con AI.
- L'output delle sessioni AI (codice, template, documentazione) deve essere revisionato prima del commit per escludere la presenza accidentale di dati reali.

---

## 6. Demo esterne

Le demo esterne di SafeCheck sono consentite **solo** con le seguenti condizioni:

| Condizione | Dettaglio |
|---|---|
| Solo dati fittizi | "Cliente Demo Sicurezza S.r.l.", "Sede Demo Roma", "Tecnico Demo RSPP" |
| Nessun dato aziendale reale | Anche un solo dato reale rende la demo non consentita |
| Nessun dato personale reale | Nessun nome reale, nessun CF, nessun dato sanitario |
| Nessun logo o branding aziendale | Il prodotto usa solo il suo naming originale "SafeCheck" |
| Nessun riferimento a clienti reali | Nemmeno come "esempio anonimizzato" se riconoscibile |

**Cosa non mostrare mai in una demo:**
- PDF con dati reali anche parzialmente oscurati
- Liste di NC relative a situazioni reali
- Nomi di sedi o aziende reali anche come "esempio di funzionamento"
- Screenshot del sistema con dati di sessioni reali

---

## 7. Sviluppo e strumenti

| Regola | Dettaglio |
|---|---|
| Dispositivi | Solo dispositivi personali |
| Orario | Solo fuori dall'orario lavorativo |
| Repository | Solo account GitHub/GitLab personale |
| Email | Solo email personale per gli account |
| Servizi cloud | Supabase, Vercel, ecc. su account personali |
| Backup | Solo su cloud personale o dispositivi personali |
| Strumenti AI (Claude, ChatGPT) | Su account personali, non aziendali |

---

## 8. Uso futuro da parte di aziende o terzi

**L'uso futuro di SafeCheck da parte di aziende, datori di lavoro, committenti o terzi** non è escluso a priori, ma richiede **obbligatoriamente**:

- Accordo scritto separato (licenza, contratto, convenzione) negoziato a parte
- Definizione esplicita dei diritti ceduti, dell'ambito d'uso e dei corrispettivi
- Nessuna condivisione automatica della proprietà: il fatto di aver lavorato per un'azienda o di avere rapporti professionali con essa non implica alcun diritto automatico sull'opera
- Questo accordo non è parte del progetto MVP e non deve essere anticipato, implicato o presupposto nei documenti del progetto

Il fatto che l'autore lavori o abbia lavorato per un'azienda **non implica** automaticamente che SafeCheck appartenga o debba essere messo a disposizione di quell'azienda. Ogni uso da parte di terzi richiede accordo esplicito, separato e scritto.

---

## 9. Pilota con dati reali

Un pilota con dati reali (visite reali, clienti reali, verbali destinati a soggetti reali) è **escluso dalla baseline 0.1.2** e da MVP-A e MVP-B come definiti in `contratto-mvp.v0.1.md`. Qualsiasi uso di dati reali, anche legittimamente disponibili e non aziendali, richiede:

1. **Revisione separata del perimetro** privacy, contrattuale e operativo, prima di qualsiasi accesso al dato reale.
2. **Valutazione** della situazione contrattuale e lavorativa dell'autore.
3. **Verifica** che i dati usati siano nella disponibilità legittima dell'autore (non dati aziendali riservati).
4. **Designazione come Titolare o Responsabile del trattamento** ai sensi del GDPR.
5. **Informativa privacy** per i soggetti i cui dati vengono trattati.
6. **Accordo scritto** che regola i rapporti se terzi sono coinvolti.

---

## 10. Gestione dei dati personali nel MVP

### 10.1 Dati trattati nel MVP (fittizi in fase di sviluppo)

| Dato | Natura | Rischio | Misura |
|---|---|---|---|
| Ragione sociale cliente | Dato aziendale | Basso se fittizio | Usare solo dati fittizi in dev |
| Indirizzo sede | Dato aziendale | Basso se fittizio | Usare solo dati fittizi in dev |
| Nome referente cliente | Dato personale comune | Basso se fittizio | Usare solo dati fittizi in dev |
| Nome tecnico | Dato personale comune | Basso se fittizio | Usare solo dati fittizi in dev |
| Osservazioni tecniche | Dati fattuali non sensibili | Basso | Contenuto originale fittizio |
| PDF verbale | Aggregato dei precedenti | Dipende dal contenuto | Bucket privato, download autenticato |
| Audit log | Dati tecnici di accesso | Medio | Accesso ristretto, no esportazione |

### 10.2 Dati esclusi dal MVP

| Dato | Motivo esclusione |
|---|---|
| Codice Fiscale lavoratori | Dato personale identificativo, escluso per minimizzazione |
| Mansionario nominativo | Fuori perimetro MVP, dati personali non necessari |
| Dati sanitari | Categoria particolare art. 9 GDPR, vietati nel MVP |
| Giudizi di idoneità lavorativa | Categoria particolare art. 9 GDPR |
| Allegati/foto di lavoratori | Fuori perimetro MVP |
| Dati di accesso del cliente | Portale cliente fuori perimetro MVP |

### 10.3 Nota GDPR sul Codice Fiscale

Il Codice Fiscale è un **dato personale identificativo** ai sensi del GDPR, non una **categoria particolare di dati** ai sensi dell'art. 9 GDPR. Le categorie particolari sono: dati che rivelano origine razziale o etnica, opinioni politiche, credenze religiose, appartenenza sindacale, dati genetici, biometrici, sanitari, relativi alla vita sessuale o all'orientamento sessuale.

Il CF è escluso dal MVP per minimizzazione del dato, non perché sia "dato sensibile" in senso tecnico.

---

## Checklist qualità file

- [ ] Il documento dichiara esplicitamente la titolarità personale esclusiva
- [ ] La distinzione tra competenza professionale e documenti aziendali è chiara
- [ ] Il documento vieta esplicitamente l'uso di checklist/verbali aziendali come base testuale
- [ ] Il documento vieta esplicitamente lo sviluppo in orario lavorativo e su strumenti aziendali
- [ ] Il documento vieta esplicitamente upload di file Excel, ZIP, PDF, screenshot e verbali reali nel repository
- [ ] Le regole per le sessioni AI (account personali, nessun dato reale nei prompt) sono esplicite
- [ ] Le regole per demo esterne escludono qualsiasi dato reale
- [ ] L'uso futuro da parte di aziende è condizionato ad accordo scritto separato con dichiarazione esplicita di nessuna condivisione automatica
- [ ] Il documento non propone la proprietà condivisa con l'azienda come opzione equivalente
- [ ] La nota GDPR sul CF è formulata correttamente (dato identificativo, non categoria particolare art. 9)
- [ ] Il documento include la nota che non sostituisce consulenza legale
- [ ] Lo stato è VINCOLANTE PER IL PROGETTO PERSONALE CLEAN-ROOM
- [ ] La data è aggiornata a 2026-06-25
- [ ] Il nome SafeCheck è marcato come provvisorio
