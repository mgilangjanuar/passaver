#!/usr/bin/env node

(async () => {
  try {
    await require('./src/util/unlock')()
  } catch (error) {
    console.log('Login failed:', error.message || error)
    process.exit(1)
  }

  const fs = require('fs')
  const encrypt = require('./src/util/encrypt')
  const decrypt = require('./src/util/decrypt')
  const homedir = require('./src/util/homedir')
  const program = require('commander')
  const inquirer = require('inquirer')
  const autocomplete = require('inquirer-autocomplete-prompt')

  inquirer.registerPrompt('autocomplete', autocomplete)

  program
    .version('0.0.1')
    .description('Passaver: save your password securely')
    .parse(process.argv)

  if (!fs.existsSync(`${homedir}/passaver-config.json`)) {
    fs.writeFileSync(`${homedir}/passaver-config.json`, JSON.stringify({ rsa: '/.ssh/id_rsa' }))
  }

  let isEmpty = false
  if (!fs.existsSync(`${homedir}/passaver-storage`)) {
    isEmpty = true
    fs.writeFileSync(`${homedir}/passaver-storage`, encrypt(JSON.stringify([])))
  } else {
    const file = fs.readFileSync(`${homedir}/passaver-storage`)
    const storage = JSON.parse(decrypt(file.toString()))
    isEmpty = !storage.length
  }

  if (program.args.length) {
    program.command('ping').action(() => {
      console.log('pong')
    })

    program.command('get').action(async () => {
      await require('./src/action/get')(inquirer)
    })

    program.command('create').action(async () => {
      await require('./src/action/create')(inquirer, isEmpty)
    })

    program.command('update').action(async () => {
      await require('./src/action/update')(inquirer)
    })

    program.command('delete').action(async () => {
      await require('./src/action/delete')(inquirer)
    })

    program.command('set-config').action(async () => {
      await require('./src/action/setConfig')(inquirer)
    })

    await program.parseAsync(process.argv)
  } else {
    const action = await inquirer.prompt([
      {
        name: 'type',
        type: 'list',
        message: 'What you want?',
        choices: isEmpty ? ['Create', new inquirer.Separator(), 'Set Config'] : ['Get', 'Create', 'Update', 'Delete', new inquirer.Separator(), 'Set Config']
      }
    ])

    if (action.type === 'Get') {
      await require('./src/action/get')(inquirer)
    } else if (action.type === 'Create') {
      await require('./src/action/create')(inquirer, isEmpty)
    } else if (action.type === 'Delete') {
      await require('./src/action/delete')(inquirer)
    } else if (action.type === 'Update') {
      await require('./src/action/update')(inquirer)
    } else if (action.type === 'Set Config') {
      await require('./src/action/setConfig')(inquirer)
    }
  }

  process.exit(0)
})()