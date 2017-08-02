module.exports = {
  test: /\.js$|\.jsx$/,
  enforce: 'post',
  loader: 'istanbul-instrumenter-loader',
  exclude: /node_modules|spec|public/,
  query: {
      esModules: true
  }
}
