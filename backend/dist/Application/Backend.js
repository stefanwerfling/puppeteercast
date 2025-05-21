import { BackendApp, SchemaDefaultArgs, HttpService } from 'figtree';
import { PuppeteerCastConfig } from '../Config/PuppeteerCastConfig.js';
import { RouteLoader } from '../Routes/RouteLoader.js';
import { FfmpegService } from '../Service/FfmpegService.js';
import { PactlService } from '../Service/PactlService.js';
import { PulseAudioService } from '../Service/PulseAudioService.js';
import { PuppeteerService } from '../Service/PuppeteerService.js';
import { XvfbService } from '../Service/XvfbService.js';
export class Backend extends BackendApp {
    static NAME = 'puppeteercast';
    _getConfigInstance() {
        const config = PuppeteerCastConfig.getInstance();
        config.setAppName(Backend.NAME);
        config.setAppTitle('PuppeteerCast');
        return config;
    }
    constructor() {
        super(Backend.NAME);
    }
    _getArgSchema() {
        return SchemaDefaultArgs;
    }
    async _initServices() {
        this._serviceList.add(new XvfbService());
        this._serviceList.add(new PulseAudioService());
        this._serviceList.add(new PuppeteerService());
        this._serviceList.add(new PactlService());
        this._serviceList.add(new FfmpegService());
        this._serviceList.add(new HttpService(RouteLoader));
    }
}
//# sourceMappingURL=Backend.js.map