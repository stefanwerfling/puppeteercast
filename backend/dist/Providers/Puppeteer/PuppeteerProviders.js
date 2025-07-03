import { BaseProviders } from 'figtree';
import { LoopTubProvider } from './LoopTup/LoopTubProvider.js';
export class PuppeteerProviders extends BaseProviders {
    static TYPE = 'puppeteer';
    constructor() {
        super(PuppeteerProviders.TYPE);
    }
    async getProvider(name) {
        switch (name) {
            case LoopTubProvider.NAME:
                return new LoopTubProvider();
        }
        return super.getProvider(name);
    }
    async getProviders() {
        const list = [];
        list.push(new LoopTubProvider());
        list.push(...await super.getProviders());
        return list;
    }
}
//# sourceMappingURL=PuppeteerProviders.js.map