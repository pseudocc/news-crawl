import text from './text.js';

export const resolvers = { text };

/**
 * @typedef {keyof RespResolve} BodyType
 * 
 * @typedef {{
 * 'arrayBuffer': ArrayBuffer,
 * 'formData': FormData,
 * 'blob': Blob,
 * 'json': unknown,
 * 'text': string
 * }} RespResolve
 */
