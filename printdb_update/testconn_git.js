require('dotenv').config();
const axios = require('axios');

const token = process.env.GITHUB_TOKEN;
const username = process.env.USERNAME_git;
const repoName = process.env.REPONAME;

async function testConnection() {
    try {
        // Requête de test à l'API GitHub pour vérifier les informations du dépôt
        const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Utilisation du token pour l'accès
                'Accept': 'application/vnd.github.v3+json',
            }
        });

        // Afficher la réponse pour voir si la connexion est réussie
        console.log('Connexion réussie. Informations du dépôt :', response.data);
    } catch (error) {
        // Afficher les erreurs si la connexion échoue
        console.error('Erreur lors de la connexion :', error.message);
        if (error.response) {
            console.log('Détails de l\'erreur :', error.response.data); // Détails de l'erreur de l'API
        } else {
            console.error('Erreur inconnue :', error); // Affiche d'autres types d'erreurs
        }
    }
}

// Appeler la fonction pour tester la connexion
testConnection();