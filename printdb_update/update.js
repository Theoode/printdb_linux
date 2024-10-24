require('dotenv').config(); // Charger les variables d'environnement depuis .env
const { exec } = require('child_process');
const axios = require('axios');

const token = process.env.GITHUB_TOKEN;
const username = process.env.USERNAME_git;
const repoName = process.env.REPONAME;

async function checkForUpdates() {
    try {
        const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}/branches/master`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Utiliser "Bearer" pour l'authentification
                'Accept': 'application/vnd.github.v3+json',
            }
        });
        const latestCommit = response.data.commit.sha;

        exec(`git rev-parse HEAD`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de la récupération du commit local : ${error.message}`);
                return;
            }

            const localCommit = stdout.trim(); // Récupérer le SHA du commit local

            if (localCommit === latestCommit) {
                console.log('Le dépôt est à jour.');
            } else {
                console.log('Des mises à jour sont disponibles, mise à jour en cours...');
                updateRepo();
            }
        });
    } catch (error) {
        console.error(`Erreur lors de la récupération des informations du dépôt : ${error.message}`);
        console.log('Détails de l\'erreur :', error.response ? error.response.data : error.message);
    }
}

function updateRepo() {
    const repoUrl = `https://${username}:${token}@github.com/${username}/${repoName}.git`;


    exec('sudo systemctl stop printdb.service', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erreur lors de l'arrêt du service : ${error.message}`);
            return;
        }
        console.log('Service "PRINTDB" arrêté.');

        // Exécuter git pull pour mettre à jour le code avec authentification
        exec(`git pull ${repoUrl}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Erreur lors de la mise à jour du dépôt : ${error.message}`);
                return;
            }
            console.log(`Mise à jour réussie : ${stdout}`);

            // Redémarrer le service
            exec('sudo systemctl restart printdb.service', (error, stdout, stderr) => {
                if (error) {
                    console.error(`Erreur lors du redémarrage du service : ${error.message}`);
                    return;
                }
                console.log('Service "PRINTDB" redémarré.');
            });
        });
    });
}

checkForUpdates();
setInterval(checkForUpdates, 10000);