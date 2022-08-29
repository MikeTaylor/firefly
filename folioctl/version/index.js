import packageInfo from '../package';

function version(argv0, logger, opt) {
  console.log(`${argv0} version ${packageInfo.version}`, packageInfo);
}

export default version;
