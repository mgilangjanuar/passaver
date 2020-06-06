module.exports = async function (inquirer, isEmpty) {
  const fs = require('fs')
  const decrypt = require('../util/decrypt')
  const encrypt = require('../util/encrypt')
  const homedir = require('../util/homedir')

  const file = fs.readFileSync(`${homedir}/passaver-storage`)
  const storage = JSON.parse(decrypt(file.toString()))

  let search
  if (!isEmpty) {
    search = await inquirer.prompt([
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
  }

  if (isEmpty || search.site === '-- add new site --') {
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
    const selected = storage.find(acc => data.site === acc.site)
    if (!selected) {
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
      fs.writeFileSync(`${homedir}/passaver-storage`, encrypt(JSON.stringify(storage)))
    } else if (!selected.accounts.find(acc => acc.username === data.username)) {
      selected.accounts.push({
        username: data.username,
        password: data.password,
        note: ''
      })
      fs.writeFileSync(`${homedir}/passaver-storage`, encrypt(
        JSON.stringify(
          [ ...storage.filter(acc => acc.site !== data.site), selected]
        )
      ))
    }
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
    fs.writeFileSync(`${homedir}/passaver-storage`, encrypt(
      JSON.stringify(
        [...storage.filter(acc => acc.site !== selected.site), selected]
      )
    ))
  }

  const spinner = require('ora')()
  console.log('')
  spinner.succeed('Saved!')
}