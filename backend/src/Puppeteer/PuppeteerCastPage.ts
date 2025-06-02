import {Logger} from 'figtree';
import {ConsoleMessage, Page} from 'puppeteer';
import {SelectorQueryable, SelectorWaiter} from './SelectorWaiter.js';

/**
 * PuppeteerCast Page
 */
export class PuppeteerCastPage {

    /**
     * Page
     * @protected
     */
    protected _page: Page;

    /**
     * User Agent
     * @protected
     */
    protected _userAgent: string = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36';

    /**
     * Console enabled
     * @protected
     */
    protected _consoleEnabled: boolean = false;

    /**
     * Selector
     * @protected
     */
    protected _selectorWaiter: SelectorWaiter;

    /**
     * Constructor
     * @param {Page} page
     * @param {string} userAgent
     */
    public constructor(page: Page, userAgent?: string) {
        this._page = page;
        this._selectorWaiter = new SelectorWaiter();

        this._page.on('console', this._onConsole.bind(this));

        if (userAgent) {
            this.setUserAgent(userAgent).then();
        } else {
            this.setUserAgent(this._userAgent).then();
        }
    }

    protected _onConsole(msg: ConsoleMessage): void {
        if (this._consoleEnabled) {
            Logger.getLogger().info(`PuppeteerCastPage: BROWSER LOG: ${msg.type().toUpperCase()} ${msg.text()}`);
        }
    }

    /**
     * Set the user agent
     * @param {string} userAgent
     */
    public async setUserAgent(userAgent: string): Promise<void> {
        await this._page.setUserAgent(userAgent);
    }

    /**
     * Return the page from puppeteer
     * @return {Page}
     */
    public getPage(): Page {
        return this._page;
    }

    /**
     * Selector waiter
     * @template T extends SelectorQueryable
     * @param {T} obj
     * @param selector
     * @param intervalMs
     * @param maxDurationMs
     */
    public async selectorWaiter<T extends SelectorQueryable>(
        obj: T,
        selector: string,
        intervalMs: number = 30000,
        maxDurationMs: number = 180000
    ): Promise<any> {
        return this._selectorWaiter.waitForSelectorWithInterval(obj, selector, intervalMs, maxDurationMs);
    }

}