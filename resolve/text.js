import * as fs from 'fs';
import { toJson } from 'xml2json';
import { fetch_url } from '../fetch.js';
import { array_s, domain_name } from '../utils.js';

/**
 * @param {string} domain
 * @param {string} content
 */
export default async function text(domain, content) {
  if (!content)
    return;
  // currently the response is always xml
  try {
    const xml_obj = toJson(content, { object: !0 });
    for (const handler of xml_handlers) {
      const store = await handler(xml_obj);
      if (store) {
        const target_file = `${domain}.txt`;
        if (fs.existsSync(target_file))
          fs.rmSync(target_file);
        const fd = fs.openSync(target_file, 'w');
        for (const url of store) {
          if (domain == domain_name(url))
            fs.writeSync(fd, `${url}\n`);
        }
        fs.closeSync(fd);
        return;
      }
    }
  }
  catch (e) {
    console.error(e);
    process.exit(t);
  }
}

const xml_handlers = [
  sitemap_index,
  sitemap,
  rss_feeds
];

/**
 * @type {XmlHandler}
 */
async function sitemap_index(xml_obj) {
  if (!xml_obj)
    return null;
  const maps = array_s(xml_obj.sitemapindex, 'sitemap');
  if (!maps)
    return null;

  const store = [];

  /**
   * @param {string} _content 
   */
  function sitemap_cb(_, _content) {
    if (!_content)
      return;
    try {
      const _xml_obj = toJson(_content, { object: !0 });
      sitemap_i(store, _xml_obj);
    }
    catch (e) {
      console.error(e);
      process.exit(1);
    }
  }

  for (const map of maps)
    await fetch_url(map.loc, 'text', sitemap_cb);

  return store.length ? store : null;
}

/**
 * @type {XmlHandler}
 */
async function sitemap(xml_obj) {
  const store = [];
  sitemap_i(store, xml_obj);
  return store.length ? store : null;
}

async function rss_feeds(xml_obj) {
  if (!xml_obj || !xml_obj.rss || !xml_obj.rss.channel)
    return null;
  const items = array_s(xml_obj.rss.channel, 'item');
  return items.length ? items.map(i => i.link) : null;
}

/**
 * @param {UrlStorage} store
 * @param {XmlInstance} xml_obj
 */
function sitemap_i(store, xml_obj) {
  const urlset = xml_obj && xml_obj.urlset;
  if (!urlset)
    return;

  const urls = array_s(urlset, 'url');
  for (const url of urls) {
    try {
      const lang = url['news:news']['news:publication']['news:language'];
      if (lang == process.env.LANGUAGE)
        store.push(url.loc);
    }
    catch {
      if (process.env.BOLD)
        store.push(url.loc);
    }
  }
}

/**
 * @typedef {string[]} UrlStorage
 * @typedef {{[key: string]: unknown}} XmlInstance
 * @typedef {function(XmlInstance): Promise<UrlStorage>} XmlHandler 
 */
