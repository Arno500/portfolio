var path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

const webpackConfig = {
  mode: "development",
  entry: {
    app: "./script.js"
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
    })
  ],
  output: {
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      }
    ]
  },
  devtool: "source-map" // any "source-map"-like devtool is possible
};

if (!devMode) {
  const JavaScriptObfuscator = require("webpack-obfuscator");

  webpackConfig.plugins.push(
    new JavaScriptObfuscator({
      rotateUnicodeArray: true
    })
  );
}

module.exports = webpackConfig;
