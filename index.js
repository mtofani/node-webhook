const express = require("express");
const fs = require("fs");
//const PandoraRestAPI = require("./util/PandoraRESTAPI");
const logger = require("./util/logger");
const app = express();
const PORT = process.env.PORT || 3000;
const insertar = require("./db/db"); // Aquí importamos la función insertar
const AlertManagerData = require("./src/classes/AlertManagerData");
const alertSchema = require("./schemas/alertSchema");
const { PandoraSender, AlertSender } = require("./src/classes/AlertSender");

const validateJSONMiddleware = (req, res, next) => {
  // Verificar si el tipo de contenido es JSON
  const contentType = req.headers["content-type"];
  if (!contentType || contentType.indexOf("application/json") !== 0) {
    // Si no es JSON, enviar una respuesta de error
    return res.status(400).send("La solicitud debe tener el tipo de contenido application/json");
  }

  // Llamar a express.json() para analizar el cuerpo de la solicitud JSON
  express.json()(req, res, (err) => {
    if (err) {
      // Manejar errores si el análisis del cuerpo falla
      console.error("Error al analizar el cuerpo de la solicitud JSON:", err);
      return res.status(400).send("Error al analizar el cuerpo de la solicitud JSON");
    }

    // Si todo está bien, pasar al siguiente middleware
    next();
  });
};

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request at ${req.url}`, { body: req.body });
  console.log("JEJE");
  next();
});

app.post("/offmocks", async (req, res) => {
  try {
    // Aquí puedes manejar la lógica para las solicitudes GET en /webhook
    fs.readFile("./mocks/mock.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }

      const payload = JSON.parse(data);
      console.log(payload);
      const alertManagerData = new AlertManagerData({
        ...payload,
      });
      alertManagerData.readAlerts();
    });

    res.send("GET request received at /webhook :) ");
    /* const other = [
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
  */
    //const API = new PandoraRestAPI("PANDORA_PROD", other);
    //const data = await API.create_event();

    console.log("Respuesta del servidor:", data);
  } catch (error) {
    console.error("Error:", error);
  }
});

//app.post("/mocks", validateJSONMiddleware, async (req, res, next) => {
app.post("/mocks", validateJSONMiddleware, async (req, res, next) => {
  // Aquí puedes manejar la lógica para las solicitudes GET en /webhook
  try {
    console.log("MOCKS");
    const payload = req.body;
    console.log("PAYLOAD RECIBIDO", payload);

    const { error, value } = alertSchema.validate(payload);
    console.log(error, value);

    if (error) {
      throw new Error(error.details[0].message);
    }
    const alertSender = new PandoraSender("PANDORA_PROD");
    const alertManagerData = new AlertManagerData({
      ...payload,
    });
    alertManagerData.setAlertSender(alertSender);

    alertManagerData.readAlerts();
    return res.status(200).send("Alarmas procesadas OK");
  } catch (error) {
    console.log(error);
    // Si hay un error al parsear el JSON, se captura aquí
    return res.status(400).send("Error al procesar las alertas");
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
