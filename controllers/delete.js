module.exports = async () => {
  try {
    const fileName = req.params.filename;
    console.log('Delete request received fileName: ', fileName)
    const filePath = path.join(uploadPath, fileName);
    fs.unlinkSync(filePath);
    res.status(200).json({ message: "Delete success" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message })
  }
}
