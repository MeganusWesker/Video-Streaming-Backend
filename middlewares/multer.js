import multer from "multer";

// specifying stoarge 
const storage =multer.memoryStorage();

//  multer functions takes storage as object and returns to many funtions for uploading for eg single("file name");
const singleUpload =multer({storage}).single('file');

export default singleUpload;

