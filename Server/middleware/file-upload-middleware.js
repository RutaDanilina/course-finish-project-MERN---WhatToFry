const multer = require('multer')
const { v4: uuidv4 } = require('uuid')

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

const fileUpload = multer({
    limit: 500000,
    storage: multer.diskStorage({
        destination: (req, file, callBack)=> {
            callBack(null, 'uploads/images')
        },
        filename: (req,file, callBack)=> {
            const ext= MIME_TYPE_MAP[file.mimetype]
            callBack(null, uuidv4() + '.' + ext )
        }
    }),
    fileFilter: (req, file, callBack) => {
        const isValid = !!MIME_TYPE_MAP[file.mimetype]
        let error = isValid ? null : new Error('Invalid Image type! (only jpg, jpge or png files allowed)')
        callBack(error, isValid)
    }
})

module.exports = fileUpload