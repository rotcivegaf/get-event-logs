const utils = require('../utils');

module.exports.processUpgraded = async function(bot, msg, url, searchEvent) {
  const dataLogs = await utils.getDataLogs(url, searchEvent);

  const implementations = []
  for (const log of dataLogs.data.logs) {
    implementations.push({
      address: processLog(log),
      blockNumber: log.blockNumber,
    });
  }
  
  const headUrl = url.split('/0x')[0] + '/';
  let msgImplementations = `*Found *${implementations.length}* implementations:*\n`;
  for (let i = 0; i < implementations.length; i++) {
    const blockNumber = `[${implementations[i].blockNumber}](${headUrl + implementations[i].blockNumber})`;
    const address = `[${utils.shortAddr(implementations[i].address)}](${headUrl + implementations[i].address})`;

    msgImplementations += 
      ` - Imp ${i} at block ${blockNumber}:\t${address}\n`;
  }
  await bot.sendMessage(msg.chat.id, msgImplementations, { parse_mode: 'Markdown', disable_web_page_preview: true });

  return dataLogs;
}

module.exports.subscribe = async function(bot, msg, url, searchEvent, lastBlockNumber) {
  while(true) {
    const dataLogs = await utils.getDataLogs(url, searchEvent, lastBlockNumber);
    lastBlockNumber = dataLogs.nextBlock;
    
    if (dataLogs.data.logs.length) {
      let msgImplementations = `*Found new *${implementations.length}* implementations:*\n`;

      for (let i = 0; i < dataLogs.data.logs.length; i++) {
        const blockNumber = `[${implementations[i].blockNumber}](${headUrl + implementations[i].blockNumber})`;
        const address = `[${utils.shortAddr(implementations[i].address)}](${headUrl + implementations[i].address})`;
    
        msgImplementations += 
          ` - Imp ${i} at block ${blockNumber}:\t${address}\n`;
      }
      await bot.sendMessage(msg.chat.id, msgImplementations, { parse_mode: 'Markdown', disable_web_page_preview: true });
    }

    await utils.sleep(10000); // wait 10 seconds
  }
}

function processLog(log) {
  const rawImpAddr = log.data !== '0x' ?
    log.data :
    log.topics[1];
  const impAddress = '0x' + rawImpAddr.slice(2 + 24);
  
  return impAddress;
}