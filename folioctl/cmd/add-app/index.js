import fs from 'fs';
import installElements from './installElements';

function addApp(argv0, logger, opt) {
  const pluginName = opt.options.deployment;
  let plugin;
  try {
    // eslint-disable-next-line import/no-dynamic-require,global-require
    plugin = require(`./deployment/${pluginName}`);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') throw e;
    // eslint-disable-next-line no-console
    console.error(`${argv0}: deployment plugin '${pluginName}' unknown`);
    process.exit(4);
  }

  const famFile = opt.argv[1];
  const fam = JSON.parse(fs.readFileSync(famFile).toString());
  installElements(opt, logger, fam, plugin).then(res => {
    logger.log('end', 'installed', res, 'of', fam.elements.length, 'elements');
  });
}

export default {
  fn: addApp,
  okapi: true,
  desc: 'Add applications specified by nominated FAM file',
};
