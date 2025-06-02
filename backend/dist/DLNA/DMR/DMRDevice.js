import { DefaultRoute } from 'figtree';
export class DMRDevice extends DefaultRoute {
    _uuid;
    constructor(uuid) {
        super();
        this._uuid = uuid;
    }
    static _createServerList() {
        return [
            '<serviceList>',
            '    <service>',
            '        <serviceType>urn:schemas-upnp-org:service:RenderingControl:1</serviceType>',
            '        <serviceId>urn:upnp-org:serviceId:RenderingControl</serviceId>',
            '        <controlURL>/dmr/RenderingControl/control</controlURL>',
            '        <eventSubURL>/dmr/RenderingControl/event</eventSubURL>',
            '        <SCPDURL>/dmr/RenderingControl/desc.xml</SCPDURL>',
            '    </service>',
            '    <service>',
            '        <serviceType>urn:schemas-upnp-org:service:AVTransport:1</serviceType>',
            '        <serviceId>urn:upnp-org:serviceId:AVTransport</serviceId>',
            '        <controlURL>/dmr/AVTransport/control</controlURL>',
            '        <eventSubURL>/dmr/AVTransport/event</eventSubURL>',
            '        <SCPDURL>/dmr/AVTransport/desc.xml</SCPDURL>',
            '    </service>',
            '</serviceList>'
        ];
    }
    getExpressRouter() {
        this._get('/dmr/device.xml', false, async (request, response) => {
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
                '    <deviceType>urn:schemas-upnp-org:device:MediaRenderer:1</deviceType>',
                '    <friendlyName>PuppeteerCast MediaRenderer</friendlyName>',
                '    <manufacturer>PuppeteerCast</manufacturer>',
                '    <modelName>PuppeteerCast</modelName>',
                '    <modelNumber>V-1</modelNumber>',
                '    <serialNumber>12345678</serialNumber>',
                `    <UDN>uuid:${this._uuid}</UDN>`,
                ...DMRDevice._createServerList(),
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
//# sourceMappingURL=DMRDevice.js.map