import multer from 'multer';

export const globalErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: "File too large. Maximum size is 20MB." });
        }
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
};
