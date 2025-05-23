import { Logger, ServiceStatus, StatusCodes, StringHelper } from 'figtree';
import { Backend } from '../../../Application/Backend.js';
import { PuppeteerService } from '../../../Service/PuppeteerService.js';
export class PlayLoopTub {
    static async playMovie(param) {
        const backend = Backend.getInstance(Backend.NAME);
        if (backend) {
            const service = backend.getServiceList().getByName(PuppeteerService.NAME);
            if (service) {
                if (service.getStatus() === ServiceStatus.Success) {
                    const page = service.getPage();
                    if (page) {
                        await page.goto(`https://looptube.io/?videoId=${param.videoid}`, { waitUntil: 'networkidle2' });
                        try {
                            await page.evaluate(() => {
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
                                    const video = document.querySelector('video');
                                    if (video) {
                                        video.play();
                                    }
                                    const fullscreenButton = document.querySelector('.ytp-fullscreen-button');
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
                        }
                        catch (e) {
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
//# sourceMappingURL=PlayLoopTub.js.map