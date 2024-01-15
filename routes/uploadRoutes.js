import path from "path";
import express from "express";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/", (req, res) => {
  uploadSingleImage(req, res, (err) => {
    if (err) {
      res.status(400).send({ message: err.message });
    } else if (req.file) {
      res.status(200).send({
        message: "Image uploaded successfully",
        image: `/${req.file.path}`,
      });
    } else {
      res.status(400).send({ message: "No image file provided" });
    }
  });
});

export default router;

// const fileSizeFormatter = (bytes, decimal) => {
//   if (bytes === 0) {
//     return "0 Bytes";
//   }
//   const dm = decimal || 2;
//   const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
//   const index = Math.floor(Math.log(bytes) / Math.log(1000));
//   return (
//     parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
//   );
// };

// router.post("/", (req, res) => {
//   uploadSingleImage(req, res, (err) => {
//     if (err) {
//       res.status(400).send({ message: err.message });
//     } else if (req.file) {
//       let fileData = {
//         fileName: req.file.originalname,
//         filePath: req.file.path,
//         fileType: req.file.mimetype,
//         fileSize: fileSizeFormatter(req.file.size, 2), // assuming fileSizeFormatter is a function you have defined elsewhere
//         public_id: req.file.filename, // use filename as public_id
//       }
//       res.status(200).send({
//         message: "Image uploaded successfully",
//         image: req.file.path,
//         fileData: fileData
//       });
//     } else {
//       res.status(400).send({ message: "No image file provided" });
//     }
//   });
// });

// router.post("/", asyncHandler(async(req, res) => {
//   uploadSingleImage(req, res, (err) => {
//     if (err) {
//       res.status(400).send({ message: err.message });
//     } else if (req.file) {
//       let fileData = req.file.path; // Save only the path of the file as per your schema
//       res.status(200).send({
//         message: "Image uploaded successfully",
//         image: fileData, // Send the path of the image
//       });
//     } else {
//       res.status(400).send({ message: "No image file provided" });
//     }
//   });
// }));

// router.post("/", asyncHandler(async (req, res) => {
//   try {
//     const fileData = await new Promise((resolve, reject) => {
//       uploadSingleImage(req, res, (err) => {
//         if (err) {
//           reject(err);
//         } else if (req.file) {
//           resolve(req.file.path); // Save only the path of the file as per your schema
//         } else {
//           reject(new Error("No image file provided"));
//         }
//       });
//     });

//     res.status(200).send({
//       message: "Image uploaded successfully",
//       image: fileData, // Send the path of the image
//     });
//   } catch (err) {
//     res.status(400).send({ message: err.message });
//   }
// }));