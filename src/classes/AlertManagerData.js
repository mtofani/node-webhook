const { errorMonitor } = require("events");
const fs = require("fs");
const { AlertSender } = require("./AlertSender");

const config = JSON.parse(fs.readFileSync("config/rules.json", "utf8"));
const rules = config.rules;
const mode = config.mode;
const disableFilter = config.disableFilter;

class AlertManagerData {
  constructor(payload) {
    this.version = payload.version || "";
    this.groupKey = payload.groupKey || "";
    this.truncatedAlerts = payload.truncatedAlerts || 0;
    this.status = payload.status || "";
    this.receiver = payload.receiver || "";
    this.groupLabels = payload.groupLabels || {};
    this.commonLabels = payload.commonLabels || {};
    this.commonAnnotations = payload.commonAnnotations || {};
    this.externalURL = payload.externalURL || "";
    this.alerts = payload.alerts || [];
  }

  setAlertSender(sender) {
    if (!(sender instanceof AlertSender)) {
      throw new Error("El objeto proporcionado no es un AlertSender válido");
    }
    this.alertSender = sender;
  }

  addAlert = (alert) => {
    this.alerts.push(alert);
  };

  getNumAlerts = () => {
    return this.alerts.length;
  };

  readAlerts = () => {
    console.log("READ ALERT");
    console.log(this.alerts);
    this.alerts.forEach((alert, index) => {
      const shouldProcessAlert = rules.some((rule) => {
        const fieldValue = getNestedProperty(alert, rule.field);

        console.log("Analizando alerta: ", alert.fingerprint);
        if (fieldValue !== undefined) {
          switch (rule.operator) {
            case "equals":
              return fieldValue === rule.value;
            case "contains":
              return fieldValue.includes(rule.value);
            default:
              return false;
          }
        }
        return false;
      });

      if (
        disableFilter ||
        (mode === "whitelist" && shouldProcessAlert) ||
        (mode === "blacklist" && !shouldProcessAlert)
      ) {
        console.log(`Procesando Alert ${index + 1}: de `, this.getNumAlerts());
        console.log(`  Status: ${alert.status}`);
        console.log(`  Namespace: ${alert.labels.namespace}`);
        console.log(`  Severity: ${alert.labels.severity}`);
        console.log(`  Summary: ${alert.annotations.summary}`);
        console.log(`  Description: ${alert.annotations.description}`);
        console.log(`  Starts At: ${alert.startsAt}`);
        console.log("\n");
        this.alertSender.sendAlert(alert);
      }
    });
  };

  readandPush = () => {
    try {
    } catch (error) {
      console.error(`Error en la lectura de alertas ${error.message}`);
      throw error; // Puedes volver a lanzar la excepción o manejarla de otra manera según tus necesidades
    }

    this.alerts.forEach((alert, index) => {
      const shouldProcessAlert = rules.some((rule) => {
        const fieldValue = getNestedProperty(alert, rule.field);

        console.log("Analizando alerta: ", alert.fingerprint);
        if (fieldValue !== undefined) {
          switch (rule.operator) {
            case "equals":
              return fieldValue === rule.value;
            case "contains":
              return fieldValue.includes(rule.value);
            default:
              return false;
          }
        }
        return false;
      });

      if (
        disableFilter ||
        (mode === "whitelist" && shouldProcessAlert) ||
        (mode === "blacklist" && !shouldProcessAlert)
      ) {
        console.log(`Procesando Alert ${index + 1}: de `, this.getNumAlerts());
        console.log(`  Status: ${alert.status}`);
        console.log(`  Namespace: ${alert.labels.namespace}`);
        console.log(`  Severity: ${alert.labels.severity}`);
        console.log(`  Summary: ${alert.annotations.summary}`);
        console.log(`  Description: ${alert.annotations.description}`);
        console.log(`  Starts At: ${alert.startsAt}`);
        console.log("\n");
      }
    });
  };
}

function getNestedProperty(obj, path) {
  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current[key] === undefined) {
      console.log("No se encontró property que haga match");
      return undefined;
    }
    current = current[key];
  }

  return current;
}

module.exports = AlertManagerData;
