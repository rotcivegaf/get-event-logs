const config = require('./.config.js');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.telegramToken, { polling: true });

const CustomEvent = require('./src/processors/CustomEvent.js');
const TransparentUpgradeableProxy = require('./src/processors/TransparentUpgradeableProxy.js');
const ERC20 = require('./src/processors/ERC20.js');

const eventsOpt = [
  // event Upgraded(address indexed implementation);
  [{ text: 'TransparentUpgradeableProxy::Upgraded', callback_data: 'Upgraded(address)' }],
  // event Transfer(address indexed from, address indexed to, uint256 value);
  [{ text: 'ERC20::Transfer', callback_data: 'Transfer(address,address,uint256)' }],
  [{ text: 'Custom event', callback_data: 'CustomEvent' }],
];

async function main() {
  let waitURLInput = false;
  let waitEventSigInput = false;
  let selectedOption = '';
  let dataLogs;
  let url;
  let eventSignature;

  bot.onText(/\/start/, async (msg) => {
    const eventsOptions = { reply_markup: { inline_keyboard: eventsOpt }};
    await bot.sendMessage(msg.chat.id, 'Choose event:', eventsOptions);
  });

  bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;

    if (msg.text === 'Choose event:') {
      selectedOption = data;
      if (data === 'CustomEvent') {
        await bot.sendMessage(msg.chat.id, `Enter the event signature:`);
        waitEventSigInput = true;
      } else {
        await bot.sendMessage(msg.chat.id, `Enter the URL of the contract:`);
        waitURLInput = true;
      }
    }

    if (msg.text === 'Subscribe') {
      if (selectedOption === 'CustomEvent') {
        CustomEvent.subscribe(bot, msg, url, selectedOption, dataLogs.nextBlock);
      } else if (selectedOption === 'Upgraded(address)') {
        TransparentUpgradeableProxy.subscribe(bot, msg, url, selectedOption, dataLogs.nextBlock);
      } else if (selectedOption === 'Transfer(address,address,uint256)') {
        ERC20.subscribe(bot, msg, url, selectedOption, dataLogs.nextBlock);
      }

      selectedOption = '';
      await bot.sendMessage(msg.chat.id, `Subscribed`);
    }
  });

  bot.on('message', async(msg) => {
    if (waitEventSigInput) {
      waitEventSigInput = false;
      eventSignature = msg.text;
      await bot.sendMessage(msg.chat.id, `Enter the URL of the contract:`);
      waitURLInput = true;
    } else if (waitURLInput && selectedOption) {
      url = msg.text;

      await bot.sendMessage(msg.chat.id, `Processing...`);

      if (selectedOption === 'CustomEvent') {
        dataLogs = await CustomEvent.process(bot, msg, url, eventSignature);
      } else if (selectedOption === 'Upgraded(address)') {
        dataLogs = await TransparentUpgradeableProxy.processUpgraded(bot, msg, url, selectedOption);
      } else if (selectedOption === 'Transfer(address,address,uint256)') {
        dataLogs = await ERC20.processTransfer(bot, msg, url, selectedOption);
      } 

      waitURLInput = false;

      await bot.sendMessage(
        msg.chat.id, 
        'Subscribe', 
        {reply_markup: {inline_keyboard: [[{ text: 'Subscribe', callback_data: 'subscribe' }]]}}
      );
    }
  });
}

main();