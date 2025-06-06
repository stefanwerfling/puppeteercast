import {Router} from 'express';
import {DefaultRoute} from 'figtree';

export class Device extends DefaultRoute {

    protected _uuid: string;

    public constructor(uuid: string) {
        super();
        this._uuid = uuid;
    }

    public getExpressRouter(): Router {
        this._get(
            '/dms/device.xml',
            false,
            async(request, response): Promise<void> => {
                const baseUrl = `${request.protocol}://${request.hostname}:5004`;
                const xml = [
                    '<?xml version="1.0" encoding="UTF-8"?>',
                    '<root xmlns="urn:schemas-upnp-org:device-1-0">',
                    '  <specVersion>',
                    '    <major>1</major>',
                    '    <minor>0</minor>',
                    '  </specVersion>',
                    `  <URLBase>${baseUrl}/</URLBase>`,
                    '  <device>',
                    '    <deviceType>urn:schemas-upnp-org:device:MediaServer:1</deviceType>',
                    '    <friendlyName>PuppeteerCast MediaServer</friendlyName>',
                    '    <manufacturer>PuppeteerCast</manufacturer>',
                    '    <modelName>PuppeteerCast</modelName>',
                    '    <modelNumber>V-1</modelNumber>',
                    '    <serialNumber>12345678</serialNumber>',
                    `    <UDN>uuid:${this._uuid}</UDN>`,
                    '  </device>',
                    '</root>'
                ].join('\r\n');

                response.set('Content-Type', 'application/xml');
                response.send(xml);
            },
            {
                description: 'DLNA device.xml'
            }
        );

        return super.getExpressRouter();
    }

}