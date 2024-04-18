// const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = ["js", "css"];
const timeStamp = new Date().getTime() + "-1.0.0.8";
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");
// 拼接路径
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  // 例如 https://www.ruoyi.vip/。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 https://www.ruoyi.vip/admin/，则设置 baseUrl 为 /admin/。
  // publicPath: './', // h5 包更新方式
  publicPath: "/jmeeting-web", // 镜像更新方式
  // publicPath: '/jim-web',
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  // outputDir: 'dist',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  // assetsDir: 'static',
  lintOnSave: false,
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        filename: "[path].gzip[query]", // 提示compression-webpack-plugin@2.0.0的话filename改为asset
        algorithm: "gzip",
        test: new RegExp("\\.(" + productionGzipExtensions.join("|") + ")$"),
        threshold: 10240, //内容超过10KB进行压缩
        minRatio: 0.8,
      }),
    ],
    //关闭 webpack 的性能提示
    performance: {
      hints: false,
    },
    output: {
      // 输出重构 打包编译后的js文件名称,添加时间戳.
      filename: `js/js[name].${timeStamp}.js`,
      chunkFilename: `js/chunk.[id].${timeStamp}.js`,
    },
    resolve: {
      alias: {
        "@ant-design/icons/lib/dist$": "@/core/antd.js",
      },
    },
  },
  chainWebpack: (config) => {
    // 移除 prefetch 插件
    config.plugins.delete("prefetch");
    config.optimization.minimizer([
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          output: {
            comments: false,
          },
          // compress: {
          //   warnings: false,
          //   drop_console: true,
          //   drop_debugger: true,
          //   pure_funcs: ['console.log'] //移除console
          // }
        },
      }),
    ]);
    config.resolve.alias.set("@$", resolve("src"));
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule
      .oneOf("inline")
      .resourceQuery(/inline/)
      .use("cache-loader")
      .loader("cache-loader")
      .end()
      .use("vue-svg-icon-loader")
      .loader("vue-svg-icon-loader")
      .end()
      .end()
      .oneOf("external")
      .use("file-loader")
      .loader("file-loader")
      .options({
        name: "assets/[name].[hash:8].[ext]",
      });
  },

  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          // require("postcss-pxtorem")({
          //   rootValue: 75, // 换算的基数
          //   propList: ["*"]
          // })
        ],
      },
    },
    // 是否使用css分离插件 ExtractTextPlugin
    // extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // 启用 CSS modules for all css / pre-processor files.
    modules: false,
    extract: {
      // 打包后css文件名称添加时间戳
      filename: `css/[name].${timeStamp}.css`,
      chunkFilename: `css/chunk.[id].${timeStamp}.css`,
    },
  },
  runtimeCompiler: true,
  devServer: {
    port: 8082,
    open: true, //配置自动启动浏览器
    proxy: {
      "/api-gateway/common-captcha-server": {
        target: "https://workin.hanweb.com",
        // target: "https://jpaasdev2.hanweb.com",
        ws: false,
        changeOrigin: true,
      },
      "/api-gateway": {
        // target: "https://workin.hanweb.com",
        target: "https://meetingin.hanweb.com",
        // target: "https://jpaasdev2.hanweb.com",
        // target: "https://meeting.hanweb.com",
        // target:"https://work.gsjtw.cc",
        ws: false,
        changeOrigin: true,
        // pathRewrite: {
        //   "^/api-gateway": "",
        // },
      },
      "/jpaas-jim-web-server": {
        target: "https://meetingin.hanweb.com/",
        // target: "https://jpaasdev2.hanweb.com",
        ws: false,
        changeOrigin: true,
      },
      "/common-ucenter-server": {
        target: "https://meetingin.hanweb.com/",
        // target: "https://jpaasdev2.hanweb.com",
        ws: false,
        changeOrigin: true,
      },
    },
  },
  pwa: {
    iconPaths: {
      favicon32: "favicon.ico",
      favicon16: "favicon.ico",
      appleTouchIcon: "favicon.ico",
      maskIcon: "favicon.ico",
      msTileImage: "favicon.ico",
    },
  },
};
