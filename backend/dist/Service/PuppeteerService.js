import { Logger, ServiceAbstract, ServiceImportance, ServiceStatus, StringHelper } from 'figtree';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { PuppeteerCastPage } from '../Puppeteer/PuppeteerCastPage.js';
import { PactlService } from './PactlService.js';
import { PulseAudioService } from './PulseAudioService.js';
import { XvfbService } from './XvfbService.js';
export class PuppeteerService extends ServiceAbstract {
    static NAME = 'puppeteer';
    _importance = ServiceImportance.Important;
    _browse = null;
    _page = null;
    constructor() {
        super(PuppeteerService.NAME, [XvfbService.NAME, PulseAudioService.NAME, PactlService.NAME]);
    }
    async start() {
        this._inProcess = true;
        this._status = ServiceStatus.Progress;
        try {
            puppeteer.use(StealthPlugin());
            this._browse = await puppeteer.launch({
                headless: false,
                userDataDir: './my-profile',
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
                    '--enable-audio',
                    '--use-fake-ui-for-media-stream',
                    '--alsa-output-device=default',
                    '--enable-features=WebAudio',
                    '--enable-audio-output',
                    '--no-zygote',
                    '--disable-dev-shm-usage',
                    '--disable-web-security',
                    '--enable-precise-memory-info',
                    '--disable-features=Translate,IsolateOrigins,site-per-process',
                    '--no-first-run',
                    '--disable-gpu',
                ],
                ignoreDefaultArgs: [
                    '--enable-automation'
                ]
            });
            if (this._browse) {
                this._page = new PuppeteerCastPage(await this._browse.newPage());
                await this._page.getPage().evaluateOnNewDocument(() => {
                    Object.defineProperty(navigator, 'webdriver', {
                        get: () => false,
                    });
                });
            }
        }
        catch (error) {
            this._status = ServiceStatus.Error;
            this._inProcess = false;
            this._statusMsg = StringHelper.sprintf('PuppeteerService::start: Error while create the Puppeteer: %e', error);
            Logger.getLogger().error(this._statusMsg);
            throw error;
        }
        this._statusMsg = '';
        this._status = ServiceStatus.Success;
        this._inProcess = false;
    }
    getPage() {
        return this._page;
    }
    async stop(forced = false) {
        try {
            if (this._browse) {
                if (this._page) {
                    await this._page.getPage().close();
                    this._page = null;
                }
                await this._browse.close();
                this._browse = null;
            }
        }
        catch (error) {
            this._status = ServiceStatus.Error;
            this._statusMsg = StringHelper.sprintf('PuppeteerService::stop: Error stopping the Puppeteer: %e', error);
            Logger.getLogger().error(this._statusMsg);
        }
        finally {
            this._status = ServiceStatus.None;
            this._inProcess = false;
        }
    }
}
//# sourceMappingURL=PuppeteerService.js.map