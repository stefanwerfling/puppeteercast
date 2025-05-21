import {ChildProcess, spawn} from 'child_process';
import {DirHelper, Logger, ServiceAbstract, ServiceImportance, ServiceStatus, StringHelper} from 'figtree';
import { homedir } from 'os';
import path from 'path';

/**
 * PulseAudio - Service
 */
export class PulseAudioService extends ServiceAbstract {

    /**
     * Service Name
     */
    public static NAME = 'pulseaudio';

    /**
     * App runtime path
     */
    public static APP_RUNTIME_PATH = '/tmp/pulse';

    /**
     * Importance
     */
    protected readonly _importance: ServiceImportance = ServiceImportance.Important;

    /**
     * PulseAudio Process
     * @protected
     */
    protected _pulseAudio: ChildProcess|null = null;

    /**
     * Constructor
     */
    public constructor() {
        super(PulseAudioService.NAME);
    }

    /**
     * Start the service
     */
    public override async start(): Promise<void> {
        this._inProcess = true;
        this._status = ServiceStatus.Progress;

        try {
            const pulsePath = path.join(homedir(), '.config', 'pulse');

            if (!await DirHelper.directoryExist(PulseAudioService.APP_RUNTIME_PATH)) {
                await DirHelper.mkdir(PulseAudioService.APP_RUNTIME_PATH, true);
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
                    PULSE_RUNTIME_PATH: PulseAudioService.APP_RUNTIME_PATH,
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

            // wait short pulsaudio is ready
            await new Promise(resolve => {
                setTimeout(resolve, 10000);
            });
        } catch(error) {
            this._status = ServiceStatus.Error;
            this._inProcess = false;

            this._statusMsg = StringHelper.sprintf(
                'PulseAudioService::start: Error while create the PulseAudio: %e',
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