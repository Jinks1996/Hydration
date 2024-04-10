const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals')
const CopyPlugin = require('copy-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  entry: slsw.lib.entries,  // automatic entry resolution
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  stats: 'minimal', /** configure how to log bundle information on console */
  externals: [nodeExternals()],
  devtool: 'source-map',
  performance: {
    hints: false,
  },
  resolve: {
    extensions: ['.js', '.json', '.ts'],
    plugins: [new TsconfigPathsPlugin()],
  },
  /** bundle optimization, asset management and injection of environment variables */
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/functions/file-chunker/global-bundle.pem', to: 'src/functions/file-chunker/global-bundle.pem' }
      ],
      options: {}
    }),
  ],
  /** process different types of files other that js, json and convert them into valid modules that 
   * can be consumed by your application and added to the dependency graph */
  module: {
    rules: [
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
          ],
        ],
      }
    ],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
    sourceMapFilename: '[file].map',
  },
};
