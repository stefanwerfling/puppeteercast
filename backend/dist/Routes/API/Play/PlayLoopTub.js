import { Logger, ServiceStatus, StatusCodes, StringHelper } from 'figtree';
import { Backend } from '../../../Application/Backend.js';
import { PuppeteerService } from '../../../Service/PuppeteerService.js';
export class PlayLoopTub {
    static async playMovie(param) {
        const backend = Backend.getInstance(Backend.NAME);
        if (backend) {
            const service = backend.getServiceManager().getByName(PuppeteerService.NAME);
            if (service) {
                if (service.getStatus() === ServiceStatus.Success) {
                    const page = service.getPage();
                    if (page) {
                        await page.getPage().goto('https://www.youtubeunblocked.live/', {
                            waitUntil: 'networkidle2',
                        });
                        try {
                            await page.getPage().waitForSelector('button', {
                                visible: true,
                                timeout: 5000,
                            });
                            const buttons = await page.getPage().$$('button');
                            for (const button of buttons) {
                                const text = await page.getPage().evaluate(el => el.textContent, button);
                                if (text?.toLowerCase().includes('consent') || text?.toLowerCase().includes('accept')) {
                                    await button.click();
                                    console.log('Consent-Button geklickt');
                                    break;
                                }
                            }
                            await new Promise(resolve => { setTimeout(resolve, 1000); });
                        }
                        catch (_e) {
                            console.log(_e);
                            console.log('Kein Consent-Button gefunden – vermutlich nicht nötig.');
                        }
                        try {
                            await page.getPage().type('#url', `https://looptube.io/?videoId=${param.videoid}`, { delay: 50 });
                            await Promise.all([
                                page.getPage().waitForNavigation({ waitUntil: 'networkidle2' }),
                                page.getPage().click('#requestSubmit'),
                            ]);
                            await page.getPage().evaluate(() => {
                                document.body.style.cursor = 'none';
                            });
                            const frameHandle = await page.getPage().waitForSelector('iframe#player');
                            if (frameHandle) {
                                const frame = await frameHandle.contentFrame();
                                if (!frame) {
                                    throw new Error('No iframe found!');
                                }
                                page.selectorWaiter(frame, '.html5-video-player').then(async () => {
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