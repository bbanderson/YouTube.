import express from "express"
import routes from "../routes"
import {
  home,
  search
} from "../controllers/videoController"
import {
  logout,
  getJoin,
  postJoin,
  getLogin,
  postLogin,
  githubLogin,
  postGithubLogin,
  fbLogin,
  postFbLogin,
  getMe,
  kakaoLogin,
  kakaoLoginCallback,
  postkakaoLogin
} from "../controllers/userController"
import {
  onlyPublic,
  onlyPrivate
} from "../middlewares"

import passport from "passport";

const globalRouter = express.Router()

globalRouter.get("/", home)
globalRouter.get(routes.join, onlyPublic, getJoin)
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin)
globalRouter.get(routes.login, onlyPublic, getLogin)
globalRouter.post(routes.login, onlyPublic, postLogin)

// Social Login
globalRouter.get(routes.github, githubLogin);
globalRouter.get(routes.githubCallback, passport.authenticate("github", {
  failureRedirect: "/login"
}), postGithubLogin);

globalRouter.get(routes.fb, fbLogin);
globalRouter.get(routes.fbCallback, passport.authenticate("facebook", {
  failureRedirect: "/login"
}), postFbLogin);

globalRouter.get(routes.kakao, kakaoLogin);
globalRouter.get(routes.kakaoCallback, passport.authenticate("kakao", {
  failureRedirect: "/login"
}), postkakaoLogin);

// My Page
globalRouter.get(routes.me, getMe);

globalRouter.get(routes.logout, onlyPrivate, logout)
globalRouter.get(routes.search, search)

export default globalRouter