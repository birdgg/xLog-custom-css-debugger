const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const ejs = require("ejs");
const srcDir = path.join(__dirname, "..", "src");

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env,
  });
}
module.exports = {
  entry: {
    popup: path.join(srcDir, "popup/index.tsx"),
    options: path.join(srcDir, "options/index.tsx"),
    background: path.join(srcDir, "background/index.ts"),
    content_script: path.join(srcDir, "content_script/index.tsx"),
    "monaco-editor/iframe/index": path.join(
      srcDir,
      "monaco-editor/iframe/index.ts"
    ),
  },

  output: {
    filename: "[name].js",
    path: path.join(__dirname, "../dist"),
  },
  optimization: {
    splitChunks: {
      name: "vendor",
      chunks(chunk) {
        return chunk.name !== "background";
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
        exclude: /\.module\.css$/,
      },
      {
        test: /\.(jpe?g|png|gif|eot|ttf|svg|woff|woff2|md)$/i,
        loader: "file-loader",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new webpack.DefinePlugin({
      global: "window",
    }),
    new CopyPlugin({
      patterns: [
        { from: "public", to: "dist" },
        {
          from: "src/monaco-editor/iframe/index.html",
          to: "monaco-editor/iframe/index.html",
          transform: transformHtml,
        },
        {
          from: "node_modules/monaco-editor/min/**/*",
          to: "monaco-editor/iframe/",
        },
        {
          from: "node_modules/requirejs/**/*",
          to: "monaco-editor/iframe/",
        },
      ],
      options: {},
    }),
    new MonacoWebpackPlugin({
      languages: ["css"],
    }),
  ],
};
