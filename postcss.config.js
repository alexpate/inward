const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [
    autoprefixer({browsers: ['IE 11', '> 5%']})
  ]
}
