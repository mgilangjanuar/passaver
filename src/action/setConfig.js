module.exports = async function (inquirer) {
  const fs = require('fs')
  const homedir = require('../util/homedir')
  const config = JSON.parse(fs.readFileSync(`${homedir}/passaver-config.json`))

  const data = await inquirer.prompt(Object.keys(config).map(
    key => {
      return {
        name: key,
        default: config[key]
      }
    }
  ))

  fs.writeFileSync(`${homedir}/passaver-config.json`, JSON.stringify(data))
}