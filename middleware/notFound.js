const notFound = async (req,res) => {
    res.status(500).json({msg: 'Invalid URL'})
}

module.exports = notFound