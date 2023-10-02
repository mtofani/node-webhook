const mysql = require("mysql2/promise");

async function insertar(req) {
  // create the connection
  const connection = await mysql.createConnection({
    host: "172.31.148.233",
    user: "nms",
    database: "webhook",
    password: "nms..iplan",
  });
  try {
    // Convertir req.body a una cadena JSON
    const requestBodyString = JSON.stringify(req.body);

    // Convertir req.ip a una cadena
    const clientIP = req.ip.toString();

    // Obtener el timestamp actual en segundos
    const timestamp = Math.floor(Date.now() / 1000);

    const [rows, fields] = await connection.execute(
      `INSERT INTO requests (body, origin, timestamp) VALUES (?, ?, FROM_UNIXTIME(?))`,
      [requestBodyString, clientIP, timestamp]
    );
    console.log(rows, fields);
  } catch (error) {
    console.error(error);
  } finally {
    // Cerrar la conexión
    await connection.end();
  }
}

module.exports = insertar;
