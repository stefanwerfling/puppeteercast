import { DefaultRoute } from 'figtree';
export class Device extends DefaultRoute {
    _uuid;
    constructor(uuid) {
        super();
        this._uuid = uuid;
    }
    getExpressRouter() {
        this._get('/device.xml', false, async (request, response) => {
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
                '    <friendlyName>HDHomeRun Emulator</friendlyName>',
                '    <manufacturer>Silicondust</manufacturer>',
                '    <modelName>HDHomeRun</modelName>',
                '    <modelNumber>HDTC-2US</modelNumber>',
                '    <serialNumber>12345678</serialNumber>',
                `    <UDN>uuid:${this._uuid}</UDN>`,
                '  </device>',
                '</root>'
            ].join('\r\n');
            response.set('Content-Type', 'application/xml');
            response.send(xml);
        }, {
            description: 'HDHomeRun device.xml'
        });
        return super.getExpressRouter();
    }
}
//# sourceMappingURL=Device.js.map