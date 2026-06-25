# cost-model.md
# SafeCheck — Modello dei costi per fase

**Versione:** 0.1.2  
**Data:** 2026-06-25  
**Stato:** DRAFT OPERATIVO — baseline candidata per spike PDF statico, non approvata per sviluppo applicativo  

> **Nota nome:** `SafeCheck` è nome provvisorio di lavoro, non ancora verificato come marchio, dominio o denominazione commerciale.  
> **Nota prezzi:** Tutti i prezzi sono indicativi alla data di redazione. Verificare i prezzi correnti sui siti ufficiali prima di qualsiasi acquisto o sottoscrizione.

> **Nota importante:** Il costo principale di SafeCheck non sono gli strumenti. Il costo principale è il **tempo** dell'autore: analisi, progettazione, sviluppo, test, manutenzione, supporto, aggiornamento template a fronte di variazioni normative. Gli strumenti elencati di seguito sono un costo secondario, spesso quasi nullo nelle fasi iniziali.

---

## 1. Tabella strumenti

| Strumento | Gratuito | Free tier OK per MVP-A | Free tier OK per MVP-B | Piano consigliato | Costo indicativo | Quando passare a pagamento | Vendor lock-in | Alternativa |
|---|---|---|---|---|---|---|---|---|
| **Claude.ai** | Parziale | ✅ (Free tier limitato) | ⚠️ (limiti messaggi) | Pro o Max con account personale | ~20-100€/mese | Quando i limiti di messaggio rallentano lo sviluppo | Alto (Anthropic) | ChatGPT, Gemini |
| **Claude Code** | No (incluso in Pro/Max) | ✅ se abbonamento Pro/Max attivo | ✅ se abbonamento Pro/Max attivo | Incluso in Claude Pro/Max | Incluso nell'abbonamento Claude | Non si paga separatamente con Pro/Max — solo se si usa API a consumo | Alto (Anthropic) | Cursor, GitHub Copilot |
| **Claude API a consumo** | No | ❌ non necessario per MVP-A | ❌ non necessario per MVP-B | Non usare in MVP — valutare per prodotto stabile | ~3-15$/MTok input (claude-sonnet) | Solo se si integra Claude nel prodotto come feature | Alto (Anthropic) | OpenAI API, Gemini API |
| **ChatGPT / GPT-4** | Parziale | ✅ come alternativa | ✅ come alternativa | Free o Plus 20$/mese | 0-20$/mese | Se serve un secondo modello per confronto | Alto (OpenAI) | Claude |
| **GitHub** | ✅ (per repo privato personale) | ✅ | ✅ | Free personal | 0€ | Mai per repository personale privato | Medio (Microsoft) | GitLab, Gitea self-hosted |
| **VS Code** | ✅ | ✅ | ✅ | Free | 0€ | Non applicabile | Basso (open source) | Neovim, Zed |
| **Cursor** | Parziale | ✅ (free tier limitato) | ⚠️ (limiti richieste AI) | Pro 20$/mese se si usa intensivamente | 0-20$/mese | Quando i limiti free rallentano lo sviluppo | Medio | VS Code + GitHub Copilot |
| **Next.js** | ✅ (open source) | ✅ | ✅ | Open source | 0€ | Non applicabile | Basso | Remix, SvelteKit |
| **React** | ✅ (open source) | ✅ | ✅ | Open source | 0€ | Non applicabile | Basso | Vue, Svelte |
| **TypeScript** | ✅ (open source) | ✅ | ✅ | Open source | 0€ | Non applicabile | Basso | JavaScript puro |
| **Supabase DB** | ✅ (free tier) | ✅ (500 MB, 2 progetti) | ✅ (volumi MVP-B) | Free per sviluppo, Pro 25$/mese per produzione | 0-25$/mese | Quando si passa a produzione con dati reali | Medio (Postgres standard sotto) | PlanetScale, Neon, self-hosted Postgres |
| **Supabase Auth** | ✅ incluso in Supabase | ✅ | ✅ | Incluso nel piano Supabase | Incluso | Con Supabase | Medio | Auth.js, Clerk |
| **Supabase Storage** | ✅ (1 GB free) | ✅ | ✅ (volumi MVP-B) | Free per sviluppo | 0-25$/mese (incluso in Pro) | Quando i PDF accumulati superano 1 GB | Medio | AWS S3, Cloudflare R2 |
| **Vercel** | ✅ (hobby tier) | ✅ | ✅ | Hobby (free) per sviluppo | 0-20$/mese | Quando si aggiungono team member o domini custom multipli | Medio | Netlify, Railway, Fly.io |
| **Resend** | ✅ (100 email/giorno free) | ✅ (email auth) | ✅ | Free per volumi MVP | 0-20$/mese | Quando si aggiungono notifiche email (fuori MVP) | Basso (SMTP standard) | Postmark, SendGrid |
| **Dominio** | No | ❌ non necessario in dev | ⚠️ opzionale per test esterno | .it o .com | ~10-20€/anno | Quando si vuole URL stabile per test | Basso (trasferibile) | Qualsiasi registrar |
| **Monitoring / Error tracking** | ✅ (Sentry free tier) | ✅ | ✅ | Free (5K eventi/mese) | 0-26$/mese | Quando si va in produzione reale | Basso | LogRocket, Datadog |
| **Backup** | ✅ (Supabase include backup) | ✅ | ✅ (backup giornaliero in Pro) | Incluso in Supabase Pro | Incluso | Con Pro Supabase | Basso | pg_dump manuale |
| **Firma digitale futura** | No | ❌ fuori MVP | ❌ fuori MVP | Valutare solo dopo MVP-B | 0-500€/anno | Solo se feature richiesta da utenti | Alto (provider specifico) | Namirial, InfoCert, Aruba Sign |
| **Storage extra** | No | ❌ non necessario in MVP | ❌ non necessario in MVP | Aggiungere se PDF accumulati > 5 GB | ~0.02$/GB/mese (S3) | Con crescita del volume PDF | Basso | Qualsiasi S3-compatible |
| **Mobile futura (React Native / Expo)** | ✅ (Expo free) | ❌ fuori MVP | ❌ fuori MVP | Valutare solo dopo prodotto stabile | 0-99€/mese (store + servizi) | Solo se app mobile è feature prioritaria | Medio | Flutter, Capacitor |

