#!/bin/node

/* eslint-disable no-console */

import optParser from 'node-getopt';
import Logger from './util/configuredLogger';

import version from './version';
import addApp from './add-app';

const commands = {
  'version': { fn: version, okapi: false, desc: 'Print version number' },
  'add-app': { fn: addApp, okapi: true, desc: 'Add applications specified by nominated FAM file' },
};

const argv0 = process.argv[1].replace(/.*\//, '');
const opt = optParser.create([
  ['D', 'deployment=STRING', 'Use add-app deployment plugin', 'okapi'],
  ['h', 'help', 'Display this help'],
])
  .setHelp(`Usage:\n  ${argv0} <cmd> [OPTIONS] <famFile>\n` +
           '\nCommands:\n' +
           Object.keys(commands).map(x => `  ${x}: ${commands[x].desc}`).join('\n') +
           '\n\nOptions:\n[[OPTIONS]]\n')
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

const cmdName = opt.argv[0];
const cmd = commands[cmdName];
if (!cmd) {
  console.error(`${argv0}: unknown command '${cmdName}'`);
  process.exit(3);
}

if (cmd.okapi) {
  ['OKAPI_URL', 'OKAPI_TENANT', 'OKAPI_TOKEN'].forEach(e => {
    if (!process.env[e]) {
      console.error(`${argv0}: environment variable ${e} undefined`);
      process.exit(2);
    }
  });
}

cmd.fn(argv0, logger, opt);