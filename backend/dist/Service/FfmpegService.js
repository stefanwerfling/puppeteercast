import { spawn } from 'child_process';
import { Logger, ServiceAbstract, ServiceImportance, ServiceStatus, StringHelper } from 'figtree';
import { BufferedStream } from '../Stream/BufferedStream.js';
import { PactlService } from './PactlService.js';
import { PulseAudioService } from './PulseAudioService.js';
export class FfmpegService extends ServiceAbstract {
    static NAME = 'ffmpeg';
    _importance = ServiceImportance.Important;
    _ffmpeg = null;
    _boradcast = new BufferedStream(300);
    constructor() {
        super(FfmpegService.NAME, [PactlService.NAME]);
    }
    async start() {
        this._inProcess = true;
        this._status = ServiceStatus.Progress;
        try {
            this._ffmpeg = spawn('ffmpeg', [
                '-thread_queue_size', '64',
                '-f', 'x11grab',
                '-r', '30',
                '-s', '1280x720',
                '-i', ':99',
                '-f', 'pulse',
                '-i', 'stream_sink.monitor',
                '-fflags', '+genpts',
                '-use_wallclock_as_timestamps', '1',
                '-pix_fmt', 'yuv420p',
                '-c:v', 'libx264',
                '-preset', 'superfast',
                '-tune', 'zerolatency',
                '-profile:v', 'baseline',
                '-level:v', '3.1',
                '-g', '60',
                '-keyint_min', '60',
                '-sc_threshold', '0',
                '-c:a', 'aac',
                '-b:a', '128k',
                '-ar', '44100',
                '-mpegts_flags', '+resend_headers+initial_discontinuity',
                '-f', 'mpegts',
                'pipe:1'
            ], {
                env: {
                    PULSE_SERVER: `${PulseAudioService.APP_RUNTIME_PATH}/native`
                }
            });
            if (this._ffmpeg !== null) {
                if (this._ffmpeg.stdout !== null) {
                    this._ffmpeg.stdout.pipe(this._boradcast);
                    this._ffmpeg.stdout.on('data', (data) => {
                    });
                }
                if (this._ffmpeg.stderr !== null) {
                    this._ffmpeg.stderr.on('data', (data) => {
                        Logger.getLogger().error(`FfmpegService [Ffmpeg stderr]: ${data.toString().trim()}`);
                    });
                }
                this._ffmpeg.on('close', (code) => {
                    Logger.getLogger().warn(`FfmpegService: Ffmpeg process exited with code ${code}`);
                });
            }
        }
        catch (error) {
            this._status = ServiceStatus.Error;
            this._inProcess = false;
            this._statusMsg = StringHelper.sprintf('FfmpegService::start: Error while create the ffmpeg: %e', error);
            Logger.getLogger().error(this._statusMsg);
            throw error;
        }
        this._statusMsg = '';
        this._status = ServiceStatus.Success;
        this._inProcess = false;
    }
    getFfmpegProcess() {
        return this._ffmpeg;
    }
    getBroadcastStream() {
        return this._boradcast;
    }
}
//# sourceMappingURL=FfmpegService.js.map