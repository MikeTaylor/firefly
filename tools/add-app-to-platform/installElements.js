import fetch from 'node-fetch';
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
  const url = `${process.env.OKAPI_URL}/_/proxy/modules`;
  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(md),
    headers: {
      'X-Okapi-Tenant': process.env.OKAPI_TENANT,
      'X-Okapi-Token': process.env.OKAPI_TOKEN,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw Error(`POST to ${url} failed with status ${res.status}: ${text}`);
  }
  logger.log('post', `${md.id} (${md.name}`);
}


async function installElements(opt, logger, fam) {
  logger.log('fam', fam);
  const pairs = await gatherDescriptors(logger, fam.elements);
  // This is an array of [element, md] pairs.
  // We make a new elements array that includes the downloaded module descriptors
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
        // await deployContainer(logger, element);
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
