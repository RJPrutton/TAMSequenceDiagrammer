const path = require("path");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./index.js",
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true, // Clean output directory before emit
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    devtool: isProduction ? false : "eval-source-map",
    optimization: {
      minimize: isProduction,
    },
    resolve: {
      extensions: [".js", ".json"],
    },
  };
};
