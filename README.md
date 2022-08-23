# daily-twitter-bot

[![badge:ts-node](https://img.shields.io/badge/ts%20node-2D79C7.svg?&style=for-the-badge&logo=ts-node&logoColor=white)](https://www.npmjs.com/package/ts-node)
[![badge:twitter-user](https://img.shields.io/badge/twitter-1DA1F2.svg?&style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/user_of_nothing)
[![badge:discord-user](https://img.shields.io/badge/Mr.%20Dogee%236959-5865F2.svg?&style=for-the-badge&logo=discord&logoColor=white)](https://discord.com/channels/@me/688486778117816383)
[![npm:package-version](https://img.shields.io/github/package-json/dependency-version/blazsmaster/daily-twitter-bot/twitter-api-v2?logo=npm&style=for-the-badge&labelColor=CB0000&color=DA4C4C)](https://www.npmjs.com/package/twitter-api-v2)
[![gh:issues](https://img.shields.io/github/issues/blazsmaster/daily-twitter-bot?logo=github&logoColor=FFFFFF&style=for-the-badge&labelColor=333333)](https://github.com/blazsmaster/daily-twitter-bot/issues)
[![gh:license](https://img.shields.io/github/license/blazsmaster/daily-twitter-bot?logo=github&logoColor=FFFFFF&style=for-the-badge&labelColor=333333&color=656665)](https://github.com/blazsmaster/daily-twitter-bot/blob/main/LICENSE)

# Preview

Console:

<img src='https://imgur.com/wEHIu77.png'>

Twitter:

<img src='https://imgur.com/CzZYqAd.png'>

# Install packages

```ps
$ npm install
```

You need to install [nodejs](https://nodejs.org) version `16.x.x` or higher.

Check your version:

```ps
$ node --version
```

# Setup

## Step #1

Go to [Twitter for Developers](https://developer.twitter.com) and sign up to developer account.

Fill out the pages with information.

**You need to verify your phone number and email address**

## Step #2

Go to [Developer Portal](https://developer.twitter.com/en/portal/dashboard) then click on the `Projects & Apps` menu

<img src='https://imgur.com/BbYHf6d.png' width=50%>

Select or create your project, then create an App.
If your created it, click on it and navigate to the `Keys & Tokens` tab.

<img src='https://imgur.com/nPa8yFF.png' width=50%>

You will see this:

<img src='https://imgur.com/n3cSS5X.png' width=50%>

At **Consumer Keys** click on the `Regenerate` button, then click on `Yes, regenrate`.

`API Key` = `CONSUMER_KEY`

`API Key Secret` = `CONSUMER_SECRET`

Rename `.env.EXAMPLE` to `.env` then paste the keys into it:

```
CONSUMER_KEY=key
CONSUMER_SECRET=key
```

You got back to the previous page. Now generate **Access Token and Secret** for user.

<img src='https://imgur.com/uF3BrUG.png' width=50%>

`Access Token` = `ACCESS_TOKEN`

`Access Token Secret` = `ACCESS_TOKEN_SECRET`

Save your keys into `.env`:

```
ACCESS_TOKEN=key
ACCESS_TOKEN_SECRET=key
```

## **You did it! 🎉 :D**

# Usage

Two functions in the comment at the bottom of the index.ts file.

```ts
run({ onlyOnce: true }); // set true or false (read more in index.ts)
runDaily(); // the run function but repeated every 24 hours automatically
```

Remove the comment from the ones you want to use.

Run the script with

```ps
$ ts-node index
```

# Information

if you have any questions, just open an issue here: [Issues](https://github.com/blazsmaster/daily-twitter-bot/issues) [_100% not a rick roll_](https://www.youtube.com/watch?v=dQw4w9WgXcQ)
