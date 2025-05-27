import {Router} from 'express';
import {DefaultRoute, Logger, ServiceStatus} from 'figtree';
import {Backend} from '../../Application/Backend.js';
import {SchemaStreamRequestPath} from '../../Schemas/Routes/Stream/Stream.js';
import {FfmpegService} from '../../Service/FfmpegService.js';

export class Stream extends DefaultRoute {

    /**
     * Return the express router
     * @returns {Router}
     */
    public getExpressRouter(): Router {
        this._get(
            '/stream/:channel.ts',
            false,
            async(
                req,
                res,
                data
            ): Promise<void> => {
                if (data.params) {
                    Logger.getLogger().info(`Channel run: ${data.params.channel}`);
                }

                const backend = Backend.getInstance(Backend.NAME);

                if (backend) {
                    const service = backend.getServiceList().getByName(FfmpegService.NAME);

                    if (service) {
                        if (service.getStatus() === ServiceStatus.Success) {
                            const broadcast = (service as FfmpegService).getBroadcastStream();
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
            },
            {
                description: 'Current browser stream',
                pathSchema: SchemaStreamRequestPath
            }
        );

        return super.getExpressRouter();
    }

}