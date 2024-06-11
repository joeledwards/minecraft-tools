module.exports = {
  command: 'uuid <username>',
  desc: 'fech the UUID of a Minecraft user based on their username',
  builder,
  handler,
}

const c = require('@buzuli/color')
const axios = require('axios')
const buzJson = require('@buzuli/json')

function builder (yargs) {
}

async function handler ({ username }) {
  const url = `https://api.mojang.com/users/profiles/minecraft/${username}`

  const { status, data } = await axios.get(url)

  if (status < 400) {
    try {
      const { id, name } = data
      const matches = id.match(/^([0-9a-f]{8})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{4})([0-9a-f]{12})$/)
      const [u0, u1, u2, u3, u4, u5] = matches
      const uuid = `${u1}-${u2}-${u3}-${u4}-${u5}`
      console.info(`${uuid}`)
    } catch (error) {
      console.error(
        `Failed to parse user ID from response:\n${buzJson(data)}\nDetails:\n`,
        error
      )
    }
  } else {
    console.error(`[${status}]\n${data}`)
  }
}
