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
- [x] Anwesenheitsverifikation - Succes / Error Page
- [x] Position scannen Page (QR-Code-Scanner) - Succes / Error Page
- [ ] Kontakt hinzufügen / zur Gruppe hinzufügen über Popup und Checkboxen --> Kontakte verwalten (um auch Kontakte zu löschen)
- [ ] Re-Design der Navigations-Page


Javascript:
- [x] Startseite abhängig der Rolle (Dozent/Student) anzeigen
- [x] Erstellung eines QR-Codes für Anwesenheitskontrolle
- [ ] Auslagerung JS in externe Datei
- [x] Ajax-Rest-Anfragen an Server
- [ ] QR-Code Erfassung für Position (Raum) und Anwesenheit
- [x] Darstellung der Event-Teilnehmer und Gruppenkontakte (Page+JS)
- [ ] Back to Login preventen durch überprüfung beforepageload ob eingeloggt
- [x] Login mit LoginName und Password --> Redirect to error / login again
- [ ] insert ajax loader for ajax requests

Geringere Priorität
===
- [ ] Teilnehmer im Chat anzeigen?!
- [ ] Re-Formatierung des CSS und JS Codes