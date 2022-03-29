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
