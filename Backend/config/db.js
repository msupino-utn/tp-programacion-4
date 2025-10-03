import sql from "mssql";

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

async function getConnection() {
    try {
        const pool = await sql.connect(dbConfig);
        return pool;
    } catch (err) {
        console.error("❌ Error de conexión a la BD:");
        console.error("Mensaje:", err.message);
        console.error("Código:", err.code);
        console.error("Detalles completos:", err);
        throw err;
    }
}

export { getConnection, sql };