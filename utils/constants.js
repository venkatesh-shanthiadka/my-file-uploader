const path = require("path");
const uploadPath = path.join('/tmp/upload-dir'); // Register the upload path
const inputPath = path.join('/tmp/input-dir'); // Register the upload path

const typeObj = {
  input: inputPath,
  output: uploadPath
}

const jobTypes = {
  JOB_CREATED: "JOB_CREATED",
  JOB_SUCCESS: "JOB_SUCCESS",
  JOB_FAILED: "JOB_FAILED"
}

module.exports = {
  typeObj,
  uploadPath,
  inputPath,
  jobTypes
}
