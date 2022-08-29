import okapiFetch from '../../../util/okapiFetch';


function makeLaunchDescriptor(element) {
  // eslint-disable-next-line prefer-object-spread
  const ld = Object.assign({}, element.md.launchDescriptor);
  if (element.url) {
    // Override the Docker specifications in the module's launch descriptor
    ld.dockerImage = element.url;
  }

  // XXX We will need a way to inject dockerArgs, env, etc. -- but from where?
  return ld;
}


async function getNodeId(logger) {
  const res1 = await okapiFetch(logger, '_/discovery/nodes');
  const nodes = await res1.json();
  if (nodes.length > 1) {
    logger.log('plugin', `WARNING: found ${nodes.length} nodes, deploying on first`);
  }
  return nodes[0].nodeId;
}


async function deploy(logger, element) {
  const ld = makeLaunchDescriptor(element);

  // Annoyingly, we have to ask Okapi what the name of the one node is, so we can tell it right back
  const nodeId = await getNodeId(logger);
  const dd = {
    srvcId: element.md.id,
    nodeId,
    descriptor: ld,
  };

  logger.log('plugin', `Okapi deployment descriptor for ${element.caption}:`, dd);
  const res = await okapiFetch(logger, '_/discovery/modules', {
    method: 'POST',
    body: JSON.stringify(dd),
    headers: {
      'X-Okapi-Tenant': 'supertenant',
    }
  });

  const location = res.headers.get('location');
  return location.replace(/.*\//, '');
}


// eslint-disable-next-line import/prefer-default-export
export { deploy };
