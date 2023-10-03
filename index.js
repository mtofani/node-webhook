const express = require("express");
const bodyParser = require("body-parser");
const AlertManagerData = require("./src/AlertManagerData");
const PandoraRestAPI = require("./src/PandoraRESTAPI");
const logger = require("./logger");
const PANDORA_URL = "http://localhost:8080/pandora_console/include/api.php";
const app = express();
const PORT = process.env.PORT || 3000;
const insertar = require("../node-webhook/src/db"); // Aquí importamos la función insertar

app.use(bodyParser.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request at ${req.url}`, { body: req.body });
  next();
});

app.get("/pandorasender", async (req, res) => {
  try {
    // Aquí puedes manejar la lógica para las solicitudes GET en /webhook
    res.send("GET request received at /webhook :) ");

    const other = [
      "Holaaaaaaaaaaaaaaaaaaaaaa", //"event_text",
      1, //"id_group",
      2, // id_agent (numeric type)
      0, // status (1 for Validated)
      "admin", //456, // id_user (numeric type)
      "alert_fired",
      4, // severity (Normal)
      //789, // id_agent_module (numeric type)
      //1011, // id_alert_am (numeric type)
      //"critical_instructions",
      //"warning_instructions",
      //"unknown_instructions",
      //"comment",
      //"owner_user_name",
      //"event_source",
      //"tags",
      //"base64_encoded_custom_data",
      //"server_id",
      //"id_extra",
    ];

    const API = new PandoraRestAPI(PANDORA_URL, other);
    const data = await API.create_event();

    console.log("Respuesta del servidor:", data);
  } catch (error) {
    console.error("Error:", error);
  }
});

app.get("/webhook", (req, res) => {
  res.sendStatus(200);
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
