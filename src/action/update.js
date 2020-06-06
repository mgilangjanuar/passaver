module.exports = async function (inquirer) {
  const fs = require('fs')
  const decrypt = require('../util/decrypt')
  const encrypt = require('../util/encrypt')

  const file = fs.readFileSync('./storage')
  const storage = JSON.parse(decrypt(file.toString()))

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
    const find = await inquirer.prompt([
      {
        name: 'username',
        type: 'list',
        message: 'Which one?',
        choices: selected.accounts.map(acc => acc.username)
      }
    ])
    account = selected.accounts.find(acc => acc.username === find.username)
  }
  const data = await inquirer.prompt([
    {
      name: 'site',
      message: 'Site URL:',
      default: selected.site
    },
    {
      name: 'username',
      message: 'Username:',
      default: account.username
    },
    {
      name: 'password',
      type: 'password',
      message: 'Password:',
      default: account.password
    }
  ])
  fs.writeFileSync('./storage', encrypt(
    JSON.stringify(
      [...storage.filter(acc => acc.site !== selected.site), {
        ...selected,
        site: data.site,
        accounts: [...selected.accounts.filter(acc => acc.username !== account.username), {
          username: data.username,
          password: data.password,
          note: ''
        }]
      }]
    )
  ))

  console.log('Saved!')
}