import {Logger, ServiceAbstract, ServiceImportance, ServiceStatus, StringHelper} from 'figtree';
import {DLNA} from '../DLNA/DLNA.js';
import {FfmpegService} from './FfmpegService.js';

/**
 * DLNA Service
 */
export class DLNAService extends ServiceAbstract {

    /**
     * Service Name
     */
    public static NAME = 'dlna';

    /**
     * Importance
     */
    protected readonly _importance: ServiceImportance = ServiceImportance.Important;

    /**
     * DLNA
     * @protected
     */
    protected _dlna: DLNA;

    /**
     * Constructor
     */
    public constructor() {
        super(DLNAService.NAME, [FfmpegService.NAME]);
        this._dlna = new DLNA();
    }

    /**
     * Start the service
     */
    public override async start(): Promise<void> {
        this._inProcess = true;
        this._status = ServiceStatus.Progress;

        try {
            await this._dlna.start();
        } catch(error) {
            this._status = ServiceStatus.Error;
            this._inProcess = false;

            this._statusMsg = StringHelper.sprintf(
                'DLNAService::start: Error while create the DLNA: %e',
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