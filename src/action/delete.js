module.exports = async function (inquirer) {
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
          const founds = storage.filter(acc => acc.site.includes(input || ''))
          resolve(founds.map(acc => acc.site))
        })
      }
    }
  ])

  const selected = storage.find(acc => search.site === acc.site)
  if (selected.accounts.length > 1) {
    const action = await inquirer.prompt([
      {
        name: 'username',
        type: 'list',
        message: 'Which one?',
        choices: selected.accounts.map(acc => acc.username)
      }
    ])
    const account = selected.accounts.find(acc => acc.username === action.username)
    fs.writeFileSync('./storage.json', JSON.stringify([
      ...storage.filter(acc => acc.site !== selected.site),
      {
        ...selected, accounts: selected.accounts.filter(acc => acc.username !== account.username)
      }
    ]))
    console.log(`Account \`${account.username}\` in \`${selected.site}\` deleted!`)
  } else {
    fs.writeFileSync('./storage.json', JSON.stringify(storage.filter(acc => acc.site !== selected.site)))
    console.log(`Account for \`${selected.site}\` deleted!`)
  }
}