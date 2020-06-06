module.exports = async function() {
  const sudo = require('sudo-prompt')
  const { canPromptTouchID, promptTouchID } = require('node-mac-auth')

  if (canPromptTouchID()) {
    await promptTouchID({ reason: 'to unlock the Passaver' })
  } else {
    await new Promise((resolve, reject) => {
      sudo.exec('', { name: 'Passaver' }, error => {
        if (error) reject(error)
        resolve()
      })
    })
  }
}