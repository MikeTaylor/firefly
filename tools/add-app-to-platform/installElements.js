import fetch from 'node-fetch';
import sortByDependency from './sortByDependency';


async function gatherDescriptors(logger, elements) {
  const p = [];
  for (const element of elements) {
    const promise = fetch(element.descriptor)
      .then(res => {
        if (!res.ok) throw Error(`fetch(${element.descriptor}) failed with status ${res.status}`);
        console.log(`fetching ${element.descriptor} ok=${res.ok} with res`, res);
        const json = res.json();
        console.log(' --> json', json);
        return json;
      });
    p.push(promise);
  }
  const all = await Promise.all(p);
  console.log(all);
  return all;
}


async function installElements(opt, logger, fam) {
  logger.log('fam', fam);

  const descriptors = gatherDescriptors(logger, fam.elements);
  logger.log('descriptor', descriptors);

  const elements = sortByDependency(fam.elements);

  elements.forEach(element => {
    logger.log('element', element.type, '-->', element.url);
  });

  return 42;
}


export default installElements;
