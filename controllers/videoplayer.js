const path = require('path');
const { typeObj } = require('../utils/constants');
const fs = require("fs-extra");

module.exports = (req, res) => {
  const { fileName, pathtype } = req.params;
  const range = req.headers.range
  const videoPath = path.resolve(typeObj[pathtype], fileName);
  const videoSize = fs.statSync(videoPath).size
  const chunkSize = 1 * 1e6;
  const start = Number(range.replace(/\D/g, ""))
  const end = Math.min(start + chunkSize, videoSize - 1)
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4"
  }
  res.writeHead(206, headers)
  const stream = fs.createReadStream(videoPath, {
    start,
    end
  })
  stream.pipe(res)
}
