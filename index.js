const express = require('express');
cors = require('cors')
const busboy = require('connect-busboy');
const path = require('path');
const fs = require('fs-extra');
const extract = require('extract-zip');
const controllers = require('./controllers');
const { typeObj } = require('./utils/constants');
const db = require('./models');

const app = express(); // Initialize the express web server

app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.use(express.static(path.join(__dirname, 'client', 'build')))
app.use(busboy({
  highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
})); // Insert the busboy middle-ware

fs.ensureDir(typeObj.input);
fs.ensureDir(typeObj.inputzip);
fs.ensureDir(typeObj.output);
fs.ensureDir(typeObj.outputZip);

app.get('/api/videoplayer/:fileName/paths/:pathtype', controllers.videoplayer);
app.get('/api/files/:pathtype', controllers.files);
app.post('/api/upload', controllers.upload);
app.post('/api/jobs/register', controllers.registerJobs);
app.get('/api/job/handler/init', controllers.jobServiceHandler);
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
