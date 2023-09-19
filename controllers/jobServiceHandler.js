const { fork } = require('node:child_process');
const path = require('path');
const { Job } = require("../models");
const { jobTypes } = require('../utils/constants');

module.exports = async (req, res) => {
  try {
    console.log('Request registed for init job service handler');
    processJobs();
    return res.status(200).json({ message: "Job handler " });
  } catch (error) {
    console.error('StartJob error:', error);
    return res.status(500).json({ message: error?.message })
  }
}

async function processJobs() {
  try {
    const jobsList = await Job.findAll({
      where: { jobstatus: jobTypes.JOB_CREATED },
      order: [
        ['id', 'ASC']
      ],
      limit: 1
    });
    console.log("🚀 ~ file: jobServiceHandler.js~ processJobs ~ jobsList length:", jobsList.length)

    for (job of jobsList) {
      startJobProcess(job)
    }
  } catch (error) {
    console.error("🚀 ~ file: jobServiceHandler.js:32 ~ processJobs ~ error:", error)
  }

}


function startJobProcess(job) {
  console.log("🚀 ~ file: jobServiceHandler.js:40 ~ startJobProcess ~ job:", job)
  const scriptPath = path.join(__dirname, "..", "jobService", "index.js")
  const jobServiceHandler = fork(scriptPath, [job.id]);
  jobServiceHandler.send({ job });

  jobServiceHandler.on('exit', async (code) => {
    console.log("🚀 ~ file: jobServiceHandler.js:51 ~ jobServiceHandler.on ~ exit code:", code)
    processJobs();
  });

  jobServiceHandler.on('message', async (message) => {
    console.log("🚀 ~ file: jobServiceHandler.js:55 ~ jobServiceHandler.on ~ message:", message);
    await job.update({ jobstatus: message.jobStatus });
  });
}
