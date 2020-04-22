// parse_command.js

'use strict'

/**
 * Parse admin's text and execute commands.
 */
async function exe_command (msg) {

  const commandArray = msg.payload.text.split(" ")
  const command = commandArray[0].toLowerCase()

  if (command === 'say' && commandArray.length > 1) {
    const from = msg.from()
    await from.say(msg.payload.text.substring(4))
  }

  return true
}

module.exports = exe_command
