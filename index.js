(async () => {
  try {
    await require('./src/util/unlock')()
  } catch (error) {
    console.log('Login failed:', error.message || error)
    process.exit(1)
  }

  const program = require('commander')
  const inquirer = require('inquirer')
  const autocomplete = require('inquirer-autocomplete-prompt')

  inquirer.registerPrompt('autocomplete', autocomplete)

  program
    .version('0.0.1')
    .description('Passaver: save your password securely')
    .parse(process.argv)

  if (program.args.length) {
    program.command('ping').action(() => {
      console.log('pong')
    })

    program.command('get').action(async () => {
      await require('./src/action/get')(inquirer)
    })

    program.command('create').action(async () => {
      await require('./src/action/store')(inquirer)
    })

    program.command('update').action(async () => {

    })

    program.command('delete').action(async () => {

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
      await require('./src/action/store')(inquirer)
    }
  }

  process.exit(0)
})()