---

## 2. Nota su Claude Code e abbonamento Pro/Max

Claude Code è uno strumento da riga di comando per sviluppo assistito da AI. Non ha un costo separato se si utilizza con un account Claude Pro o Max:

- **Claude Pro (~20$/mese):** include Claude Code con un tetto di utilizzo mensile. Sufficiente per sviluppo personale a ritmo normale.
- **Claude Max (~100$/mese):** include Claude Code con limiti più alti. Adatto a sessioni di sviluppo intensivo.
- **Claude API a consumo:** adatto solo se si integra Claude come feature nel prodotto. Non consigliato per il semplice utilizzo come assistente di sviluppo se si ha già un abbonamento Pro/Max.

---

## 3. Stima costi per fase

### 3.1 Fase 0.1 — Documentale (attuale)

| Voce | Costo |
|---|---|
| Claude.ai (abbonamento personale esistente) | 0€ aggiuntivi |
| GitHub account personale | 0€ |
| VS Code | 0€ |
| Tempo autore per documentazione | **Principale** |
| **TOTALE STRUMENTI** | **~0€/mese** |

> **Nota spike PDF:** Lo spike PDF (Sprint 0) viene eseguito in locale, senza infrastruttura cloud, senza Supabase, senza Vercel. Il costo infrastrutturale dello spike è **zero**. Serve solo il PC dello sviluppatore, Node.js e le librerie npm.

### 3.2 MVP-A — Validazione tecnica personale

| Voce | Costo mensile stimato |
|---|---|
| Claude Pro/Max (account personale) | 20-100€/mese |
| Cursor (opzionale, free tier o Pro) | 0-20$/mese |
| GitHub (account personale) | 0€ |
| Supabase (free tier) | 0€ |
| Vercel (hobby tier) | 0€ |
| Dominio (opzionale) | 0-2€/mese (annualizzato) |
| Tempo autore per sviluppo | **Principale** |
| **TOTALE STRUMENTI** | **~20-120€/mese** |

### 3.3 MVP-B — Pilota personale controllato

