# Bot Event Tool

## Quickstart

- Download the repo and install dependencies

```bash
git clone https://github.com/rotcivegaf/get-event-logs
cd get-event-logs
npm install
```

- Now create your bot in telegram: [https://core.telegram.org/bots/tutorial](https://core.telegram.org/bots/tutorial)
- Create the `./.config.js`:

```bash
nano ./.config.js
```

- With the bot's `telegramToken` and add this line inside the file `module.exports.telegramToken = "<YOUR_TELEGRAM_TOKEN>";`

- Run the program:

```bash
node index.js
```

- Go to the telegram bot, send `./start` and follow the commands


## The idea

The idea of this bot in telegram is to obtain information based on the events of a contract, process this information and provide it to the user

## Introduction

I am a solidity auditor and sometimes to demonstrate a bug or calculate the amount of possible damage I have to read different events from the blockchain. For this I usually have to create a project in node and all this takes a lot of time. Given this approach and with the help of Envio I decided to create a bot in telegram (could be moved to discord, whatsapp, etc) with which a user can get events from a contract in a simple way.

A clear example is the event that is triggered when changing the implementation of the `TransparentUpgradeableProxy` contract, here an auditor can look for the change in the code and a normal user can be alarmed.

The first option of the bot is to give you the list of events, after that you can subscribe to the event so that the bot will send a message to the user once a new event appears.

On the other hand, leave a tool that can read events from the blockchain and save them in a file for later processing, this is really useful for auditors and developers.

## Technologies

The technologies I use are `node.js`, `TelegramBot`, `ethers`, `@envio-dev/hypersync-client`, among others.
- `@envio-dev/hypersync-client`: I use it to get the blockchain contract logs, it's a quick and easy way to get them.
- `node.js`: I use it to make the backend of the bot.
- TelegramBot`: It gives me the ability for users to connect and communicate with the bot.
- `ethers`: I use it as a communication library with web3.

I think the most hacky thing is that a common user can for example see the new implementations of a contract to be aware of the changes in the code where he invested his money.

While it is still an MVP, using this you can process a lot of events making usability really great, another fascinating example is that you can monitor the events of a liquidity pool of uniswap, and thus calculate the price of the token in any block.
