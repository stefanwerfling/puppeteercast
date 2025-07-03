import { DefaultRoute, SchemaDefaultReturn, ServiceStatus, StatusCodes } from 'figtree';
import { Backend } from '../../Application/Backend.js';
import { PuppeteerService } from '../../Service/PuppeteerService.js';
export class Youtube extends DefaultRoute {
    getExpressRouter() {
        this._get('/youtube/textcodelogin', false, async (req, res, data) => {
            const backend = Backend.getInstance(Backend.NAME);
            if (backend) {
                const service = backend.getServiceManager().getByName(PuppeteerService.NAME);
                if (service) {
                    if (service.getStatus() === ServiceStatus.Success) {
                        const page = service.getPage();
                        if (page) {
                            await page.setUserAgent('Mozilla/5.0 (Linux; Android 9; SHIELD Android TV Build/PPR1.180610.011; wv) ' +
                                'AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.157 Safari/537.36');
                            await page.getPage().goto('https://www.youtube.com/tv', { waitUntil: 'networkidle2' });
                            await page.getPage().waitForSelector('ytlr-button', { timeout: 10000 });
                            await page.getPage().focus('ytlr-button');
                            await page.getPage().keyboard.press('Enter');
                            return {
                                statusCode: StatusCodes.OK
                            };
                        }
                    }
                }
            }
            return {
                statusCode: StatusCodes.INTERNAL_ERROR,
                msg: 'Error'
            };
        }, {
            description: 'Start youtube textcode login',
            tags: ['youtube'],
            responseBodySchema: SchemaDefaultReturn
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=Youtube.js.map