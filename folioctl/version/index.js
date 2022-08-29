import packageInfo from '../package';

function version(argv0, _logger, _opt) {
  // eslint-disable-next-line no-console
  console.log(`${argv0} version ${packageInfo.version}`, packageInfo);
}

export default version;
