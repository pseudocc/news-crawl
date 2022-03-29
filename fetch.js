import fetch from 'node-fetch';

/**
 * @typedef {import('./resolve').BodyType} BodyType
 * @typedef {import('./resolve').RespResolve} RespResolve
 */

/**
 * Extract domain name from URL
 * @param {string} url 
 * @returns {string}
 */
function domain_name(url) {
  if (!url)
    return null;
  const domain_regex = /http[s]*:\/\/(\w+\.)?(\w+)\.\w+/;
  const match = domain_regex.exec(url);
  return match ? match[2] : null;
}

/**
 * @template {BodyType} T
 * 
 * @param {string} url 
 * @param {T} type 
 * @param {function(string, RespResolve[T]): void} callback 
 * @returns {Promise<void>}
 */
export async function fetch_url(url, type, callback) {
  const domain = domain_name(url);
  if (!domain)
    return;
  try {
    const resp = await fetch(url);
    if (!resp.ok)
      throw new Error(`Failed to fetch: ${resp.statusText}(${resp.status})`);

    /** @type {RespResolve[T]} */
    const content = await resp[type]();
    callback(domain, content);
  }
  catch (e) {
    console.log(e);
  }
}
