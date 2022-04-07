/**
 * @param {{[key: string]: unknown}} obj 
 * @param {string} prop_name 
 * @returns {unknown[]}
 */
export function array_s(obj, prop_name) {
  const prop = obj && obj[prop_name];
  if (prop == null)
    return null;

  return (prop instanceof Array) ? prop : [prop];
}

/**
 * Extract domain name from URL
 * @param {string} url 
 * @returns {string}
 */
export function domain_name(url) {
  if (!url)
    return null;
  const domain_regex = /http[s]?:\/\/(\w+\.)?(\w+)\.\w+/;
  const match = domain_regex.exec(url);
  return match ? match[2] : null;
}
