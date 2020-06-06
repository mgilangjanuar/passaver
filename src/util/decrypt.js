module.exports = function (data) {
  const fs = require('fs')
  const NodeRSA = require('node-rsa')
  const homedir = require('./homedir')

  const config = JSON.parse(fs.readFileSync(`${homedir}/passaver-config.json`))

  const rsa = fs.readFileSync(`${homedir}${config.rsa}`)
  const key = new NodeRSA(rsa)
  return key.decrypt(data, 'utf8')
}