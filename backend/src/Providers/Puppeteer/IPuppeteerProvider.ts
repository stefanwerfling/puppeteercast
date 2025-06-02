import {IProvider, ProviderEntry} from 'figtree';
import {Channel} from '../../Channels/Channel.js';
import {PuppeteerCastPage} from '../../Puppeteer/PuppeteerCastPage.js';

/**
 * IPuppeteerProvider
 */
export interface IPuppeteerProvider extends IProvider<ProviderEntry> {

    /**
     * Call puppeteer
     * @param {PuppeteerCastPage} page
     * @param {Channel} channel
     */
    call(page: PuppeteerCastPage, channel: Channel): Promise<boolean>;

}