import path from "path";
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import helmet from "helmet";
import morgan from "morgan";
import {
  localsMiddleWare
} from "./middlewares";
import globalRouter from "./routers/globalRouter";
import routes from "./routes";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import "./passport";
import apiRouter from "./routers/apiRouter";
import flash from "express-flash";
// import favicon from "serve-favicon";
const app = express();
const CookieStore = MongoStore(session);
app.use(helmet());
app.use(morgan("dev"));
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(flash());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: process.env.key,
    saveUninitialized: false,
    resave: true,
    store: new CookieStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(localsMiddleWare);
app.use(routes.home, globalRouter);
app.use("/uploads", express.static("uploads"));
// app.use("/static", express.static("static")); // "/static" route가 호출되면 "static" 폴더를 찾아가도록 함
app.use("/static", express.static(path.join(__dirname, "static")));
// app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')))
app.use(routes.users, userRouter);
app.use(routes.videos, videoRouter);
app.use(routes.api, apiRouter);

export default app;