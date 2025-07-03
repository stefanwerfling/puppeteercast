import {ExtractSchemaResultType, Vts} from 'vts';

/**
 * Schema puppeteer set cookie request
 */
export const SchemaPuppeteerSetCookieRequest = Vts.object({
    cookies_json_str: Vts.string({description: 'Cookies as json string'})
}, {description: 'Set cookies for puppeteer'});

/**
 * Type of puppeteer set cookie request
 */
export type PuppeteerSetCookieRequest = ExtractSchemaResultType<typeof SchemaPuppeteerSetCookieRequest>;