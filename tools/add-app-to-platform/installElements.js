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


async function installElements(opt, logger, fam) {
  logger.log('fam', fam);

  const descriptors = await gatherDescriptors(logger, fam.elements);
  logger.log('descriptor', descriptors);

  const elements = sortByDependency(fam.elements);

  elements.forEach(element => {
    logger.log('element', element.type, '-->', element.url);
  });

  return 42;
}


export default installElements;
