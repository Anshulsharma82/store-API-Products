const handleError = async (err,req,res,next) => {
    console.log("Error in handle error:  ", err)
    res.status(500).json({msg: 'Some Error Occured! Please Check and try again.'})
}

module.exports = handleError;