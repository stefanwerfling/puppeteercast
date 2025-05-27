import { Logger, ServiceAbstract, ServiceImportance, ServiceStatus, StringHelper } from 'figtree';
import { HDHomeRun } from '../HDHomeRun/HDHomeRun.js';
import { FfmpegService } from './FfmpegService.js';
export class HDHomeRunService extends ServiceAbstract {
    static NAME = 'hdhomerun';
    _importance = ServiceImportance.Important;
    _hdhomerun;
    constructor() {
        super(HDHomeRunService.NAME, [FfmpegService.NAME]);
        this._hdhomerun = new HDHomeRun();
    }
    async start() {
        this._inProcess = true;
        this._status = ServiceStatus.Progress;
        try {
            await this._hdhomerun.start();
        }
        catch (error) {
            this._status = ServiceStatus.Error;
            this._inProcess = false;
            this._statusMsg = StringHelper.sprintf('HDHomeRunService::start: Error while create the HDHomeRun: %e', error);
            Logger.getLogger().error(this._statusMsg);
            throw error;
        }
        this._statusMsg = '';
        this._status = ServiceStatus.Success;
        this._inProcess = false;
    }
}
//# sourceMappingURL=HDHomeRunService.js.map