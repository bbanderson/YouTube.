const path = require("path");
const extractCSS = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");

const mode = process.env.WEBPACK_ENV;

const ENTRY_FILE = path.resolve(__dirname, "assets", "js", "main.js");
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
  entry: ["@babel/polyfill", ENTRY_FILE],
  mode: mode,
  module: {
    rules: [
      // Rules for ES6 -> JS
      {
        test: /\.(js)$/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      // Rules for SCSS -> CSS
      {
        test: /\.(scss)$/, // webpack이 scss 파일을 찾도록 한다. scss 파일에 한해 config 적용시킨다
        use: extractCSS.extract([
          {
            loader: "css-loader", // webpack이 css를 이해할 수 있도록 가르쳐준다. 여기서 추출된 순수 css를 가지고 전송한다.
          },
          {
            loader: "postcss-loader",
            options: {
              plugins() {
                return [autoprefixer()];
              },
            },
            // 호환성 부여(autop)
          },
          {
            loader: "sass-loader",
          },
        ]),
      },
    ],
  },
  output: {
    path: OUTPUT_DIR,
    filename: "[name].js",
  },
  plugins: [new extractCSS("styles.css")],
};

module.exports = config;
