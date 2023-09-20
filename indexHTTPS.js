const express = require("express");
const https = require("https");
const fs = require("fs");

const logger = require("./logger");

const app = express();
const PORT = process.env.PORT || 9000;

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request at ${req.url}`, { body: req.body });
  next();
});

app.post("/webhook", (req, res) => {
  res.sendStatus(200);
  console.log("HOLAAAA")
});

app.post("/events", (req, res) => {
  logger.debug("This is the home '/' route.");
  res.sendStatus(200);
});

//const options = {
 // key: fs.readFileSync('ruta/de/la/clave-privada.pem'),
  //cert: fs.readFileSync('ruta/del/certificado-ssl.pem')
//};

https.createServer(app).listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

