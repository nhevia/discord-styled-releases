# discord-styled-releases
*Action that uses a webhook for sending automatic styled Discord messages on new repository releases.*


![alt](https://i.imgur.com/jwo6XsD.png)

### Example usage

Create file `discord-release-msg.yml` under folder `.github/workflows` in your project's root folder:
>.github/workflows/discord-release-msg.yml

```yml

name: Release messages to discord announcement channel

on: 
  release:
    types:
      - created

jobs:
  run_main:
    runs-on: ubuntu-18.04
    name: Sends custom message
    steps:
      - name: Sending message
        uses: nhevia/discord-styled-releases@main
        with:
          webhook_id: ${{ secrets.DISCORD_WEBHOOK_ID }}
          webhook_token: ${{ secrets.DISCORD_WEBHOOK_TOKEN }}
```

### Create a webhook

To create a new webhook in discord go to **Channel > Edit > Integrations > Webhooks > New Webhook**

Once you have the webhoook URL, you can get the `ID` and the `TOKEN`. They are included in the URL like so:

> https://discord.com/api/webhooks/ID/TOKEN


### Adding necessary secrets

This is needed to not expose your `ID/TOKEN` (which would mean anybody can use your webhook)

In your github project go to **Settings > Secrets > New repository secret**

And add these two secrets (`New repository secret` button):


>Name: DISCORD_WEBHOOK_ID
Value: ID (from url)

>Name: DISCORD_WEBHOOK_TOKEN
Value: TOKEN (from url)

---

Now every new project release will send a POST using the created webhook, posting a new styled message in the channel where the webhook was created.



