const core = require('@actions/core')
const github = require('@actions/github')
const fetch = require('node-fetch')

export async function getContext () {
  const context = github.context
  const payload = context.payload

  const content = {
    body: payload.release.body.length < 1500
      ? payload.release.body
      : payload.release.body.substring(0, 1500) + ` ([...](${payload.release.html_url}))`,
    tag_name: payload.release.tag_name,
    html_url: payload.release.html_url,
    full_name: payload.repository.full_name
  }

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
      title: `${content.full_name} | Release ${content.tag_name}`,
      description: content.body,
      url: content.html_url
    }

    const body = { embeds: [embedMsg] }

    const url = `https://discord.com/api/webhooks/${core.getInput('webhook_id')}/${core.getInput('webhook_token')}?wait=true`

    fetch(url, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(data => core.info(JSON.stringify(data)))
      .catch(err => core.info(err))
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
