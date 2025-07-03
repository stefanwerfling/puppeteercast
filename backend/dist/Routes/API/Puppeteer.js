import { DefaultRoute, Logger, SchemaDefaultReturn, ServiceStatus, StatusCodes, StringHelper } from 'figtree';
import { Backend } from '../../Application/Backend.js';
import { SchemaPuppeteerSetCookieRequest } from '../../Schemas/Routes/Puppeteer/SetCookie.js';
import { PuppeteerService } from '../../Service/PuppeteerService.js';
export class Puppeteer extends DefaultRoute {
    getExpressRouter() {
        this._post('/puppeteer/setcookies', false, async (req, res, data) => {
            const backend = Backend.getInstance(Backend.NAME);
            if (backend) {
                const service = backend.getServiceManager().getByName(PuppeteerService.NAME);
                if (service) {
                    if (service.getStatus() === ServiceStatus.Success) {
                        const page = service.getPage();
                        if (page) {
                            try {
                                let cookies = JSON.parse(data.body.cookies_json_str);
                                if (Array.isArray(cookies)) {
                                    cookies = cookies.map((value) => {
                                        value.partitionKey = undefined;
                                        return value;
                                    });
                                }
                                await page.getPage().browserContext().setCookie(...cookies);
                                return {
                                    statusCode: StatusCodes.OK
                                };
                            }
                            catch (e) {
                                Logger.getLogger().error(StringHelper.sprintf('%e', e));
                                return {
                                    statusCode: StatusCodes.INTERNAL_ERROR,
                                    msg: 'Your raw cookies string has a wrong format'
                                };
                            }
                        }
                    }
                }
            }
            return {
                statusCode: StatusCodes.INTERNAL_ERROR,
                msg: 'Error'
            };
        }, {
            description: 'Puppeteer set cookies for a page',
            tags: ['puppeteer'],
            bodySchema: SchemaPuppeteerSetCookieRequest,
            responseBodySchema: SchemaDefaultReturn
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=Puppeteer.js.map