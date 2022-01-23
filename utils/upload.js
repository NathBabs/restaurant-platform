import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    limit: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(json)$/)) {
            return cb(new Error("Please upload a json file"));
        }

        cb(undefined, true)
    }
})
