const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'depotbingo',
    server: '192.168.2.147',
    database: 'DBV3',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function connectToDB() {
    try {
        let pool = await sql.connect(config);
        console.log('Connexion réussie à la base de données SQL Server');
        return pool;
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
        throw err;
    }
}

module.exports = {
    connectToDB
};
