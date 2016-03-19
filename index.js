'use strict'
const co = require('co')
const readPkg = require('read-pkg-up')
const globalNodeModules = require('global-node-modules')
const npmin = require('npmin')

module.exports = co.wrap(function* (cli) {
  // get plugins
  if (!cli.flags.use) {
    throw new Error('Require plugins')
  }
  const plugins = Array.isArray(cli.flags.use) ? cli.flags.use : [cli.flags.use]
  // get package.json in cwd
  const localPkg = yield readPkg()
  // install the plugins globally
  npmin(plugins.map(name => `tooling-plugin-${name}`), {
    global: true
  })
  // run runner
  const runnerName = `tooling-plugin-${plugins[0]}`
  const runnerPath = yield globalNodeModules(runnerName)
  const runner = require(runnerPath)
  const self = {
    cli,
    pkg: localPkg
  }
  runner.call(self)
})
