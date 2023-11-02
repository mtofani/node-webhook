const axios = require("axios");
const config = require("../config.json");

class PandoraRestAPI {
  constructor(datasource, other) {
    const sourceConfig = config[datasource];
    this.url = sourceConfig.url;
    this.user = sourceConfig.user;
    this.pass = sourceConfig.pass;
    this.apipass = sourceConfig.apipass;
    this.other_mode = "url_encode_separator_,";
    this.other = other;
  }

  create_event = async () => {
    console.log(this.other);
    try {
      const response = await axios.get(this.url, {
        params: {
          op: "set",
          op2: "create_event",
          user: this.user,
          pass: this.pass,
          apipass: this.apipass,
          other_mode: this.other_mode,
          other: JSON.stringify(this.other),
        },
      });
      console.log("Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error:", error);
    }
  };
}
module.exports = PandoraRestAPI;
