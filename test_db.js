const db = require('./config/db');

async fun testConnection() {
    try {
        console.log("Intentando conectar a la base de datos...");
        const [rows] = await db.execute('SELECT 1 + 1 AS result');
        if (rows[0].result === 2) {
            console.log("✅ CONEXIÓN EXITOSA: La base de datos MySQL está respondiendo correctamente.");
        }

        const [tables] = await db.execute('SHOW TABLES');
        console.log("Tablas encontradas:", tables.map(t => Object.values(t)[0]).join(', '));

    } catch (error) {
        console.error("❌ ERROR DE CONEXIÓN:");
        console.error("Mensaje:", error.message);
        console.error("Código:", error.code);
        console.log("\nSugerencias:");
        console.log("1. Verifica que el servidor MySQL esté encendido (XAMPP/WAMP/Docker).");
        console.log("2. Asegúrate de haber ejecutado el script 'database_schema.sql'.");
        console.log("3. Revisa las credenciales en 'config/db.js' o el archivo '.env'.");
    } finally {
        process.exit();
    }
}

testConnection();
