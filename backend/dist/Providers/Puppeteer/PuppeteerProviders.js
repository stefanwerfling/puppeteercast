import { BaseProviders } from 'figtree';
export class PuppeteerProviders extends BaseProviders {
    static TYPE = 'puppeteer';
    async getProvider(name) {
        return this._getProvider(name, PuppeteerProviders.TYPE);
    }
    async getProviders() {
        return this._getProviders(PuppeteerProviders.TYPE);
    }
}
//# sourceMappingURL=PuppeteerProviders.js.map