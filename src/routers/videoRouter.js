import express from "express"
import routes from "../routes"
import {
  videoDetail,
  getEditVideo,
  postEditVideo,
  deleteVideo,
  getUpload,
  postUpload
} from "../controllers/videoController"
import {
  uploadVideo,
  onlyPrivate
} from "../middlewares"

const videoRouter = express.Router()

// videoRouter.get("/", v)
// Upload
videoRouter.get(routes.upload, getUpload)
videoRouter.post(routes.upload, onlyPrivate, uploadVideo, postUpload)

// Video Detail
videoRouter.get(routes.videoDetail(), videoDetail)

// Edit Video
videoRouter.get(routes.editVideo(), onlyPrivate, getEditVideo)
videoRouter.post(routes.editVideo(), onlyPrivate, postEditVideo)

videoRouter.get(routes.deleteVideo(), onlyPrivate, deleteVideo)

export default videoRouter;