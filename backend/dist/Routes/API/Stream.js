import { DefaultRoute, ServiceStatus } from 'figtree';
import { Backend } from '../../Application/Backend.js';
import { FfmpegService } from '../../Service/FfmpegService.js';
export class Stream extends DefaultRoute {
    getExpressRouter() {
        this._get('/stream', false, async (req, res) => {
            const backend = Backend.getInstance(Backend.NAME);
            if (backend) {
                const service = backend.getServiceList().getByName(FfmpegService.NAME);
                if (service) {
                    if (service.getStatus() === ServiceStatus.Success) {
                        const ffmpegProcess = service.getFfmpegProcess();
                        if (ffmpegProcess && ffmpegProcess.stdout) {
                            res.writeHead(200, {
                                'Content-Type': 'video/mp2t',
                                'Connection': 'close'
                            });
                            ffmpegProcess.stdout.pipe(res);
                        }
                    }
                }
            }
            res.status(500).send('Error stream not ready!');
        }, {
            description: 'Current browser stream'
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=Stream.js.map