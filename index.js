(async () => {
  try {
    await require('./src/util/unlock')()
  } catch (error) {
    console.log('Login failed:', error.message || error)
    process.exit(1)
  }

  const fs = require('fs')
  const encrypt = require('./src/util/encrypt')
  const program = require('commander')
  const inquirer = require('inquirer')
  const autocomplete = require('inquirer-autocomplete-prompt')

  inquirer.registerPrompt('autocomplete', autocomplete)

  program
    .version('0.0.1')
    .description('Passaver: save your password securely')
    .parse(process.argv)

  if (!fs.existsSync('./storage')) {
    fs.writeFileSync('./storage', encrypt(JSON.stringify([])))
  }

  if (program.args.length) {
    program.command('ping').action(() => {
      console.log('pong')
    })

    program.command('get').action(async () => {
      await require('./src/action/get')(inquirer)
    })

    program.command('create').action(async () => {
      await require('./src/action/create')(inquirer)
    })

    program.command('update').action(async () => {

    })

    program.command('delete').action(async () => {
      await require('./src/action/delete')(inquirer)
    })

    await program.parseAsync(process.argv)
  } else {
    const action = await inquirer.prompt([
      {
        name: 'type',
        type: 'list',
        message: 'What you want?',
        choices: ['Create', 'Get', 'Update', 'Delete']
      }
    ])

    if (action.type === 'Get') {
      await require('./src/action/get')(inquirer)
    } else if (action.type === 'Create') {
      await require('./src/action/create')(inquirer)
    } else if (action.type === 'Delete') {
      await require('./src/action/delete')(inquirer)
    }
  }

  process.exit(0)
})()