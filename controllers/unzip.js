module.exports = async (req, res) => {
  try {
    const { fileName } = req.params;
    console.log('unzip request received fileName: ', fileName)
    await extract(path.join(uploadPath, fileName), { dir: uploadPath })
    res.status(200).json({ message: "Unzip success" })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error?.message })
  }
}
