const axios = require("axios");
class PandoraRestAPI {
  constructor(url, other, user = "admin", pass = "pandora", apipass = "1234") {
    this.url = url;
    this.user = user;
    this.pass = pass;
    this.apipass = apipass;
    this.other = other;
    this.other_mode = "url_encode_separator_,";
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
