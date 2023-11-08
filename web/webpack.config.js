const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/main.tsx",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        include: /src/,
        use: [{ loader: "ts-loader" }],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.css$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        use: ["url-loader"],
      },
    ],
  },
  output: {
    path: __dirname + "/dist",
    filename: "react.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new webpack.DefinePlugin({}),
    new CopyWebpackPlugin({
      patterns: [{ from: "data", to: "data" }],
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      "@emotion/react": path.resolve("./node_modules/@emotion/react"),
      "@mui/material": path.resolve("./node_modules/@mui/material"),
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom"),
      "react-redux": path.resolve("./node_modules/react-redux"),
      "react-router-dom": path.resolve("./node_modules/react-router-dom"),
    },
  },
};
