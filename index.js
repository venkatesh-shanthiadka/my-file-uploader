const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https://github.com/mscdex/connect-busboy
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');

const app = express(); // Initialize the express web server
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware


const uploadPath = path.join('/tmp/upload-dir'); // Register the upload path
fs.ensureDir(uploadPath); // Make sure that he upload path exits


app.get('/', (req, res) => {
    res.send('Hello World');
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

const server = app.listen(process.env.PORT || 3200, function () {
    console.log(`Listening on port ${server.address().port}`);
});