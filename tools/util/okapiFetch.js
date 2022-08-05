import fetch from 'node-fetch';

async function okapiFetch(logger, path, options = {}) {
  const method = options.method || 'GET';

  // eslint-disable-next-line prefer-object-spread
  const res = await fetch(`${process.env.OKAPI_URL}/${path}`, Object.assign({}, options, {
    // eslint-disable-next-line prefer-object-spread
    headers: Object.assign({}, {
      'X-Okapi-Tenant': process.env.OKAPI_TENANT,
      'X-Okapi-Token': process.env.OKAPI_TOKEN,
    }, (options || {}).headers),
  }));
  if (!res.ok) {
    const text = await res.text();
    throw Error(`${method} ${path} failed with status ${res.status}: ${text}`);
  }
  logger.log('http', `${method} ${path}`);
  return res;
}

export default okapiFetch;
