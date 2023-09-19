const util = require('util');
const axios = require('axios');
const { Job } = require("../models");
const { jobTypes, typeObj } = require("../utils/constants");

module.exports = async (req, res) => {
  try {
    const { files, pathType, jobType } = req.body;
    const filesList = files.map(file => ({
      jobtype: jobType,
      filepath: `${typeObj[pathType]}/${file}`,
      filename: file,
      jobstatus: jobTypes.JOB_CREATED
    }))
    const resp = await Job.bulkCreate(filesList)
    startJob();
    return res.status(200).json({
      message: "Job registered successfuly.",
      job: resp
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message })
  }
}


async function startJob() {
  try {
    await axios.get(`http://localhost:${process.env.PORT}/api/job/handler/init`);
  } catch (error) {
    console.error('Failed to start job handler')
  }
}
