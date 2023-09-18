const { Job } = require("../models");
const { jobTypes, typeObj } = require("../utils/constants");

module.exports = async (req, res) => {
  try {
    const { jobStatus } = req.query;
    let query = {}
    if (jobStatus) {
      query = { where: { jobstatus: jobTypes[jobStatus] } }
    }
    const jobsList = await Job.findAll(query);
    res.status(200).json({
      message: "Job listed successfuly.",
      jobs: jobsList
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message })
  }
}
