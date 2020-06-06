module.exports = function (data) {
  const fs = require('fs')
  const NodeRSA = require('node-rsa')
  const homedir = require('os').homedir()

  const rsa = fs.readFileSync(`${homedir}/.ssh/id_rsa`)
  const key = new NodeRSA(rsa)
  return key.decrypt(data, 'utf8')
}