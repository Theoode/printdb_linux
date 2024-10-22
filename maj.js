import { app, BrowserWindow, dialog } from 'electron';
import simpleGit from 'simple-git';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();
    checkForUpdates();
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

async function checkForUpdates() {
    const git = simpleGit();
    const fetch = (await import('node-fetch')).default;
    const localBranch = await git.revparse(['HEAD']);
    const repoOwner = 'Theoode';
    const repoName = 'printdb';
    const apiURL = `https://api.github.com/repos/${repoOwner}/${repoName}/commits/master`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des données : ${response.statusText}`);
        }

        const remoteData = await response.json();
        const remoteCommitHash = remoteData.sha;

        if (localBranch === remoteCommitHash) {
            mainWindow.close();
        } else {
            console.log('Une nouvelle version est disponible.');
            const choice = dialog.showMessageBoxSync(mainWindow, {
                type: 'question',
                buttons: ['Mettre à jour', 'Ignorer'],
                title: 'Mise à jour disponible',
                message: 'Une nouvelle version est disponible. Voulez-vous mettre à jour maintenant ?'
            });

            if (choice === 0) {
                await git.pull();
                dialog.showMessageBox(mainWindow, {
                    type: 'info',
                    message: 'Votre projet a été mis à jour. Cette fenetre va se fermer automatiquement'

                });
                mainWindow.close();
            }
        }
    } catch (error) {
        console.error("Erreur lors de la vérification des mises à jour :", error);
        dialog.showErrorBox('Erreur', 'Impossible de vérifier les mises à jour.');
    }
}
