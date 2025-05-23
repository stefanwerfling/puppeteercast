import { DirHelper, Logger, ServiceAbstract, ServiceImportance, ServiceStatus, StringHelper } from 'figtree';
import { spawn } from 'child_process';
export class XvfbService extends ServiceAbstract {
    static NAME = 'xvfb';
    _importance = ServiceImportance.Important;
    _xvfb = null;
    constructor() {
        super(XvfbService.NAME);
    }
    async _hideCursor() {
        const unclutter = spawn('unclutter', ['-idle', '1', '-root'], {
            env: {
                DISPLAY: ':99'
            }
        });
        unclutter.on('error', (err) => {
            console.error('unclutter error:', err);
        });
    }
    async start() {
        this._inProcess = true;
        this._status = ServiceStatus.Progress;
        try {
            if (!await DirHelper.directoryExist('/tmp/.X11-unix')) {
                await DirHelper.mkdir('/tmp/.X11-unix', true);
            }
            this._xvfb = spawn('Xvfb', [':99', '-screen', '0', '1280x720x24'], { stdio: ['ignore', 'pipe', 'pipe'] });
            if (this._xvfb !== null) {
                if (this._xvfb.stdout !== null) {
                    this._xvfb.stdout.on('data', (data) => {
                        Logger.getLogger().info(`XvfbService [Xvfb stdout]: ${data.toString().trim()}`);
                    });
                }
                if (this._xvfb.stderr !== null) {
                    this._xvfb.stderr.on('data', (data) => {
                        Logger.getLogger().error(`XvfbService [Xvfb stderr]: ${data.toString().trim()}`);
                    });
                }
                this._xvfb.on('close', (code) => {
                    Logger.getLogger().warn(`XvfbService: Xvfb process exited with code ${code}`);
                });
                await new Promise(resolve => {
                    setTimeout(resolve, 10000);
                });
                await this._hideCursor();
            }
        }
        catch (error) {
            this._status = ServiceStatus.Error;
            this._inProcess = false;
            this._statusMsg = StringHelper.sprintf('XvfbService::start: Error while create the Xvfb: %e', error);
            Logger.getLogger().error(this._statusMsg);
            throw error;
        }
        this._statusMsg = '';
        this._status = ServiceStatus.Success;
        this._inProcess = false;
    }
}
//# sourceMappingURL=XvfbService.js.map