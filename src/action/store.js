module.exports = async function get(inquirer) {
  const fs = require('fs')

  const file = fs.readFileSync('./storage.json')
  const storage = JSON.parse(file)

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
    fs.writeFileSync('./storage.json', JSON.stringify(storage))
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
    fs.writeFileSync('./storage.json', JSON.stringify([...storage.filter(acc => acc.site !== selected.site), selected]))
  }

  console.log('Saved!')
}