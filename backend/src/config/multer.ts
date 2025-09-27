import multer from 'multer'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import cloudinary from './cloudinary.js'

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        //@ts-ignore
        folder: 'royal_chats',
        //@ts-ignore
        formats: async (req,file) => 'jpg',
        transformation: [
            { height: 600, crop: 'scale' },
            {quality: 'auto:best'},
            {fetch_format: 'auto'}
        ]
    }
})
const upload = multer({ storage })

export default upload