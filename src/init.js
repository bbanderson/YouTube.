import "@babel/polyfill";
import "./db";
import dotenv from "dotenv";
import app from "./app";
dotenv.config();
import "./models/Video";
import "./models/Comment";
import "./models/User";
import "./models/Subscribe";

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`👍 Listening on : http://localhost:${PORT}`)
);