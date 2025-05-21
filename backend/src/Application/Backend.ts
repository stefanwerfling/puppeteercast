import {BackendApp, ConfigOptions, DefaultArgs, Config, SchemaDefaultArgs, HttpService} from 'figtree';
import {Schema} from 'vts';
import {PuppeteerCastConfig} from '../Config/PuppeteerCastConfig.js';
import {RouteLoader} from '../Routes/RouteLoader.js';
import {FfmpegService} from '../Service/FfmpegService.js';
import {PactlService} from '../Service/PactlService.js';
import {PulseAudioService} from '../Service/PulseAudioService.js';
import {PuppeteerService} from '../Service/PuppeteerService.js';
import {XvfbService} from '../Service/XvfbService.js';

/**
 * Backend
 */
export class Backend extends BackendApp<DefaultArgs, ConfigOptions> {

    /**
     * Backend Name
     */
    public static NAME = 'puppeteercast';

    /**
     * Get config instacne
     * @return {Config}
     * @protected
     */
    protected _getConfigInstance(): Config<ConfigOptions> {
        const config = PuppeteerCastConfig.getInstance();
        config.setAppName(Backend.NAME);
        config.setAppTitle('PuppeteerCast');

        return config;
    }

    /**
     * Constructor
     */
    public constructor() {
        super(Backend.NAME);
    }

    /**
     * Get arg schema
     * @protected
     */
    protected _getArgSchema(): Schema<DefaultArgs>|null {
        return SchemaDefaultArgs;
    }

    /**
     * Init Services
     * @protected
     */
    protected async _initServices(): Promise<void> {
        this._serviceList.add(new XvfbService());
        this._serviceList.add(new PulseAudioService());
        this._serviceList.add(new PuppeteerService());
        this._serviceList.add(new PactlService());
        this._serviceList.add(new FfmpegService());
        this._serviceList.add(new HttpService(RouteLoader));
    }

}