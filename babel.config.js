module.exports = {
  presets: ["@babel/preset-env", "@vue/app"],
  plugins: [
    [
      "import",
      {
        libraryName: "vant",
        libraryDirectory: "es",
        style: true,
      },
      "vant",
    ],
    [
      "import",
      {
        libraryName: "jpaas-component",
        libraryDirectory: "lib",
        camel2DashComponentName: false,
      },
      "jpaas-component",
    ],
    "@babel/plugin-transform-runtime",
    "@babel/plugin-proposal-class-properties",
  ],
};
