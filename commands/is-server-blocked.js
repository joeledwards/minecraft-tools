module.exports = {
  command: 'is-server-blocked <server-uuid>',
  desc: 'check if the supplied server is on the list of those blocked by Mojang',
  builder,
  handler,
}

const c = require('@buzuli/color')
const axios = require('axios')

function builder (yargs) {
  yargs
    .positional('server-uuid', {
      type: 'string',
      desc: 'The UUID of the server to check (will be automatically normalized for comparison)',
    })
}

async function handler ({ serverUuid }) {
  const uuid = serverUuid.split('-').join('').toLowerCase()
  const url = 'https://sessionserver.mojang.com/blockedservers'
  
  const { status, data } = await axios.get(url)

  if (status < 400) {
    const blockedSet = new Set()
    data.split('\n').forEach(bsu => blockedSet.add(bsu))

    if (blockedSet.has(uuid)) {
      console.info(`${c.yellow(serverUuid)} is ${c.red('BLOCKED')}`)
    } else {
      console.info(`${c.yellow(serverUuid)} is ${c.green('ALLOWED')}`)
    }
  } else {
    console.error(`Error fetching the list of blocked servers.\n[${status}] ${data}`)
    process.exit(1)
  }
}
