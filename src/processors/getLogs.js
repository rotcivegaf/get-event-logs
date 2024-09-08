const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
const chalk = require('chalk');
const { HypersyncClient, presetQueryLogsOfEvent } = require('@envio-dev/hypersync-client');
const client = HypersyncClient.new({url: "https://eth.hypersync.xyz"});

module.exports.main = async function(url, searchEvent) {
  //const endPath = address + ".json";
  //const shortPath = "../data/" + endPath;
  //const filePath = path.join(__dirname, shortPath);

  //console.log(rawLogs.length);

  //fs.mkdirSync(path.dirname(filePath), { recursive: true });
  //fs.writeFileSync(filePath, JSON.stringify(rawLogs, null, 2));
}
