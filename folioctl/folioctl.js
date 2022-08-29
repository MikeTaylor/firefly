#!/bin/node

/* eslint-disable no-console */

import fs from 'fs';
import optParser from 'node-getopt';
import Logger from './util/configuredLogger';
import packageInfo from './package';
import installElements from './add-app/installElements';

const argv0 = process.argv[1].replace(/.*\//, '');
['OKAPI_URL', 'OKAPI_TENANT', 'OKAPI_TOKEN'].forEach(e => {
  if (!process.env[e]) {
    console.error(`${argv0}: environment variable ${e} undefined`);
    process.exit(2);
  }
});

const opt = optParser.create([
  ['D', 'deployment=STRING', 'Use deployment plugin', 'okapi'],
  ['V', 'version', 'Show version and exit'],
  ['h', 'help', 'Display this help'],
])
  .setHelp(`Usage:\n  ${argv0} <cmd> [OPTIONS] <famFile>\n\nOptions:\n[[OPTIONS]]\n`)
  .bindHelp()
  .parseSystem();

if (opt.options.version) {
  console.log(`${argv0} version ${packageInfo.version}`, packageInfo);
  process.exit(0);
}

if (opt.argv.length < 2) {
  console.info(opt.getHelp());
  process.exit(1);
}

const logger = new Logger();
['OKAPI_URL', 'OKAPI_TENANT', 'OKAPI_TOKEN', 'LOGGING_CATEGORIES', 'LOGCAT'].forEach(e => {
  if (process.env[e]) logger.log('env', `${e}=${process.env[e]}`);
});

const cmd = opt.argv[0];
switch (cmd) {
case 'add-app':
  addApp(opt);
  break;
default:
  console.error(`${argv0}: unknown command '${cmd}'`);
  process.exit(3);
  break;
}


function addApp(opt) {
  const pluginName = opt.options.deployment;
  let plugin;
  try {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    plugin = require(`./add-app/deployment/${pluginName}`);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e;
    console.error(`${argv0}: deployment plugin '${pluginName}' unknown`);
    process.exit(4);
  }

  const famFile = opt.argv[1];
  const fam = JSON.parse(fs.readFileSync(famFile).toString());
  installElements(opt, logger, fam, plugin).then(res => {
    logger.log('end', 'installed', res, 'of', fam.elements.length, 'elements');
  });
}
