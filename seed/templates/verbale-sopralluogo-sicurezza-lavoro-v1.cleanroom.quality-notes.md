# NOTE QUALITÀ — verbale-sopralluogo-sicurezza-lavoro-v1.cleanroom.json

Questo file accompagna il template JSON e ne certifica la qualità clean-room.

## Dati di verifica automatica (ultima esecuzione)

- JSON valido e parseabile: ✅
- Totale sezioni: 7
- Totale domande: 48
- ID duplicati: Nessuno
- Tipi risposta dichiarati: CONFORME_NC_PARZIALE_NV_NA, TESTO_LIBERO, DATA, NUMERO

## Checklist qualità file

- [ ] Il JSON è parseabile senza errori
- [ ] Non contiene commenti non validi JSON
- [ ] Tutti i `tipo_risposta` usati sono dichiarati in `tipo_risposta_dichiarati`
- [ ] Nessun ID domanda duplicato
- [ ] Tutti i campi `note_tecnico` hanno `internal_only: true`
- [ ] La sezione Note non esiste come sezione del template
- [ ] `note_finali_visita` è documentata come campo visita, non come domanda
- [ ] I riferimenti normativi incerti sono marcati come `DA VERIFICARE NORMATIVAMENTE`
- [ ] Non contiene dati reali (clienti, lavoratori, aziende)
- [ ] Non contiene riferimenti a file Excel o a format aziendali
- [ ] I `correzione_default` sono stampabili e distinti dalle `note_tecnico` interne
- [ ] I metadata includono `excluded_from_mvp`, `privacy_notes`, `normative_review_status`, `engine_rules`
- [ ] La nota GDPR sul Codice Fiscale è formulata correttamente (dato identificativo, non categoria particolare)
- [ ] Il template è identificato come originale clean-room
