fhbapp
======
TODO:

Entscheidung treffen:
- Vordefinierte Gruppenchats (Hackathon?)
- QR-Code bei Eventdetails bereits sofort darstellen oder als Popup lassen?
- Chat (Push vs. Pull vs. PubNub) - Chaträume wie Subscribe?


Design:
- [x] Gruppen erstellen Page
- [x] Anwesenheitskontrolle - Page
- [x] Authentifizierungspage + Error Page
- [x] Darstellung der Gruppen unter Kontakte muss umgestaltet werden (evtl. als eigener Menüpunkt - siehe Settings)
- [x] Einheitliche Darstellung eines Themes
- [x] Darstellung der (nicht) anwesenden Personen (Page)
- [x] Button aktualisieren für Status für Dozent wie in Studentenansicht
- [ ] Anwesenheitsverifikation - Succes / Error Page
- [ ] Position scannen Page (QR-Code-Scanner) - Succes / Error Page
- [ ] Kontakt hinzufügen / zur Gruppe hinzufügen über Popup und Checkboxen --> Kontakte verwalten (um auch Kontakte zu löschen)
- [ ] Kontaktliste wie bei Event-Teilnehmerliste (als Link)
- [ ] Re-Design der Navigations-Page


Javascript:
- [x] Startseite abhängig der Rolle (Dozent/Student) anzeigen
- [x] Erstellung eines QR-Codes für Anwesenheitskontrolle
- [ ] Auslagerung JS in externe Datei
- [ ] Ajax-Rest-Anfragen an Server
- [ ] QR-Code Erfassung für Position (Raum) und Anwesenheit
- [ ] Darstellung der Event-Teilnehmer und Gruppenkontakte (Page+JS)
- [ ] Back to Login preventen durch überprüfung beforepageload ob eingeloggt
- [ ] Login mit LoginName und Password --> Redirect to error / login again
- [ ] insert ajax loader for ajax requests

Geringere Priorität
===
- [ ] Teilnehmer im Chat anzeigen?!
- [ ] Darstellung: Neues Event erstellen für großen Screen optimieren (Fehlermeldungen, Breite der Form-Elemente)
- [ ] Eigenes Theme erstellen
- [ ] Re-Formatierung des CSS und JS Codes
- [ ] Nur eindeutige ID's verwenden