import {Logger, ProviderEntry, StringHelper} from 'figtree';
import {Channel} from '../../../Channels/Channel.js';
import {PuppeteerCastPage} from '../../../Puppeteer/PuppeteerCastPage.js';
import {IPuppeteerProvider} from '../IPuppeteerProvider.js';
import {PuppeteerProviders} from '../PuppeteerProviders.js';

/**
 * LoopTub Provider
 */
export class LoopTubProvider implements IPuppeteerProvider {

    /**
     * NAME of Provider
     */
    public static NAME = 'puppeteer_looptub';

    /**
     * TITLE of Provider
     */
    public static TITLE = 'Puppeteer LoopTub';

    /**
     * Return the keyname for provider as ident.
     * @returns {string}
     */
    public getName(): string {
        return LoopTubProvider.NAME;
    }

    /**
     * Return the title for provider (for frontend).
     * @returns {string}
     */
    public getTitle(): string {
        return LoopTubProvider.TITLE;
    }

    /**
     * Return the type of provider
     * @returns {string}
     */
    public getType(): string {
        return PuppeteerProviders.TYPE;
    }

    /**
     * Call puppeteer
     * @param {PuppeteerCastPage} page
     * @param {Channel} channel
     */
    public async call(
        page: PuppeteerCastPage,
        channel: Channel
    ): Promise<boolean> {
        await page.getPage().goto(`https://looptube.io/?videoId=${channel.id}`, {waitUntil: 'networkidle2'});

        try {
            const frameHandle = await page.getPage().waitForSelector('iframe#player');

            if (frameHandle === null) {
                throw new Error('Frame handle with id="player" not found!');
            }

            const frame = await frameHandle.contentFrame();

            if (!frame) {
                throw new Error('No iframe found!');
            }

            page.selectorWaiter(frame, '.html5-video-player').then(async() => {
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
            });
        } catch (e) {
            const error = StringHelper.sprintf('Video can not start: %e', e);

            Logger.getLogger().error(error);
            return false;
        }

        return true;
    }

    public getProviderEntry(): ProviderEntry {
        return {
            name: LoopTubProvider.NAME,
            title: LoopTubProvider.TITLE
        };
    }

}