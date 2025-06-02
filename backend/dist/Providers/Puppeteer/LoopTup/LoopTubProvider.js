import { Logger, StringHelper } from 'figtree';
import { PuppeteerProviders } from '../PuppeteerProviders.js';
export class LoopTubProvider {
    static NAME = 'puppeteer_looptub';
    static TITLE = 'Puppeteer LoopTub';
    getName() {
        return LoopTubProvider.NAME;
    }
    getTitle() {
        return LoopTubProvider.TITLE;
    }
    getType() {
        return PuppeteerProviders.TYPE;
    }
    async call(page, channel) {
        await page.getPage().goto(`https://looptube.io/?videoId=${channel.id}`, { waitUntil: 'networkidle2' });
        try {
            const frameHandle = await page.getPage().waitForSelector('iframe#player');
            if (frameHandle === null) {
                throw new Error('Frame handle with id="player" not found!');
            }
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
        }
        catch (e) {
            const error = StringHelper.sprintf('Video can not start: %e', e);
            Logger.getLogger().error(error);
            return false;
        }
        return true;
    }
    getProviderEntry() {
        return {
            name: LoopTubProvider.NAME,
            title: LoopTubProvider.TITLE
        };
    }
}
//# sourceMappingURL=LoopTubProvider.js.map