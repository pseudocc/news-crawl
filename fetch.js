import fetch from 'node-fetch';
import { domain_name } from './utils.js';

/**
 * @typedef {import('./resolve').BodyType} BodyType
 * @typedef {import('./resolve').RespResolve} RespResolve
 */

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
