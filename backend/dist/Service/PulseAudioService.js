import { spawn } from 'child_process';
import { DirHelper, FileHelper, Logger, ServiceAbstract, ServiceImportance, ServiceStatus, StringHelper } from 'figtree';
import { homedir } from 'os';
import path from 'path';
export class PulseAudioService extends ServiceAbstract {
    static NAME = 'pulseaudio';
    static APP_RUNTIME_PATH = '/tmp/pulse';
    _importance = ServiceImportance.Important;
    _pulseAudio = null;
    constructor() {
        super(PulseAudioService.NAME);
    }
    async _cleanPulseRuntime(appRuntimePath) {
        if (await DirHelper.directoryExist(appRuntimePath)) {
            const files = await DirHelper.getFiles(appRuntimePath);
            for await (const file of files) {
                await FileHelper.fileDelete(path.join(appRuntimePath, file));
            }
        }
    }
    async start() {
        this._inProcess = true;
        this._status = ServiceStatus.Progress;
        try {
            const pulsePath = path.join(homedir(), '.config', 'pulse');
            const pulseRuntimePath = PulseAudioService.APP_RUNTIME_PATH;
            await this._cleanPulseRuntime(pulseRuntimePath);
            if (!await DirHelper.directoryExist(pulseRuntimePath)) {
                await DirHelper.mkdir(pulseRuntimePath, true);
            }
            if (!await DirHelper.directoryExist(pulsePath)) {
                await DirHelper.mkdir(pulsePath, true);
            }
            this._pulseAudio = spawn('pulseaudio', [
                '--start',
                '--daemonize=no',
                '--system=false',
                '--disallow-exit',
                '--exit-idle-time=-1',
                '--log-level=info'
            ], {
                env: {
                    PULSE_RUNTIME_PATH: pulseRuntimePath,
                    PULSE_NO_CONFIG: '1',
                    PULSE_NO_MODULE_INIT: '1'
                },
                stdio: ['ignore', 'pipe', 'pipe']
            });
            if (this._pulseAudio !== null) {
                if (this._pulseAudio.stdout !== null) {
                    this._pulseAudio.stdout.on('data', (data) => {
                        Logger.getLogger().info(`PulseAudioService [PulseAudio stdout]: ${data.toString().trim()}`);
                    });
                }
                if (this._pulseAudio.stderr !== null) {
                    this._pulseAudio.stderr.on('data', (data) => {
                        Logger.getLogger().error(`PulseAudioService [PulseAudio stderr]: ${data.toString().trim()}`);
                    });
                }
                this._pulseAudio.on('close', (code) => {
                    Logger.getLogger().warn(`PulseAudioService: PulseAudio process exited with code ${code}`);
                });
            }
            await new Promise(resolve => {
                setTimeout(resolve, 10000);
            });
        }
        catch (error) {
            this._status = ServiceStatus.Error;
            this._inProcess = false;
            this._statusMsg = StringHelper.sprintf('PulseAudioService::start: Error while create the PulseAudio: %e', error);
            Logger.getLogger().error(this._statusMsg);
            throw error;
        }
        this._statusMsg = '';
        this._status = ServiceStatus.Success;
        this._inProcess = false;
    }
}
//# sourceMappingURL=PulseAudioService.js.map