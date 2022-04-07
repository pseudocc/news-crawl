import fs from 'fs';
import path from 'path';
import readline from 'readline';
import dotenv from 'dotenv';
import moment from 'moment';
import { resolvers } from './resolve/index.js';
import { fetch_url } from './fetch.js';

/**
 * @param {import('./resolve').BodyType} type
 */
function handle_line(type) {
  /** 
   * @param {string} line
   */
  function handle(line) {
    return fetch_url(line, type, resolvers[type]);
  }
  return handle;
}

function prepare_env() {
  const today = moment().format('YYYY-MM-DD');
  const out_root = path.join('out', today);
  console.log(today);

  dotenv.config();
  if (!fs.existsSync(out_root))
    fs.mkdirSync(out_root, { recursive: !0 });

  process.chdir(out_root);
}

prepare_env();

const rl = readline.createInterface(process.stdin);
rl.on('line', handle_line('text'));
