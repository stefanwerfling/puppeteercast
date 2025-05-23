import {DefaultReturn, Logger, ServiceStatus, StatusCodes, StringHelper} from 'figtree';
import {Backend} from '../../../Application/Backend.js';
import {PlayLoopTubPlayVideo} from '../../../Schemas/Routes/Play/PlayLoopTub.js';
import {PuppeteerService} from '../../../Service/PuppeteerService.js';

export class PlayLoopTub {

    public static async playMovie(param: PlayLoopTubPlayVideo): Promise<DefaultReturn> {
        const backend = Backend.getInstance(Backend.NAME);

        if (backend) {
            const service = backend.getServiceList().getByName(PuppeteerService.NAME);

            if (service) {
                if (service.getStatus() === ServiceStatus.Success) {
                    const page = (service as PuppeteerService).getPage();

                    if (page) {
                        await page.goto(`https://looptube.io/?videoId=${param.videoid}`, {waitUntil: 'networkidle2'});

                        try {
                            await page.evaluate(() => {
                                // eslint-disable-next-line no-undef
                                document.body.style.cursor = 'none';
                            });

                            const frameHandle = await page.waitForSelector('iframe');

                            if (frameHandle) {
                                const frame = await frameHandle.contentFrame();

                                if (!frame) {
                                    throw new Error('No iframe found!');
                                }

                                await frame.waitForSelector('.html5-video-player', { timeout: 15000 });

                                await frame.evaluate(() => {
                                    // eslint-disable-next-line no-undef
                                    const video = document.querySelector('video') as HTMLVideoElement;
                                    if (video) {
                                        video.play();
                                    }

                                    // eslint-disable-next-line no-undef
                                    const fullscreenButton = document.querySelector('.ytp-fullscreen-button');

                                    // eslint-disable-next-line no-undef
                                    if (fullscreenButton instanceof HTMLElement) {
                                        fullscreenButton.click();
                                    }
                                });

                                return {
                                    statusCode: StatusCodes.OK,
                                };
                            }

                            return {
                                statusCode: StatusCodes.INTERNAL_ERROR,
                                msg: 'iframe not found!'
                            };
                        } catch (e) {
                            const error = StringHelper.sprintf('Video can not start: %e', e);

                            Logger.getLogger().error(error);

                            return {
                                statusCode: StatusCodes.INTERNAL_ERROR,
                                msg: error
                            };
                        }
                    }
                }
            }
        }

        return {
            statusCode: StatusCodes.INTERNAL_ERROR,
            msg: 'Service or stream not ready!'
        };
    }

}