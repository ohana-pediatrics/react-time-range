var path = require("path");
const babelConfig = require('./.babelrc.json');
module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    libraryTarget: "commonjs2"
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: babelConfig,
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /.(png|jpg|gif|eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: "file-loader",
            options: {}
          }
        ]
      }
    ]
  },
  externals: {
    react: "commonjs react"
  }
};
