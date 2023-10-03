const fs = require("fs");
const AlertManagerData = require("./AlertManagerData"); // Asegúrate de tener la clase AlertManagerData en el mismo directorio

fs.readFile("mock.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const payload = JSON.parse(data);

  const alertManagerData = new AlertManagerData();
  alertManagerData.version = payload.version;
  alertManagerData.groupKey = payload.groupKey;
  alertManagerData.truncatedAlerts = payload.truncatedAlerts;
  alertManagerData.status = payload.status;
  alertManagerData.receiver = payload.receiver;
  alertManagerData.groupLabels = payload.groupLabels;
  alertManagerData.commonLabels = payload.commonLabels;
  alertManagerData.commonAnnotations = payload.commonAnnotations;
  alertManagerData.externalURL = payload.externalURL;
  alertManagerData.alerts = payload.alerts;

  alertManagerData.showAllAlerts(); // Suponiendo que has implementado el método showAllAlerts en AlertManagerData
});
