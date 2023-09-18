const express = require('express');         // Express Web Server
const busboy = require('connect-busboy');   // Middleware to handle the file upload https:/
const path = require('path');               // Used for manipulation with path
const fs = require('fs-extra');
const extract = require('extract-zip');
const controllers = require('./controllers');
const { uploadPath, inputPath } = require('./utils/constants');
const db = require('./models');

const app = express(); // Initialize the express web server


app.use(express.json());
app.use(express.urlencoded());

app.use(express.static(path.join(__dirname, 'client', 'build')))
app.use(busboy({
  highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

fs.ensureDir(uploadPath); // Make sure that he upload path exits
fs.ensureDir(inputPath); // Make sure that he upload path exits

app.get('/api/videoplayer/:fileName/paths/:pathtype', controllers.videoplayer);
app.get('/api/files/:pathtype', controllers.files);
app.post('/api/upload/path/:pathtype', controllers.upload);
app.post('/api/jobs/register', controllers.registerJobs);
app.get('/api/jobs/list', controllers.listJobs);
app.post('/api/unzip/file', controllers.unzip);
app.delete('/api/delete/:filename', controllers.delete);


db.sequelize.sync()
  .then(() => {
    console.log('db is ready')
    return;
  })
  .then(() => {
    const server = app.listen(process.env.PORT || 3200, function (error) {
      if (error) {
        throw error;
      }
      console.log(`Server listening on port ${server.address().port}`);
    })
  })
  .catch(error => {
    console.error('Main error : ', error)
  });
