// Wir importieren das Express-Framework, um unseren Webserver zu erstellen.
// Express.js macht es einfach, Routen zu definieren und Anfragen zu verarbeiten.
const express = require('express');

// Wir importieren das 'cors'-Paket. CORS (Cross-Origin Resource Sharing) ist wichtig,
// damit dein Frontend (das von einer anderen Adresse oder einem anderen Port kommt)
// mit diesem Backend kommunizieren darf. Ohne CORS gäbe es Sicherheitsprobleme im Browser.
const cors = require('cors');

// Wir erstellen eine neue Express-Anwendung.
const app = express();

// Wir definieren den Port, auf dem unser Server laufen soll.
// Standardmäßig ist 3000 ein gängiger Port für Backend-Anwendungen.
const PORT = 3000;

// Wir importieren das 'fs' (File System) Modul.
// Dieses Modul ist in Node.js eingebaut und ermöglicht das Arbeiten mit Dateien.
const fs = require('fs');
// Wir importieren 'path', um Dateipfade korrekt zusammenzusetzen.
const path = require('path');
// Dateiname, in dem die Namen gespeichert werden sollen.
const NAMES_FILE = 'filesystem.db';
// NEU: Vollständiger Pfad zur Datei, um sicherzustellen, dass sie im gleichen Verzeichnis wie server.js liegt.
const namesFilePath = path.join(__dirname,'db', NAMES_FILE);


// Middleware: Diese Zeile erlaubt es Express, JSON-Daten im Body von eingehenden Anfragen zu lesen.
// Dein Frontend sendet den Namen als JSON, also brauchen wir das.
app.use(express.json());

// Middleware: Hier konfigurieren wir CORS.
// 'cors()' ohne weitere Optionen erlaubt Anfragen von jeder Herkunft (Origin).
// Für eine Produktionsumgebung sollte man dies spezifischer auf die URL deines Frontends beschränken.
app.use(cors());

// Wir definieren eine 'POST'-Route für den Pfad '/greet'.
// Wenn das Frontend eine POST-Anfrage an 'http://localhost:3000/greet' sendet,
// wird diese Funktion (Callback-Funktion) ausgeführt.
// 'req' (request) enthält die eingehenden Daten, 'res' (response) ist zum Senden der Antwort.
app.post('/greet', (req, res) => {
    // Property 'name' aus Body der Anfrage extrahieren.
    const name = req.body.name;
    // Wenn Name nicht gesendet wurde, Fehlermeldung zurückschicken (Status 400 = Bad Request).
    if (!name) {
        return res.status(400).json({ error: 'Name ist erforderlich.' });
    }

    // Wir erstellen den personalisierten Gruß-String.
    const greeting = `Hallo, ${name}! Willkommen bei Ihrer ersten Webapplication!`;

    // Den empfangenen Namen in die lokale Datei als neu Zeile anhängen.
    fs.appendFile(namesFilePath, name + '\n', (err) => {
        if (err) {
            // Bei Speicherungsfehler, Fehlermeldung ausgeben. Aber trotzdem weitermachen, Gruß generiert wurde
            console.error('Fehler beim Speichern des Namens in der Datei:', err);
        } else {
            console.log(`Name "${name}" erfolgreich in ${NAMES_FILE} gespeichert.`);
        }
    });

    // Gruß in der Property 'greeting' als JSON-Objekt zurücksenden
    console.log(`Eingegangene Anfrage wird mit folgender Nachricht beantwortet: ${greeting}`);
    res.status(200).json({ greeting: greeting });
});

// Wir starten den Server und lassen ihn auf dem definierten Port lauschen.
// Wenn der Server erfolgreich startet, wird eine Nachricht in der Konsole angezeigt.
app.listen(PORT, () => {
    console.log(`Backend läuft auf http://localhost:${PORT}`);
    console.log('Bereit, Grüße zu generieren!');
});
