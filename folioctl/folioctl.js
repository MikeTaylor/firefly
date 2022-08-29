#!/bin/node

/* eslint-disable no-console */

import optParser from 'node-getopt';
import Logger from './util/configuredLogger';
import packageInfo from './package';
import addApp from './add-app';

const argv0 = process.argv[1].replace(/.*\//, '');
['OKAPI_URL', 'OKAPI_TENANT', 'OKAPI_TOKEN'].forEach(e => {
  if (!process.env[e]) {
    console.error(`${argv0}: environment variable ${e} undefined`);
    process.exit(2);
  }
});

const opt = optParser.create([
  ['D', 'deployment=STRING', 'Use add-app deployment plugin', 'okapi'],
  ['h', 'help', 'Display this help'],
])
  .setHelp(`Usage:\n  ${argv0} <cmd> [OPTIONS] <famFile>\n\nOptions:\n[[OPTIONS]]\n`)
  .bindHelp()
  .parseSystem();

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
case 'version':
  console.log(`${argv0} version ${packageInfo.version}`, packageInfo);
  break;
case 'add-app':
  addApp(argv0, logger, opt);
  break;
default:
  console.error(`${argv0}: unknown command '${cmd}'`);
  process.exit(3);
  break;
}
