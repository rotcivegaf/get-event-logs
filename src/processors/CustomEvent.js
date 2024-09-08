const utils = require('../utils');

module.exports.process = async function(bot, msg, url, searchEvent) {
  const dataLogs = await utils.getDataLogs(url, searchEvent);
  let logs = dataLogs.data.logs;
  const headUrl = url.split('/0x')[0] + '/';

  let headMsg;
  if (logs.length > 20) {
    headMsg = `*Found *${logs.length}* logs, show the last 50 logs:*\n`;
    logs = logs.slice(logs.length - 20, logs.length);
  } else {
    headMsg = `*Found *${logs.length}* logs:*\n`;
  }
  await bot.sendMessage(msg.chat.id, headMsg, { parse_mode: 'Markdown', disable_web_page_preview: true });

  for (let i = 0; i < logs.length; i++) {
    const blockNumber = `[${logs[i].blockNumber}](${headUrl + logs[i].blockNumber})`;
    const logMsg = ` - Log ${i} at block ${blockNumber}:\n${JSON.stringify(logs[i], null, 2)}\n`;
    await bot.sendMessage(msg.chat.id, logMsg, { parse_mode: 'Markdown', disable_web_page_preview: true });
  }

  return dataLogs;
}

module.exports.subscribe = async function(bot, msg, url, searchEvent, lastBlockNumber) {
  const headUrl = url.split('/0x')[0] + '/';
  while(true) {
    const dataLogs = await utils.getDataLogs(url, searchEvent, lastBlockNumber);
    const logs = dataLogs.data.logs;
    lastBlockNumber = dataLogs.nextBlock;
    
    if (logs.length) {
      let msgLogs = `*Found new *${logs.length}* logs:*\n`;

      for (let i = 0; i < logs.length; i++) {
        const blockNumber = `[${logs[i].blockNumber}](${headUrl + logs[i].blockNumber})`;
        const address = `[${utils.shortAddr(logs[i].address)}](${headUrl + logs[i].address})`;
    
        msgLogs += 
          ` - Imp ${i} at block ${blockNumber}:\t${address}\n`;
      }
      await bot.sendMessage(msg.chat.id, msgLogs, { parse_mode: 'Markdown', disable_web_page_preview: true });
    }

    await utils.sleep(10000); // wait 10 seconds
  }
}