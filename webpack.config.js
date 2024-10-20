const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
    resolve: {
        fallback: {
          tls: false,
          net: false,
          child_process: false,
          'mock-aws-s3': false,
        },
      },
  entry: './src/index.js', // Your main JavaScript file
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output file name
  },
  target: "node",
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'ignore-loader' // Add this to ignore HTML files
      },
    ],
  },
  mode: 'production'
};