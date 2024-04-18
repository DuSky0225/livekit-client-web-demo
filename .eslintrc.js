module.exports = {
  root: true, //指定当前配置文件为根配置，不会再向上查找
  env: {
    node: true,
    es6: true
  },
  "parserOptions": {//支持es6语法校验
    "ecmaVersion": 6,
    "sourceType": "module",
    "parser": "babel-eslint"
  },
  "parser": "vue-eslint-parser",
  // extends: ["taro/vue3"], //继承的配置（包括 rules, plugins, and language 选项），会合并到当前配置。后面的项会继承前面的。（前缀 eslint-config- 可省略）
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "error" : "off", // 禁用 console
    "no-alert": process.env.NODE_ENV === "production" ? "error" : "off", // 禁用 alert、confirm 和 prompt
    "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off", // 禁用 debugger
    // "no-empty-function": "error", // 禁止出现空函数
    "no-var": "error", // 要求使用 let 或 const 而不是 var
    // "no-lonely-if": "error", // 禁止 if 作为唯一的语句出现在 else 语句中
    // "no-extra-parens": "error", // 禁止不必要的括号
    // "no-duplicate-imports": "error", //禁止重复模块导入

    // "prefer-template": "error", // 要求使用模板字面量而非字符串连接
    // quotes: ["error", "double"], // 强制使用双引号
    // eqeqeq: "error", // 强制使用 === 和 !==
    // indent: ["error", 2], // 强制使用2格的缩进

    // "no-empty": "error", // 禁止出现空语句块
    // "no-unused-vars": "error",//禁止出现未使用过的变量
    // "no-redeclare": "error",//禁止多次声明同一变量
    // "no-unused-labels": "error", //  禁用出现未使用过的标

  }
};