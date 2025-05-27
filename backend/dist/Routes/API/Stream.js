import { DefaultRoute, Logger, ServiceStatus } from 'figtree';
import { PassThrough } from 'stream';
import { Backend } from '../../Application/Backend.js';
import { SchemaStreamRequestPath } from '../../Schemas/Routes/Stream/Stream.js';
import { FfmpegService } from '../../Service/FfmpegService.js';
export class Stream extends DefaultRoute {
    getExpressRouter() {
        this._get('/stream/:channel.ts', false, async (req, res, data) => {
            if (data.params) {
                Logger.getLogger().info(`Channel run: ${data.params.channel}`);
            }
            const backend = Backend.getInstance(Backend.NAME);
            if (backend) {
                const service = backend.getServiceList().getByName(FfmpegService.NAME);
                if (service) {
                    if (service.getStatus() === ServiceStatus.Success) {
                        const clientStream = new PassThrough();
                        const broadcast = service.getBroadcastStream();
                        broadcast.pipe(clientStream);
                        res.writeHead(200, {
                            'Content-Type': 'video/mp2t',
                            'Connection': 'keep-alive',
                            'Cache-Control': 'no-cache',
                        });
                        clientStream.pipe(res);
                        req.on('close', () => {
                            clientStream.unpipe(res);
                            clientStream.end();
                        });
                        return;
                    }
                }
            }
            res.writeHead(200, {
                'Content-Type': 'video/mp2t',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache',
            });
            res.end();
        }, {
            description: 'Current browser stream',
            pathSchema: SchemaStreamRequestPath
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=Stream.js.map