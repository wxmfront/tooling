'use strict'
const fs = require('fs')
const path = require('path')
const babel = require('babel-core')
const requireFromString = require('require-from-string')

module.exports = function assignConfig(toolingFile, config, options) {
  // require local tooling.js
  let code = babel.transform(fs.readFileSync(toolingFile, 'utf8'), {
    presets: [require('babel-preset-es2015'), require('babel-preset-stage-0')]
  }).code
  code = requireFromString(code, {
    prependPaths: [
      path.join(__dirname, '../node_modules')
    ]
  })
  if (code.default) {
    code.default(config, options)
  }
}
