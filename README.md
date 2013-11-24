fhbapp
======
TODO:

Entscheidung treffen:
- Vordefinierte Gruppenchats (Hackathon?)
- Login via MAC-Adresse, UUID oder Nutzername/Passwort
- QR-Code bei Eventdetails bereits sofort darstellen oder als Popup lassen?
- Chat (Push vs. Pull vs. PubNub) - Chaträume wie Subscribe?
- Statt Settings-Navigation Gruppen darstellen?


Design:
- [x] Gruppen erstellen Page
- [x] Anwesenheitskontrolle - Page
- [x] Authentifizierungspage + Error Page
- [ ] Darstellung der (nicht) anwesenden Personen (Page)
- [ ] Anwesenheitsverifikation - Succes / Error Page
- [ ] Position scannen Page (QR-Code-Scanner) - Succes / Error Page
- [ ] Kontakt hinzufügen / zur Gruppe hinzufügen über Popup und Checkboxen --> Kontakte verwalten (um auch Kontakte zu löschen)
- [ ] Kontaktliste wie bei Event-Teilnehmerliste (als Link)
- [ ] Darstellung der Gruppen unter Kontakte muss umgestaltet werden (evtl. als eigener Menüpunkt - siehe Settings)
- [ ] Einheitliche Darstellung eines Themes
- [ ] Button aktualisieren für Status für Dozent wie in Studentenansicht
- [ ] Re-Design der Navigations-Page


Javascript:
- [ ] Startseite abhängig der Rolle (Dozent/Student) anzeigen
- [ ] Erstellung eines QR-Codes für Anwesenheitskontrolle
- [ ] Auslagerung JS in externe Datei
- [ ] Ajax-Rest-Anfragen an Server
- [ ] QR-Code Erfassung für Position (Raum) und Anwesenheit
- [ ] Darstellung der Event-Teilnehmer und Gruppenkontakte (Page+JS)


Server:
- [ ] REST-Schnittstellen um Informationen der Datenbank zu erhalten (Java?)


Geringere Priorität
===
- [ ] Teilnehmer im Chat anzeigen?!
- [ ] Darstellung: Neues Event erstellen für großen Screen optimieren (Fehlermeldungen, Breite der Form-Elemente)
- [ ] Eigenes Theme erstellen
- [ ] Re-Formatierung des CSS und JS Codes