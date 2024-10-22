const { exec } = require('child_process');
const path = require("path");

async function runQuery() {
    try {
        let nomfic = '/home/user/TEST/ETIQ_RECEP_18_3560237536088_3_1210805.pdf';
        let orientation = 1;
        let type=10;
        let printerName = '';

        if (type === 1) {
            printerName = printerName === "" ? "IMP_ETIQ" : printerName;
            orientation = "1" ? "orientation-requested=3" : "orientation-requested=4";
            let command = `lp -d "${printerName}" -o "${orientation}" "${nomfic}"`;
            exec(command, (error, stdout, stderr) => {console.log(`Sortie: ${stdout}`);});
        }
        else if(type===3){
            printerName = printerName === "" ? "IMP_ETIQ" : printerName;
            orientation = "1" ? "orientation-requested=3" : "orientation-requested=4";
            let command = `lp -d "${printerName}" -o "${orientation}" "${nomfic}"`;
            exec(command, (error, stdout, stderr) => {console.log(`Sortie: ${stdout}`);});
        }
        else if (type===5){
            printerName = printerName === "" ? "IMP_ETIQ" : printerName;
            orientation = "1" ? "orientation-requested=3" : "orientation-requested=4";
            let command = `lp -d "${printerName}" -o "${orientation}" "${nomfic}"`;
            exec(command, (error, stdout, stderr) => {console.log(`Sortie: ${stdout}`);});
        }
        else if (type===6){
            printerName = printerName === "" ? "IMP_DOC" : printerName;
            orientation = "1" ? "orientation-requested=3" : "orientation-requested=4";
            let command = `lp -d "${printerName}" -o "${orientation}" "${nomfic}"`;
            exec(command, (error, stdout, stderr) => {console.log(`Sortie: ${stdout}`);});
        }
        else if (type === 7) {
            let quantity = extractQuantity(nomfic);
            orientation = "1" ? "orientation-requested=3" : "orientation-requested=4";
            printerName = printerName === "" ? "IMP_ETIQ" : printerName;
            for (let i = 1; i <= quantity; i++) {
                let command = `lp -d "${printerName}" -o "${orientation}" -P "${i}" "${nomfic}"`;
                exec(command, (error, stdout, stderr) => {console.log(`Sortie: ${stdout}`);});
            }
        }
        else if (type === 10) {
            printerName = printerName === "" ? "IMP_ETIQ" : printerName;
            orientation = "1" ? "orientation-requested=3" : "orientation-requested=4";
            let quantity = extraireNombre(nomfic) || 1;
            let quantity1 = Math.ceil(quantity / 2);
            for (let i = 0; i < quantity1; i++) {
                let command = `lp -d "${printerName}" -o "${orientation}" "${nomfic}"`;
                exec(command, (error, stdout, stderr) => {
                    if (error) {console.error(`Erreur: ${error.message}`);}if (stderr) {console.error(`Erreur STDERR: ${stderr}`);}console.log(`Sortie: ${stdout}`);});
            }
        }


    } catch (error) {
        console.error('Erreur lors de l’exécution de la requête SQL:', error);
    }
}

function extractQuantity(filePath) {
    const fileName = path.basename(filePath);
    const match = fileName.match(/_(\d+)\.pdf$/);
    return match ? parseInt(match[1], 10) : 1;
}

function extraireNombre(str) {
    let segments = str.split('_');
    if (segments.length >= 6) {
        let nombre = segments[4];
        return isNaN(nombre) ? null : parseFloat(nombre);
    } else {
        return null;
    }
}

runQuery();
