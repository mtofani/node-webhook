const fs = require("fs");
const AlertManagerData = require("./classes/AlertManagerData"); // Asegúrate de tener la clase AlertManagerData en el mismo directorio

//const config = JSON.parse(fs.readFileSync("./config/rules.json", "utf8"));
//const rules = config.rules;
//const mode = config.mode;

fs.readFile("../mocks/mock.json", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const payload = JSON.parse(data);

  const alertManagerData = new AlertManagerData({
    ...payload,
  });
  alertManagerData.readAlerts();
});
