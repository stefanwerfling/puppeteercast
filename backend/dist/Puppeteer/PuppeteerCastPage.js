import { FileHelper, Logger } from 'figtree';
import { SelectorWaiter } from './SelectorWaiter.js';
export class PuppeteerCastPage {
    _page;
    _userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';
    _consoleEnabled = false;
    _selectorWaiter;
    constructor(page, userAgent) {
        this._page = page;
        this._selectorWaiter = new SelectorWaiter();
        this._page.on('console', this._onConsole.bind(this));
        if (userAgent) {
            this.setUserAgent(userAgent).then();
        }
        else {
            this.setUserAgent(this._userAgent).then();
        }
    }
    _onConsole(msg) {
        if (this._consoleEnabled) {
            Logger.getLogger().info(`PuppeteerCastPage: BROWSER LOG: ${msg.type().toUpperCase()} ${msg.text()}`);
        }
    }
    async setUserAgent(userAgent) {
        await this._page.setUserAgent(userAgent);
    }
    async saveCookies(file) {
        const cookies = await this._page.browserContext().cookies();
        const cookieJson = JSON.stringify(cookies, null, 2);
        if (await FileHelper.fileExist(file)) {
            await FileHelper.fileDelete(file);
        }
        await FileHelper.create(file, cookieJson);
    }
    async loadCookies(file) {
        if (await FileHelper.fileExist(file)) {
            const cookieStr = await FileHelper.fileRead(file);
            const cookies = JSON.parse(cookieStr);
            await this._page.browserContext().setCookie(...cookies);
            return true;
        }
        return false;
    }
    getPage() {
        return this._page;
    }
    async selectorWaiter(obj, selector, intervalMs = 30000, maxDurationMs = 180000) {
        return this._selectorWaiter.waitForSelectorWithInterval(obj, selector, intervalMs, maxDurationMs);
    }
}
//# sourceMappingURL=PuppeteerCastPage.js.map