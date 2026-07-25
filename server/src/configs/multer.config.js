import multer from "multer";

const stroage = multer.diskStorage({});

const upload = multer({ storage: stroage });

export default upload;
