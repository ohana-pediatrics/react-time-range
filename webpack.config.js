var path = require("path");
module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
    filename: "index.js",
    libraryTarget: "commonjs2",
    library: 'TimeRange',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'awesome-typescript-loader',
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"]
      },
    ]
  },
  externals: {
    react: "commonjs react"
  }
};
