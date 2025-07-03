import {BaseProviders, ProviderEntry} from 'figtree';
import {IPuppeteerProvider} from './IPuppeteerProvider.js';
import {LoopTubProvider} from './LoopTup/LoopTubProvider.js';

/**
 * Puppeteer Providers
 */
export class PuppeteerProviders extends BaseProviders<ProviderEntry, IPuppeteerProvider> {

    /**
     * TYPE of Provider
     */
    public static TYPE = 'puppeteer';

    public constructor() {
        super(PuppeteerProviders.TYPE);
    }

    public async getProvider(name: string): Promise<IPuppeteerProvider | null> {
        switch (name) {
            case LoopTubProvider.NAME:
                return new LoopTubProvider();
        }

        return super.getProvider(name);
    }

    public async getProviders(): Promise<IPuppeteerProvider[]> {
        const list: IPuppeteerProvider[] = [];

        list.push(new LoopTubProvider());
        list.push(...await super.getProviders());

        return list;
    }

}