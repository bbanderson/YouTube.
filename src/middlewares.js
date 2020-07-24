import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import routes from "./routes";

export const s3 = new aws.S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: "ap-northeast-2",
});

// const upload = multer({
//   dest: "uploads/videos/",
// });

const multerVideo = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: "bbantube/video",
  }),
});

const multerAvatar = multer({
  storage: multerS3({
    s3: s3,
    acl: "public-read",
    bucket: "bbantube/avatar",
  }),
});

export const uploadVideo = multerVideo.single("videoFile");
export const uploadAvatar = multerAvatar.single("avatar");

export const localsMiddleWare = (req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  res.locals.appName = "YouTube";
  res.locals.routes = routes;
  res.locals.loggedUser = req.user || null;
  if (req.user) {
    res.locals.initialName = req.user.name[0];
  }

  next();
};

export const onlyPublic = (req, res, next) => {
  if (req.user) {
    res.redirect(routes.home);
  } else {
    next();
  }
};

export const onlyPrivate = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect(routes.home);
  }
};