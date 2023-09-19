const { typeObj } = require("../utils/constants");

module.exports = async () => {
  try {
    const { fileName, pathtype } = req.params;
    console.log('Delete request received fileName: ', fileName)
    const filePath = path.join(typeObj[pathtype], fileName);
    fs.unlinkSync(filePath);
    res.status(200).json({ message: "Delete success" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message })
  }
}
