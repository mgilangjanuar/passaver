module.exports = function (data) {
  const fs = require('fs')
  const NodeRSA = require('node-rsa')
  const homedir = require('os').homedir()

  const config = JSON.parse(fs.readFileSync('./config.json'))

  const rsa = fs.readFileSync(`${homedir}${config.rsa}`)
  const key = new NodeRSA(rsa)
  return key.encrypt(data, 'base64')
}