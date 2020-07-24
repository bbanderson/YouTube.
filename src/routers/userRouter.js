import express from "express"
import routes from "../routes"
import {
  userDetail,
  postChangePassword,
  getChangePassword,
  getEditProfile,
  postEditProfile
} from "../controllers/userController"
import {
  onlyPrivate,
  uploadAvatar
} from "../middlewares"

const userRouter = express.Router()

// userRouter.get("/", users)
userRouter.get(routes.editProfile, onlyPrivate, getEditProfile)
userRouter.post(routes.editProfile, onlyPrivate, uploadAvatar, postEditProfile)
userRouter.get(routes.changePassword, onlyPrivate, getChangePassword)
userRouter.post(routes.changePassword, onlyPrivate, postChangePassword)
userRouter.get(routes.userDetail(), userDetail)

export default userRouter;