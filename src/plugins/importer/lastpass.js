module.exports = async function (fileCsv) {
  const fs = require('fs')
  const decrypt = require('../../util/decrypt')
  const encrypt = require('../../util/encrypt')
  const homedir = require('../../util/homedir')

  const csv = fs.readFileSync(fileCsv).toString().split(/\r?\n/)
  for (data of csv.slice(1, csv.length - 1)) {
    const file = fs.readFileSync(`${homedir}/passaver-storage`)
    const storage = JSON.parse(decrypt(file.toString()))

    const part = data.split(',')
    const site = part[0]
    const username = part[1]
    const password = part[2]

    const selected = storage.find(acc => site === acc.site)
    if (selected) {
      const account = selected.accounts.find(acc => acc.username === username)
      if (!account) {
        selected.accounts.push({ username, password, note: '' })
        fs.writeFileSync(`${homedir}/passaver-storage`, encrypt(
          JSON.stringify(
            [...storage.filter(acc => acc.site !== site), selected]
          )
        ))
      }
    } else {
      fs.writeFileSync(`${homedir}/passaver-storage`, encrypt(
        JSON.stringify(
          [...storage, {
            site: site, accounts: [ { username, password, note: '' } ]
          }]
        )
      ))
    }
  }
}