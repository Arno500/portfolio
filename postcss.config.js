module.exports = {
  plugins: {
    "postcss-preset-env": {},
    "postcss-uncss": {
      html: ["index.html"],
      ignore: [":hover", ":focus", ":before", ":after"]
    },
    cssnano: {}
  }
};
