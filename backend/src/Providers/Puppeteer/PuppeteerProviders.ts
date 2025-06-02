import {BaseProviders, ProviderEntry} from 'figtree';
import {IPuppeteerProvider} from './IPuppeteerProvider.js';
import {IPuppeteerProviders} from './IPuppeteerProviders.js';

/**
 * Puppeteer Providers
 */
export class PuppeteerProviders extends BaseProviders<ProviderEntry, IPuppeteerProvider> implements IPuppeteerProviders {

    /**
     * TYPE of Provider
     */
    public static TYPE = 'puppeteer';

    /**
     * Get a provider object by provider name.
     * @param {string} name - Name of provider.
     * @returns {IPuppeteerProvider|null}
     */
    public async getProvider(name: string): Promise<IPuppeteerProvider | null> {
        return this._getProvider(name, PuppeteerProviders.TYPE);
    }

    /**
     * Get a provider list with name and title.
     * @returns {ProviderEntry[]}
     */
    public async getProviders(): Promise<ProviderEntry[]> {
        return this._getProviders(PuppeteerProviders.TYPE);
    }

}