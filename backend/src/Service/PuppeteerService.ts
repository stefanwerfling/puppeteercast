import {Logger, ServiceAbstract, ServiceImportance, ServiceStatus, StringHelper} from 'figtree';
import {Browser, Page} from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import {PuppeteerCastPage} from '../Puppeteer/PuppeteerCastPage.js';
import {PactlService} from './PactlService.js';
import {PulseAudioService} from './PulseAudioService.js';
import {XvfbService} from './XvfbService.js';

/**
 * Puppeteer - Service
 */
export class PuppeteerService extends ServiceAbstract {

    /**
     * Service Name
     */
    public static NAME = 'puppeteer';

    /**
     * Importance
     */
    protected readonly _importance: ServiceImportance = ServiceImportance.Important;

    /**
     * Browser
     * @protected
     */
    protected _browse: Browser|null = null;

    /**
     * Page
     * @protected
     */
    protected _page: PuppeteerCastPage|null = null;

    /**
     * Constructor
     */
    public constructor() {
        super(PuppeteerService.NAME, [XvfbService.NAME, PulseAudioService.NAME, PactlService.NAME]);
    }

    /**
     * Start the service
     */
    public override async start(): Promise<void> {
        this._inProcess = true;
        this._status = ServiceStatus.Progress;

        try {
            // @ts-ignore
            puppeteer.use(StealthPlugin());

            // @ts-ignore
            this._browse = await puppeteer.launch({
                headless: false,
                executablePath: '/usr/bin/chromium',
                env: {
                    DISPLAY: ':99',
                    PULSE_RUNTIME_PATH: PulseAudioService.APP_RUNTIME_PATH,
                    PULSE_SERVER: `${PulseAudioService.APP_RUNTIME_PATH}/native`
                },
                args: [
                    '--no-sandbox',
                    '--disable-infobars',
                    '--cursor=none',
                    '--enable-features=HideCursor',
                    '--disable-setuid-sandbox',
                    '--autoplay-policy=no-user-gesture-required',
                    '--use-gl=egl',
                    '--start-fullscreen',
                    '--window-size=1280,720',

                    // Audio / Media
                    '--enable-audio',
                    '--use-fake-ui-for-media-stream',
                    '--alsa-output-device=default',
                    '--enable-features=WebAudio',
                    '--enable-audio-output',

                    // Security / Sandbox
                    '--no-zygote',
                    '--disable-dev-shm-usage',
                    '--disable-web-security',

                    // other
                    '--enable-precise-memory-info',
                    '--disable-features=Translate',
                    '--no-first-run',
                    '--disable-gpu',
                ],
                ignoreDefaultArgs: [
                    '--enable-automation'
                ]
            });

            if (this._browse) {
                this._page = new PuppeteerCastPage(await this._browse.newPage());
            }
        } catch(error) {
            this._status = ServiceStatus.Error;
            this._inProcess = false;

            this._statusMsg = StringHelper.sprintf(
                'PuppeteerService::start: Error while create the Puppeteer: %e',
                error
            );

            Logger.getLogger().error(this._statusMsg);

            throw error;
        }

        this._statusMsg = '';
        this._status = ServiceStatus.Success;
        this._inProcess = false;
    }

    /**
     * Return the current cast page
     * @return {PuppeteerCastPage|null}
     */
    public getPage(): PuppeteerCastPage|null {
        return this._page;
    }

    /**
     * Stop the service
     * @param {boolean} forced
     */
    public override async stop(forced: boolean = false): Promise<void> {
        try {
            if (this._browse) {
                if (this._page) {
                    await this._page.getPage().close();
                    this._page = null;
                }

                await this._browse.close();
                this._browse = null;
            }
        } catch (error) {
            this._status = ServiceStatus.Error;
            this._statusMsg = StringHelper.sprintf('PuppeteerService::stop: Error stopping the Puppeteer: %e', error);

            Logger.getLogger().error(this._statusMsg);
        } finally {
            this._status = ServiceStatus.None;
            this._inProcess = false;
        }
    }

}