const core = require('@actions/core')
const github = require('@actions/github')
const fetch = require('node-fetch')

async function getContext () {
  const context = github.context
  const payload = context.payload

  const content = {
    body: payload.release.body,
    version: payload.release.tag_name
  }

  core.info(`
  Version: ${content.version},
  Body: ${content.body}`)

  return content
}

async function run () {
  try {
    const webhookId = core.getInput('webhook_id')
    const webhookToken = core.getInput('webhook_token')

    if (!webhookId || !webhookToken) {
      return core.setFailed('webhook ID or TOKEN are not configured correctly. Verify config file.')
    }

    const content = await getContext()

    const embedMsg = {
      color: 3447003,
      title: `Release ${content.version}`,
      description: content.body
    }

    const body = { embeds: [embedMsg] }

    const url = `https://discord.com/api/webhooks/${core.getInput('webhook_id')}/${core.getInput('webhook_token')}`

    await fetch(url, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
