import { Logger, ServiceAbstract, ServiceImportance, ServiceStatus, StringHelper } from 'figtree';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { PulseAudioService } from './PulseAudioService.js';
const execAsync = promisify(exec);
export class PactlService extends ServiceAbstract {
    static NAME = 'pactl';
    _importance = ServiceImportance.Important;
    _isPactlLoad = false;
    constructor() {
        super(PactlService.NAME, [PulseAudioService.NAME]);
    }
    async start() {
        this._inProcess = true;
        this._status = ServiceStatus.Progress;
        this._isPactlLoad = false;
        try {
            const { stdout } = await execAsync('pactl list short sources', {
                env: {
                    PULSE_RUNTIME_PATH: PulseAudioService.APP_RUNTIME_PATH
                }
            });
            if (stdout.includes('stream_sink.monitor')) {
                this._isPactlLoad = true;
            }
            else {
                const pactl = spawn('pactl', [
                    'load-module',
                    'module-null-sink',
                    'sink_name=stream_sink',
                    'sink_properties=device.description=StreamSink'
                ], {
                    env: {
                        PULSE_RUNTIME_PATH: PulseAudioService.APP_RUNTIME_PATH
                    }
                });
                pactl.stdout.on('data', (data) => {
                    Logger.getLogger().info(`PactlService [Pactl stdout]: ${data.toString().trim()}`);
                });
                pactl.stderr.on('data', (data) => {
                    Logger.getLogger().error(`PactlService [Pactl stderr]: ${data.toString().trim()}`);
                });
                await new Promise((resolve) => {
                    pactl.on('close', (code) => {
                        if (code === 0) {
                            this._isPactlLoad = true;
                        }
                        Logger.getLogger().warn(`PactlService: Pactl process exited with code ${code}`);
                        resolve();
                    });
                });
            }
        }
        catch (error) {
            this._status = ServiceStatus.Error;
            this._inProcess = false;
            this._statusMsg = StringHelper.sprintf('PactlService::start: Error while create the Pactl: %e', error);
            Logger.getLogger().error(this._statusMsg);
            throw error;
        }
        this._statusMsg = '';
        this._status = ServiceStatus.Success;
        this._inProcess = false;
    }
}
//# sourceMappingURL=PactlService.js.map