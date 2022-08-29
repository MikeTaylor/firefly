/*
 * XXX To do this right, we need to topologically sort according to
 * the dependencies listed in the module descriptors of the elements.
 * For now, we just put the backend modules before the UI modules.
 */

function sortByDependency(original) {
  const elements = [...original];
  elements.sort((a, b) => {
    if (a.type < b.type) return -1;
    if (a.type > b.type) return 1;
    return 0;
  });
  return elements;
}

export default sortByDependency;
