const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');
const extract = require('extract-zip')

const app = express(); // Initialize the express web server

app.use(express.static(path.join(__dirname, 'client', 'build')))
app.use(busboy({
  highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware


const uploadPath = path.join('/tmp/upload-dir'); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits


app.get('/api/videoplayer/:fileName', (req, res) => {
  const fileName = req.params.fileName
  const range = req.headers.range
  const videoPath = path.resolve(uploadPath, fileName);
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
})

app.get('/api/files', (req, res) => {
  fs.readdir(uploadPath, (err, files) => {
    try {
      files = files.map(function (fileName) {
        return {
          name: fileName,
          time: fs.statSync(path.join(uploadPath, fileName)).mtime.getTime()
        };
      })
        .sort(function (a, b) {
          return b.time - a.time;
        })
        .map(function (v) {
          return { name: v.name };
        });
      res.status(200).json({ files });
    } catch (error) {
      res.status(500).json({ message: error?.message });
    }
  })
})


app.post('/api/upload', (req, res) => {
  try {

    if (!req.busboy) throw Error("Empty file received!!")
    req.pipe(req.busboy); // Pipe it trough busboy

    req.busboy.on('file', (fieldname, file, filename) => {
      try {
        console.log(`Upload of '${filename.filename}' started`);

        // Create a write stream of the new file
        const fstream = fs.createWriteStream(path.join(uploadPath, filename.filename));
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
  } catch (error) {
    console.error(`Failed before receiving the file. May be file is empty`);
    res.status(500).json({ message: error?.message })
  }
});

app.get('/api/unzip/:filename', async (req, res) => {
  try {
    const fileName = req.params.filename;
    console.log('unzip request received fileName: ', fileName)
    await extract(path.join(uploadPath, fileName), { dir: uploadPath })
    res.status(200).json({ message: "Unzip success" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message })
  }
});

app.delete('/api/delete/:filename', async (req, res) => {
  try {
    const fileName = req.params.filename;
    console.log('Delete request received fileName: ', fileName)
    const filePath = path.join(uploadPath, fileName); 
    fs.unlinkSync(filePath);
    res.status(200).json({ message: "Delete success" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message })
  }
});

const server = app.listen(process.env.PORT || 3200, function () {
  console.log(`Listening on port ${server.address().port}`);
});
