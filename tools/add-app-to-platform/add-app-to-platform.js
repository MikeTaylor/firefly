#!/bin/node

/* eslint-disable no-console */

import fs from 'fs';
import optParser from 'node-getopt';
import Logger from '../util/configuredLogger';
import packageInfo from '../package';
import installElements from './installElements';

const logger = new Logger();

const argv0 = process.argv[1].replace(/.*\//, '');
const opt = optParser.create([
  ['o', 'orchestration=STRING', 'Use orchestration plugin', 'kubernetes'],
  ['V', 'version', 'Show version and exit'],
  ['h', 'help', 'Display this help'],
])
  .setHelp(`Usage:\n  ${argv0} [OPTIONS] <famFile>\n\nOptions:\n[[OPTIONS]]\n`)
  .bindHelp()
  .parseSystem();

if (opt.options.version) {
  console.log(`${argv0} version ${packageInfo.version}`, packageInfo);
  process.exit(0);
}

if (opt.argv.length !== 1) {
  console.info(opt.getHelp());
  process.exit(1);
}

const maybeEnv = (e) => process.env[e] && logger.log('env', `${e}=${process.env[e]}`);
maybeEnv('LOGGING_CATEGORIES');
maybeEnv('LOGCAT');

const famFile = opt.argv[0];
const fam = JSON.parse(fs.readFileSync(famFile).toString());
installElements(opt, logger, fam).then(res => {
  logger.log('end', res);
});
