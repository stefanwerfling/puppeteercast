import { DefaultRoute, Logger, ServiceStatus } from 'figtree';
import { Backend } from '../../Application/Backend.js';
import { SchemaStreamRequestPath } from '../../Schemas/Routes/Stream/Stream.js';
import { FfmpegService } from '../../Service/FfmpegService.js';
export class Stream extends DefaultRoute {
    getExpressRouter() {
        this._get('/stream/:channel.ts', false, async (req, res, data) => {
            const backend = Backend.getInstance(Backend.NAME);
            if (backend) {
                if (data.params) {
                    Logger.getLogger().info(`Channel run: ${data.params.channel}`);
                    backend.getChannelManager().callChannel(data.params.channel).then();
                }
                const service = backend.getServiceManager().getByName(FfmpegService.NAME);
                if (service) {
                    if (service.getStatus() === ServiceStatus.Success) {
                        const broadcast = service.getBroadcastStream();
                        const clientStream = broadcast.getReadableStream();
                        res.writeHead(200, {
                            'Content-Type': 'video/mp2t',
                            'Connection': 'keep-alive',
                            'Cache-Control': 'no-cache',
                        });
                        clientStream.pipe(res);
                        req.on('close', () => {
                            clientStream.unpipe(res);
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
            tags: ['stream'],
            pathSchema: SchemaStreamRequestPath
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=Stream.js.map