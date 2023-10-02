const express = require("express");
const bodyParser = require("body-parser");

const logger = require("./logger");

const app = express();
const PORT = process.env.PORT || 3000;
const insertar = require("../node-webhook/src/db"); // Aquí importamos la función insertar

app.use(bodyParser.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request at ${req.url}`, { body: req.body });
  next();
});

app.post("/webhook", (req, res) => {
  //console.log("Received webhook:", req.body);
  //req.log.info("something");
  //logger.debug("The is the home '/' route.");
  console.log(req.ip);
  insertar(req)
    .then(() => {
      console.log("Operación completada. La conexión se cerró.");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  res.sendStatus(200);
});

app.post("/events", (req, res) => {
  //console.log("Received webhook:", req.body);
  //req.log.info("something");
  logger.debug("The is the home '/' route.");
  res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
