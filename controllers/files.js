const { typeObj } = require("../utils/constants");
const fs = require('fs-extra');
const path = require('path');

module.exports = async (req, res) => {
  try {
    const { pathtype } = req.params;
    if (!typeObj[pathtype]) throw Error('Invalid pathtype!!');
    fs.readdir(typeObj[pathtype], (err, files) => {
      try {
        files = files.map(function (fileName) {
          return {
            name: fileName,
            time: fs.statSync(path.join(typeObj[pathtype], fileName)).mtime.getTime()
          };
        })
          .sort(function (a, b) {
            return b.time - a.time;
          })
          .map(function (v) {
            return { name: v.name };
          });
        res.status(200).json({ files });
      } catch (error) {
        res.status(500).json({ message: error?.message });
      }
    })
  } catch (error) {
    res.status(400).json({ message: error?.message });
  }
}
