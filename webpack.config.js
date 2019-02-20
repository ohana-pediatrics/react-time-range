const path = require('path');

module.exports = {
  entry: "./src/index.ts",
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: '/',
    filename: "index.js",
    libraryTarget: "commonjs2",
    library: 'TimeRange',
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    }
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
    // Don't bundle react or react-dom
    react: {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'React',
      root: 'React'
    },
    'react-dom': {
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'ReactDOM',
      root: 'ReactDOM'
    }
  }
};
