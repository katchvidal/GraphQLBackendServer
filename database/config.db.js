const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const basedatos = async () => {
  try {
    await mongoose.connect(process.env.MONGODBCDN);
    console.log("base de datos conectada");
  } catch (error) {
    console.log(error);
    console.log("Hubo algun error!!!");
    process.exit(1); // Detiene la Aplicacion
  }
};

module.exports = {
  basedatos,
};
