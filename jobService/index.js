const path = require('path');
const fs = require('fs-extra');
const zlib = require('node:zlib');
const axios = require('axios');
const NodeFormData = require('form-data');
const contstants = require('../utils/constants')

main()

async function main() {
  console.log('Inside main')
  console.log('New job service with process.pid: ', process.pid)
  process.on('message', async ({ job }) => {
    console.log("🚀 ~ file: index.js:14 ~ process.on ~ job id:", job.id)
    const jobCopy = { ...job };
    const jobTypes = jobCopy.jobtype.split(',').map(i => i.trim());
    await processJobTypes(jobTypes, jobCopy)
  })
}


async function processJobTypes(jobTypes, job) {

  if (jobTypes.includes(contstants.jobTypes.ZIP_ORIGINAL_FILE)) {
    try {
      job['zipFilePath'] = await zipFile(job)
      process.send({ id: job.id, jobStatus: contstants.jobTypes.ZIP_ORIGINAL_FILE_SUCCESS })
    } catch (error) {
      console.log("🚀 ~ file: index.js:36 ~ processJobTypes ~ error:", error)
      process.send({ id: job.id, jobStatus: contstants.jobTypes.ZIP_ORIGINAL_FILE_FAILURE })
      process.exit(1);
    }
  }

  if (jobTypes.includes(contstants.jobTypes.UPLOAD_ZIPPED_FILE)) {
    try {
      job['uploadStatus'] = await uploadFile(job)
      process.send({ id: job.id, jobStatus: contstants.jobTypes.UPLOAD_ZIPPED_FILE_SUCCESS })
    } catch (error) {
      console.log("🚀 ~ file: index.js:47 ~ processJobTypes ~ error:", error)
      process.send({ id: job.id, jobStatus: contstants.jobTypes.UPLOAD_ZIPPED_FILE_FAILURE })
      process.exit(1);
    }
  }

  if (jobTypes.includes(contstants.jobTypes.UNZIP_ZIPPED_FILE)) {
    try {
      await unzipFile(job)
      process.send({ id: job.id, jobStatus: contstants.jobTypes.UNZIP_ZIPPED_FILE_SUCCESS })
    } catch (error) {
      console.log("🚀 ~ file: index.js:58 ~ processJobTypes ~ error:", error)
      process.send({ id: job.id, jobStatus: contstants.jobTypes.UNZIP_ZIPPED_FILE_FAILURE })
      process.exit(1);
    }
  }

  // if (jobTypes.includes(contstants.jobTypes.DELETE_ZIPPED_FILE)) {
  //   try {
  //     await deleteZipFile(job)
  //     process.send({ id: job.id, jobStatus: contstants.jobTypes.DELETE_ZIPPED_FILE_SUCCESS })
  //   } catch (error) {
  //     console.log("🚀 ~ file: index.js:69 ~ processJobTypes ~ error:", error)
  //     process.send({ id: job.id, jobStatus: contstants.jobTypes.DELETE_ZIPPED_FILE_FAILURE })
  //     process.exit(1);
  //   }
  // }

  process.exit(0);
}

function zipFile(jobObj) {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(jobObj.filepath)) {
        throw Error(`File '${jobObj.filepath}' don't exists or invalid`)
      }
      const sourceFilePath = jobObj.filepath;
      const compressedFilePath = path.join(contstants.typeObj.inputzip, `${jobObj.filename}.gz`);
      const readStream = fs.createReadStream(sourceFilePath);
      const writeStream = fs.createWriteStream(compressedFilePath);
      const gzip = zlib.createGzip();
      readStream.pipe(gzip).pipe(writeStream);

      writeStream.on('finish', () => {
        console.log('File has been compressed successfully.');
        resolve(compressedFilePath);
      });
      writeStream.on('error', (error) => {
        console.error("🚀 ~ file: index.js ~ writeStream.on ~ error:", error)
        reject(error)
      })
    } catch (error) {
      console.log("🚀 ~ file: index.js:93 ~ returnnewPromise ~ error:", error)
      reject(error)
    }
  })
}

async function uploadFile(jobObj) {
  const proxiesToDelete = [
    'HTTPS_PROXY', 'HTTP_PROXY', 'http_proxy', 'https_proxy'
  ]
  for (let proxy of proxiesToDelete) {
    delete process.env[proxy]
  }
  const url = `${process.env.BACKEND_SERVICE_HOST}/api/upload`
  const form_data = new NodeFormData();
  form_data.append('file', fs.createReadStream(jobObj.zipFilePath), path.basename(jobObj.zipFilePath));
  const request_config = {
    method: "post",
    url,
    headers: {
      "Content-Type": "multipart/form-data"
    },
    data: form_data
  };
  return await axios(request_config);
}


async function unzipFile(jobObj) {
  const url = `${process.env.BACKEND_SERVICE_HOST}/api/unzip/file`
  const request_config = {
    method: "post",
    url,
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      zipFileName: path.basename(jobObj.zipFilePath),
      fileName: path.basename(jobObj.filename)
    }
  };
  return await axios(request_config);
}


// async function deleteZipFile(jobObj) {
//   console.log('jobObj')

// }

