const { Job } = require("../models");
const { jobTypes, typeObj } = require("../utils/constants");

module.exports = async (req, res) => {
  try {
    console.log('Job: ', Job)
    const { files, pathType, jobType } = req.body;
    const filesList = files.map(file => ({
      jobtype: jobType,
      filepath: `${typeObj[pathType]}/${file}`,
      jobstatus: jobTypes.JOB_CREATED
    }))
    const resp = await Job.bulkCreate(filesList)
    res.status(200).json({
      message: "Job registered successfuly.",
      job: resp
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message })
  }
}
