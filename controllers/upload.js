const { typeObj } = require("../utils/constants");
const fs = require('fs-extra');
const path = require('path');

module.exports = (req, res) => {
  try {
    if (!req.busboy) throw Error("Empty file received!!")
    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, filename) => {
      try {
        console.log(`Upload of '${filename.filename}' started`);

        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(typeObj.outputZip, filename.filename));
        // Pipe it trough
        file.pipe(fstream);


        fstream.on('error', () => {
          console.error(`Failed to upload '${filename.filename}'`);
          res.status(500).json({ message: "Upload stream failed" })
        });

        fstream.on('close', () => {
          console.log(`Upload of '${filename.filename}' stream close`);
          res.status(200).json({ message: "Upload stream closed" })
        });

        fstream.on('finish', () => {
          console.log(`Upload of '${filename.filename}' finished`);
        });
      } catch (error) {
        console.error(`Failed to upload '${filename?.filename}'`);
        res.status(500).json({ message: error?.message })
      }

    });
    req.busboy.on('error', (error) => {
      console.log("🚀 ~ file: upload.js:44 ~ req.busboy.on ~ error:", error)
    });
  } catch (error) {
    console.error(`Failed before receiving the file. May be file is empty`);
    res.status(500).json({ message: error?.message })
  }
}
