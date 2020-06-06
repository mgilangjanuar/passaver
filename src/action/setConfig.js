module.exports = async function (inquirer) {
  const fs = require('fs')
  const config = JSON.parse(fs.readFileSync('./config.json'))

  const data = await inquirer.prompt(Object.keys(config).map(
    key => {
      return {
        name: key,
        default: config[key]
      }
    }
  ))

  fs.writeFileSync('./config.json', JSON.stringify(data))
}