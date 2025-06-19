// Express-Framework zum Webserver erstellen (Routen, Anfragen...)
const express = require('express');

// 'CORS'-Paket nutzen, damit dein FE & BE mit unterschiedlichen Adresse/Port kommunizieren dürfen
const cors = require('cors');

// Express-App erstellen
const app = express();

// Server-Port, 3000 ist ein gängiger BE Port
const PORT = 3000;

// File System Modul zum Arbeiten mit Dateien & Ordner
const fs = require('fs');
// Üath Modul zum zusammenzusetzen von Dateipfaden
const path = require('path');
// Dateiname, in dem die Namen gespeichert werden sollen.
const NAMES_FILE = 'filesystem.db';
// Vollständiger Pfad zur Datei
const namesFilePath = path.join(__dirname,'db', NAMES_FILE);

// Express Middleware um JSON-Daten im Body von eingehenden Anfragen vom FE zu lesen.
app.use(express.json());

// Express Middleware zum Konfigurieren von CORS. In Prod-Env spezifische URLs angeben
app.use(cors());

// POST-Route für die Resource '/greet'.
// FE POST-Anfragen an 'http://localhost:3000/greet' führen diese Callback-Funktion aus.
// 'req' enthält die eingehenden Daten, 'res' ist zum Senden der Antwort.
app.post('/greet', (req, res) => {
    // Property 'name' aus Body der Anfrage extrahieren.
    const name = req.body.name;
    // Wenn Name nicht gesendet wurde, Fehlermeldung zurückschicken (Status 400 = Bad Request).
    if (!name) {
        return res.status(400).json({ error: 'Name ist erforderlich.' });
    }

    // Wir erstellen den personalisierten Gruß-String.
    const greeting = `Hallo, ${name} von NodeJs Backend! Willkommen bei Ihrer ersten Webapplication!`;

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

// Server starten und auf definierten Port lauschen.
app.listen(PORT, () => {
    console.log(`\nBackend läuft auf http://localhost:${PORT} und ist bereit Grüße zu generieren!\n`);
});
