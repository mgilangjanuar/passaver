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
          const founds = [{ site: '-- add new site --' }, ...storage].filter(acc => acc.site.includes(input || ''))
          resolve(founds.map(acc => acc.site))
        })
      }
    }
  ])

  if (search.site === '-- add new site --') {
    const data = await inquirer.prompt([
      {
        name: 'site',
        message: 'Site URL:'
      },
      {
        name: 'username',
        message: 'Username:'
      },
      {
        name: 'password',
        type: 'password',
        message: 'Password:'
      }
    ])
    storage.push({
      site: data.site,
      accounts: [
        {
          username: data.username,
          password: data.password,
          note: ''
        }
      ]
    })
    fs.writeFileSync('./storage', encrypt(JSON.stringify(storage)))
  } else {
    const selected = storage.find(acc => search.site === acc.site)
    const data = await inquirer.prompt([
      {
        name: 'username',
        message: 'Username:'
      },
      {
        name: 'password',
        type: 'password',
        message: 'Password:'
      }
    ])
    selected.accounts.push({
      username: data.username,
      password: data.password,
      note: ''
    })
    fs.writeFileSync('./storage', encrypt(
      JSON.stringify(
        [...storage.filter(acc => acc.site !== selected.site), selected]
      )
    ))
  }

  console.log('Saved!')
}