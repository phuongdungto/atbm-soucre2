
import multer from 'multer';
import * as path from 'path';
import { BadRequest } from 'http-errors';


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../../public/post/image'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    },

})

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../../public/avatar/image'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    },

})

function createMulter(object: string, { allowFileTypes, maxFileSize }) {
    let storageM: any = storage;
    if (object === 'avatar') {
        storageM = storage1;
    }
    return multer({
        storage: storageM,
        fileFilter: function (req, file, cb) {
            if (maxFileSize && file.size >= maxFileSize) {
                cb(new BadRequest(`Only allow size less than ${maxFileSize / 1_000_000}`));
            }

            if (allowFileTypes) {
                // Check ext
                const extname = allowFileTypes.test(path.extname(file.originalname).toLowerCase());
                // Check mimetype
                const mimetype = allowFileTypes.test(file.mimetype);

                if (mimetype && extname) {
                    return cb(null, true);
                } else {
                    cb(new BadRequest('Only allow images'));
                }
            }

        }
    });
}
export const avatarImageUpload = createMulter('avatar', { allowFileTypes: /jpeg|jpg|png|gif/, maxFileSize: 10_000_000 })
export const productImageUpload = createMulter('post', { allowFileTypes: /jpeg|jpg|png|gif/, maxFileSize: 10_000_000 })