| Voce | Costo mensile stimato |
|---|---|
| Claude Pro/Max | 20-100€/mese |
| Cursor Pro (se necessario) | 0-20$/mese |
| Supabase Pro (se si vuole backup e supporto) | 25$/mese |
| Vercel Hobby o Pro | 0-20$/mese |
| Dominio | ~2€/mese |
| Sentry free tier | 0€ |
| Tempo autore | **Principale** |
| **TOTALE STRUMENTI** | **~47-167€/mese** |

### 3.4 Prodotto personale stabile

| Voce | Costo mensile stimato |
|---|---|
| Claude Pro/Max | 20-100€/mese |
| Supabase Pro | 25$/mese |
| Vercel Pro | 20$/mese |
| Dominio + DNS | ~2€/mese |
| Sentry (piano Team se necessario) | 0-26$/mese |
| Resend (se email automatiche) | 0-20$/mese |
| Storage aggiuntivo (se PDF > 5 GB) | variabile |
| Tempo autore manutenzione | **Significativo** |
| **TOTALE STRUMENTI** | **~70-200€/mese** |

### 3.5 SaaS futuro (ipotetico)

| Voce | Costo mensile stimato |
|---|---|
| Infrastructure (Supabase, Vercel, storage) | 100-500+€/mese in base a volumi |
| Claude API a consumo (se integrato nel prodotto) | Variabile in base all'uso |
| Firma digitale (se richiesta) | 200-500€/anno |
| Dominio + email professionale | ~10-20€/mese |
| Monitoring avanzato | 50-200€/mese |
| Supporto legale/privacy/contratti | Significativo una tantum |
| Tempo autore sviluppo + supporto + vendita | **Determinante** |
| **TOTALE STRUMENTI (solo infrastruttura)** | **~200-1000+€/mese** |

> **Nota SaaS:** Prima di considerare il SaaS, è necessario risolvere: aspetti legali del servizio, responsabilità professionale, privacy e GDPR come Titolare del trattamento, contratti con i clienti, pricing, supporto. Questi non sono costi di strumenti ma costi di struttura.

---

## 4. Riepilogo del costo reale del progetto

Il costo degli strumenti è una frazione piccola del costo totale del progetto. Il costo reale è:

| Voce di costo reale | Incidenza |
|---|---|
| Tempo di analisi e progettazione (Fase 0.1) | Alta |
| Tempo di sviluppo MVP-A | Alta |
| Tempo di sviluppo MVP-B e pilota | Alta |
| Tempo di manutenzione (bug, aggiornamenti) | Ricorrente |
| Tempo di aggiornamento template a fronte di variazioni normative | Ricorrente — significativo in ambito sicurezza sul lavoro |
| Tempo di supporto agli utenti (se uso da terzi) | Ricorrente |
| Consulenza legale / privacy / verifica trademark (eventuale) | Una tantum, solo se il prodotto evolve verso uso commerciale o da terzi |
| Costi legali/IP/privacy (se prodotto commerciale) | Una tantum significativo |
| Strumenti software | Basso rispetto al totale |

---

## Checklist qualità file

- [ ] Claude Code è descritto come incluso nell'abbonamento Pro/Max, non come costo separato
- [ ] L'API Claude a consumo è distinta dall'abbonamento e marcata come opzionale
- [ ] La firma digitale è marcata come futura e fuori MVP
- [ ] L'app mobile è marcata come futura e fuori MVP
- [ ] I free tier di Supabase e Vercel sono confermati sufficienti per MVP-A e MVP-B
- [ ] Il costo principale è identificato come tempo dell'autore, non come strumenti
- [ ] La sezione SaaS include nota sui costi non-strumentali (legale, privacy, contratti)
- [ ] Il dominio è marcato come opzionale per MVP-A
- [ ] Tutti gli account sono su profilo personale, non aziendale
- [ ] Il costo dell'aggiornamento template normativo è menzionato come voce ricorrente
- [ ] I prezzi sono marcati come indicativi da verificare prima dell'acquisto
- [ ] Lo spike PDF è marcato come eseguibile in locale a costo infrastrutturale zero
- [ ] La consulenza legale/privacy/trademark è menzionata come costo eventuale futuro
- [ ] Lo stato del file è DRAFT OPERATIVO
- [ ] La data è aggiornata a 2026-06-25
