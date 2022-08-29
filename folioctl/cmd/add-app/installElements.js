import fetch from 'node-fetch';
import okapiFetch from '../../util/okapiFetch';
import sortByDependency from './sortByDependency';


async function gatherDescriptors(logger, elements) {
  const p = [];
  for (const element of elements) {
    const promise = fetch(element.descriptor)
      .then(res => {
        if (!res.ok) throw Error(`fetch(${element.descriptor}) failed with status ${res.status}`);
        return res.json().then(res2 => [element, res2]);
      });
    p.push(promise);
  }
  return Promise.all(p);
}


async function postDescriptor(logger, md) {
  return okapiFetch(logger, '_/proxy/modules', {
    method: 'POST',
    body: JSON.stringify(md),
  });
}


async function installElements(opt, logger, fam, plugin) {
  logger.log('fam', fam);
  const pairs = await gatherDescriptors(logger, fam.elements);
  // This is an array of [element, md] pairs.
  // We make a new elements array that includes the downloaded module descriptors
  // eslint-disable-next-line prefer-object-spread
  const elements = pairs.map(([element, md]) => Object.assign({}, element, {
    md,
    caption: `${element.type}:${element.descriptor.replace(/.*\//, '')}`,
  }));
  logger.log('descriptors', elements);

  const sorted = sortByDependency(elements);
  logger.log('sorted', sorted.map(e => e.caption));

  let ninstalled = 0;
  for (const element of sorted) {
    logger.log('element', element.type, '-->', element.url);
    await postDescriptor(logger, element.md);
    switch (element.type) {
      case 'ui':
        // eslint-disable-next-line no-console
        console.warn(`WARNING: UI module (${element.caption}) installation not yet handled`);
        break;
      case 'backend':
        // eslint-disable-next-line no-case-declarations
        const instanceId = await plugin.deploy(logger, element);
        logger.log('deploy', `${opt.options.deployment} ${element.caption} ->`, instanceId);
        ninstalled++;
        break;
      default:
        // eslint-disable-next-line no-console
        console.error(`ERROR: module type '${element.type}' (${element.caption}) not supported`);
        break;
    }
  }

  return ninstalled;
}


export default installElements;
