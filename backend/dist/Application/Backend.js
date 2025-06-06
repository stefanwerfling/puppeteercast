import { BackendApp, SchemaDefaultArgs, HttpService, PluginService } from 'figtree';
import { ChannelManager } from '../Channels/ChannelManager.js';
import { PuppeteerCastConfig } from '../Config/PuppeteerCastConfig.js';
import { RouteLoader } from '../Routes/RouteLoader.js';
import { FfmpegService } from '../Service/FfmpegService.js';
import { DLNAService } from '../Service/DLNAService.js';
import { PactlService } from '../Service/PactlService.js';
import { PulseAudioService } from '../Service/PulseAudioService.js';
import { PuppeteerService } from '../Service/PuppeteerService.js';
import { XvfbService } from '../Service/XvfbService.js';
export class Backend extends BackendApp {
    static NAME = 'puppeteercast';
    _channelManager = new ChannelManager();
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
        this._serviceManager.add(new PluginService(Backend.NAME));
        this._serviceManager.add(new XvfbService());
        this._serviceManager.add(new PulseAudioService());
        this._serviceManager.add(new PuppeteerService());
        this._serviceManager.add(new PactlService());
        this._serviceManager.add(new FfmpegService());
        this._serviceManager.add(new HttpService(RouteLoader));
        this._serviceManager.add(new DLNAService());
    }
    getChannelManager() {
        return this._channelManager;
    }
}
//# sourceMappingURL=Backend.js.map