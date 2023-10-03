class AlertManagerData {
  constructor() {
    this.version = "4";
    this.groupKey = "";
    this.truncatedAlerts = 0;
    this.status = "";
    this.receiver = "";
    this.groupLabels = {};
    this.commonLabels = {};
    this.commonAnnotations = {};
    this.externalURL = "";
    this.alerts = [];
  }

  addAlert = (alert) => {
    this.alerts.push(alert);
  };

  getNumAlerts = () => {
    return this.alerts.length;
  };

  showAllAlerts = () => {
    this.alerts.forEach((alert, index) => {
      console.log(`Alert ${index + 1}:`);
      console.log(`  Status: ${alert.status}`);
      console.log(`  Labels: `, alert.labels);
      console.log(`  Annotations: `, alert.annotations);
      console.log(`  Starts At: ${alert.startsAt}`);
      console.log(`  Ends At: ${alert.endsAt}`);
      console.log(`  Generator URL: ${alert.generatorURL}`);
      console.log(`  Fingerprint: ${alert.fingerprint}`);
      console.log("\n");
    });
  };
}

module.exports = AlertManagerData;
