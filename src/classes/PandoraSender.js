const config = require("../../config/config.json");
const axios = require("axios");
const AlertSender = require("./AlertSender");

class PandoraSender extends AlertSender {
  constructor(datasource, other) {
    super();
    this.datasource = datasource;
    this.other = other;
  }

  async sendAlert(alert) {
    console.log("SENDING ALERT###########");
    //super.sendAlert(alert); // Llama al método de la clase base (puedes quitar esto si no lo necesitas)
    console.log(alert);
    // Lógica específica para enviar a la API Pandora
    const sourceConfig = config[this.datasource];
    console.log(alert.labels);
    const event_text = `${alert.labels.alertname} ${alert.labels.namespace}`;
    const other = [event_text, "1", 164, 0, 1, "alert_fired", 4, "CORE"].join(",");

    console.log(JSON.stringify(other));
    try {
      const response = await axios.get(sourceConfig.apiUrl, {
        params: {
          op: "set",
          op2: "create_event",
          user: sourceConfig.user,
          pass: sourceConfig.pass,
          apipass: sourceConfig.apipass,
          other_mode: "url_encode_separator_,",
          other: other,
        },
      });
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  }
}

module.exports = PandoraSender;
