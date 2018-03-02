var path = require('path')
var webpack = require('webpack')

var BUILD_DIR = path.resolve(__dirname, 'build')
var SRC_DIR = path.resolve(__dirname, 'src')

var useWatch = process.argv.indexOf('--watch') > -1

var WEBPACK_OPTIONS = {
  entry: SRC_DIR + '/main.js',
  output: {path: BUILD_DIR, filename: 'bundle.js'},
  devtool: '#source-map',
  module: {
    loaders: [
      {test: /\.js$/, include: SRC_DIR,
        loader: 'babel', query: {presets: 'latest,stage-3,react'}},
    ],
  },
  watch: useWatch,
}

webpack(WEBPACK_OPTIONS, function(err, stats) {
  if(err) { return console.error(err) }
  console.log(stats.toString("normal"))
})
