const fs = require('fs');
const zlib = require('zlib');
const path = require('path');
const { typeObj } = require('../utils/constants');


module.exports = async (req, res) => {
  try {
    const { zipFileName, fileName } = req.body;
    const compressedFilePath = path.join(typeObj.outputZip, zipFileName);
    const decompressedFilePath = path.join(typeObj.output, fileName);

    const readStream = fs.createReadStream(compressedFilePath);
    const writeStream = fs.createWriteStream(decompressedFilePath);

    const gunzip = zlib.createGunzip();

    readStream.pipe(gunzip).pipe(writeStream);

    writeStream.on('finish', () => {
      console.log('File has been decompressed successfully.');
      res.status(200).json({ message: "Unzip success" })
    });
    writeStream.on('error', (error) => {
      console.log('Failed to unzip!!');
      res.status(500).json({ message: error?.message })
    });
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message })
  }
}
