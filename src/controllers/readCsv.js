const fs = require("fs");
const path = require("path");
const csvParser = require("csv-parser");

async function readCsvToJson(csvFileName) {
  return new Promise((resolve, reject) => {
    const results = [];

    const csvFilePath = path.join(__dirname, "../utils", csvFileName);

    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (data) => {
        console.log("Fila del CSV:", data);
        results.push(data);
      })
      .on("end", () => {
        resolve(results);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

module.exports = readCsvToJson;
