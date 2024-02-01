class Alert {
  constructor(alert) {
    this.status = alert.status || "";
    this.labels = {
      namespace: alert.labels.namespace || "",
      severity: alert.labels.severity || "",
    };
    this.annotations = {
      summary: alert.annotations.summary || "",
      description: alert.annotations.description || "",
    };
    this.startsAt = alert.startsAt || "";
    this.fingerprint = alert.fingerprint || "";
  }
}

module.export = Alert;
