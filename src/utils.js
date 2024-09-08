const { ethers } = require('ethers');
const chalk = require('chalk');
const { HypersyncClient, presetQueryLogsOfEvent } = require('@envio-dev/hypersync-client');
const client = HypersyncClient.new({url: "https://eth.hypersync.xyz"});

module.exports.ethers = ethers;

module.exports.sleep = async function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

module.exports.bn = function(x) {
  return ethers.BigNumber.from(x);
}

module.exports.toNumber = function(x) {
  return module.exports.bn(x).toNumber();
}

module.exports.toTopic0 = function(rawSignature) {
  if (!rawSignature.startsWith('0x')) {
    rawSignature = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(rawSignature));
  }
  
  return rawSignature;
}

module.exports.toAddress = function(url) {
  const address = url.split('/0x')[1];

  if (address === undefined) {
    return url;
  }
  if (address) {
    return '0x' + address.slice(0, 40);
  } else {
    throw new Error('ERROR: toAddress, URL:', url);
  }
}

module.exports.getDataLogs = async function(url, searchEvent, lastBlockNumber = 0, toBlock = undefined) {
  const address = module.exports.toAddress(url);
  const topic0 = module.exports.toTopic0(searchEvent);

  let dataLogs;
  let logs = [];

  while (true) {
    console.log(`Fetching logs for ${chalk.green.bold(address)} from block ${chalk.yellow(lastBlockNumber)}`);

    let query = presetQueryLogsOfEvent(address, topic0, lastBlockNumber, toBlock);

    dataLogs = (await client.get(query));

    const lastEventNumber = module.exports.toNumber(dataLogs.nextBlock);

    if (lastBlockNumber === lastEventNumber) {
      break;
    }

    logs = logs.concat(dataLogs.data.logs);
    lastBlockNumber = lastEventNumber;

    await module.exports.sleep(300);
  }

  dataLogs.data.logs = logs;
  return dataLogs;
}

module.exports.shortAddr = function(addr) {
  return addr.slice(0, 6) + '...' + addr.slice(42 - 4);
}