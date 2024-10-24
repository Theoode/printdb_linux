const fs = require('fs');
const { exec } = require('child_process');
const serviceFilePath = '/etc/systemd/system/printdb.service';
const serviceContent = `
[Unit]
Description=Service d'impression des PDF et étiquettes PRINTDB
After=network.target

[Service]
ExecStart=/usr/bin/node /home/user/printdb_linux/printdb/printDBlin.js
WorkingDirectory=/home/user/printdb_linux/printdb
Restart=always
User=root          
Group=root           
Environment=NODE_ENV=production
StandardOutput=journal
StandardError=journal
SyslogIdentifier=printdb-service

[Install]
WantedBy=multi-user.target
`;

// Fonction pour créer le fichier de service
function createServiceFile() {
    fs.writeFile(serviceFilePath, serviceContent, { mode: 0o644 }, (err) => {
        if (err) {
            console.error('Erreur lors de la création du fichier de service:', err);
            return;
        }
        console.log('Fichier de service créé avec succès:', serviceFilePath);

        // Recharger systemd pour prendre en compte le nouveau service
        exec('sudo systemctl daemon-reload', (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors du rechargement de systemd: ${error.message}`);
                return;
            }
            console.log(`Sortie: ${stdout}`);
            if (stderr) {
                console.error(`Erreur: ${stderr}`);
            }

            // Activer le service pour qu'il démarre au démarrage du système
            exec('sudo systemctl enable printdb.service', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur lors de l'activation du service: ${error.message}`);
                    return;
                }
                console.log(`Service activé pour démarrer au boot: ${stdout}`);

                // Démarrer le service immédiatement
                exec('sudo systemctl start printdb.service', (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Erreur lors du démarrage du service: ${error.message}`);
                        return;
                    }
                    console.log(`Service démarré avec succès: ${stdout}`);
                });
            });
        });
    });
}

// Fonction principale pour installer le service
function installService() {
    if (!fs.existsSync(serviceFilePath)) {
        console.log('Création du fichier de service...');
        createServiceFile();
    } else {
        console.log('Le service existe déjà.');
    }
}

// Exécuter l'installation du service
installService();
