// 1. npm init
// 2. npm install --save webpack webpack-dev-server babel-loader babel-preset-es2015
// 3. mkdir dist && touch index.html
// 4. Include `<script src="/bundle.js"></script>` inside index.html
// 5. mkdir src && touch src/index.js
// 6. Add some code to index.js (e.g. `console.log('Hello, World!'))
// 7. npm start
// 8. Browse to http://localhost:8080/dist/

const webpack = require('webpack')

console.log(__dirname + "haunted/static")
module.exports = {
  mode: "development",
  context: __dirname,
  entry: "./src/index",
  output: {
    path: __dirname + "/haunted/static/haunted/",
    filename: "[name].js"
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            'env'
          ],
          plugins: [
            'transform-object-rest-spread',
          ],
        },
      }],
    }]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}