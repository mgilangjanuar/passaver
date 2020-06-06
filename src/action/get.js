module.exports = async function get(inquirer) {
  const fs = require('fs')
  const clipboardy = require('clipboardy')

  const file = fs.readFileSync('./storage.json')
  const storage = JSON.parse(file)

  const search = await inquirer.prompt([
    {
      name: 'site',
      type: 'autocomplete',
      message: 'What\'s site?',
      source: (_, input) => {
        return new Promise(resolve => {
          const founds = storage.filter(acc => acc.site.includes(input || ''))
          resolve(founds.map(acc => acc.site))
        })
      }
    }
  ])

  const selected = storage.find(acc => search.site === acc.site)
  let account = selected.accounts[0]
  if (selected.accounts.length > 1) {
    const action = await inquirer.prompt([
      {
        name: 'username',
        type: 'list',
        message: 'Which one?',
        choices: selected.accounts.map(acc => acc.username)
      }
    ])
    account = selected.accounts.find(acc => acc.username === action.username)
  }
  clipboardy.writeSync(account.password)
  console.log(`Password for \`${account.username}\` copied!`)
}