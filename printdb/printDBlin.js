const os = require('os');
const { connectToDB } = require('../config.js');
const { exec } = require('child_process');
const path = require("path");


// Fonction pour obtenir les adresses IP de la machine locale
function getIpList() {
    const interfaces = os.networkInterfaces();
    let ipList = [];

    for (let iface in interfaces) {
        for (let ifaceDetails of interfaces[iface]) {
            if (ifaceDetails.family === 'IPv4' && !ifaceDetails.internal) {
                ipList.push(ifaceDetails.address);
            }
        }
    }
    return ipList.join('\n');
}

async function runQuery() {
    try {
        let listeIp = getIpList();
        let tmp = listeIp.split('\n');
        let formattedListeIp = tmp.map(ip => `'${ip}'`).join(',');

        let requete = `
            SELECT ID_IMP, IP, NOM, TYPE, ORIENTATION, ISNULL(printer_name, '') AS printer_name
            FROM DBV3.dbo.impression
            WHERE IP IN (${formattedListeIp}) AND statut = 1`;

        let db = await connectToDB();
        let result = await db.request().query(requete);

        if (result.recordset.length > 0) {
            let nomfic = '/home/user/TEST/PREP_ETIQ_SP_920000243_4.pdf';
            let id_imp = result.recordset[0].ID_IMP;
            let orientation = result.recordset[0].ORIENTATION;
            let type = result.recordset[0].TYPE;
            let printerName = result.recordset[0].printer_name;
            let updateQuery = `UPDATE DBV3.dbo.impression SET statut = 2 WHERE id_imp = ${id_imp}`;
            let updateResult = await db.request().query(updateQuery);

            if (updateResult.rowsAffected[0] > 0) {
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
                /*else if (type === 11) {
                    printerName = printerName === "" ? "IMP_ETIQ" : printerName;
                    let command = `${sumatra}SumatraPDF.exe -print-to "${printerName}" -print-settings "${orientation}" "${nomfic}"`;
                    exec(command, (error, stdout, stderr) => {
                        console.log(`Sortie: ${stdout}`);
                    });
                }

              else if (type === 35) {
                    printerName = printerName === "" ? "IMP_ETIQ" : printerName;
                }
               */
            }
            let checkQuery = `SELECT 1 FROM DBV3.dbo.impression WHERE id_imp = ${id_imp}`;
            let checkResult = await db.request().query(checkQuery);
            if (checkResult.recordset.length > 0) {
                let updateQuery = `UPDATE DBV3.dbo.impression SET statut = 3 WHERE id_imp = ${id_imp}`;
                let updateResult = await db.request().query(updateQuery);
                console.log('Mise à jour réussie:', updateResult);
            }
        } else {
            let print = 2;
            console.log(`Print: ${print}`);
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
