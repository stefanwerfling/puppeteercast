import {Logger, ServiceAbstract, ServiceImportance, ServiceStatus, StringHelper} from 'figtree';
import {HDHomeRun} from '../HDHomeRun/HDHomeRun.js';
import {FfmpegService} from './FfmpegService.js';

/**
 * HD Home Run Service
 */
export class HDHomeRunService extends ServiceAbstract {

    /**
     * Service Name
     */
    public static NAME = 'hdhomerun';

    /**
     * Importance
     */
    protected readonly _importance: ServiceImportance = ServiceImportance.Important;

    /**
     * HD Home run
     * @protected
     */
    protected _hdhomerun: HDHomeRun;

    /**
     * Constructor
     */
    public constructor() {
        super(HDHomeRunService.NAME, [FfmpegService.NAME]);
        this._hdhomerun = new HDHomeRun();
    }

    /**
     * Start the service
     */
    public override async start(): Promise<void> {
        this._inProcess = true;
        this._status = ServiceStatus.Progress;

        try {
            await this._hdhomerun.start();
        } catch(error) {
            this._status = ServiceStatus.Error;
            this._inProcess = false;

            this._statusMsg = StringHelper.sprintf(
                'HDHomeRunService::start: Error while create the HDHomeRun: %e',
                error
            );

            Logger.getLogger().error(this._statusMsg);

            throw error;
        }

        this._statusMsg = '';
        this._status = ServiceStatus.Success;
        this._inProcess = false;
    }

}