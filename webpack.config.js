var path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var webpack = require("webpack");
const devMode = process.env.NODE_ENV !== "production";

const webpackConfig = {
  mode: "development",
  entry: {
    app: "./script.js"
  },
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [new UglifyJsPlugin()],
    sideEffects: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: devMode ? "[name].css" : "[name].[hash].css",
      chunkFilename: devMode ? "[id].css" : "[id].[hash].css"
    })
    // new BundleAnalyzerPlugin()
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
      },
      {
        test: /\.svg/,
        use: {
          loader: "svg-url-loader",
          options: {}
        }
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/preset-env",
              {
                targets: {
                  // The % refers to the global coverage of users from browserslist
                  browsers: [">0.25%", "ie 11", "not op_mini all"]
                },
                modules: false,
                useBuiltIns: "entry",
                corejs: "3"
              }
            ]
          ]
        }
      }
    ]
  },
  resolve: {
    alias: {
      velocity: "velocity-animate/velocity"
    }
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
