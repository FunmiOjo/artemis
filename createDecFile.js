const fs = require("fs");
const csv = require("fast-csv");
const path = require("path");

const init = async () => {
  let descriptions = [];
  var stream = await fs.createReadStream(path.join(__dirname, "podcasts.csv"));
  const headers = [, , , , , , , , "Description"];
  csv
    .fromStream(stream, {headers})
    .on("data", function(data) {
      descriptions.push(data["Description"]);
    })
    .on("end", async function() {
      var file = await fs.createWriteStream("descriptions.js");
      file.on("error", function(err) {
        console.log("error handle", err.message);
      });
      var file = await fs.createWriteStream("descriptions.js");
      await file.on("error", function(err) {
        console.log("error handle", err.message);
      });

      await file.write("let descriptions = [");

      descriptions.forEach(async item => await file.write(`\`${item}\`, `));

      await file.write("];\nmodule.exports = descriptions;");
    });
};
init();
