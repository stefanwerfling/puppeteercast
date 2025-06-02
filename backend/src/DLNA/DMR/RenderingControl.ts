import {Router} from 'express';
import {DefaultRoute} from 'figtree';

export class RenderingControl extends DefaultRoute {

    protected static _createDescXml(): string[] {
        return [
            '<?xml version="1.0"?>\n' +
            '<scpd xmlns="urn:schemas-upnp-org:service-1-0">\n' +
            '  <specVersion>\n' +
            '    <major>1</major>\n' +
            '    <minor>0</minor>\n' +
            '  </specVersion>\n' +
            '  <actionList>\n' +
            '    <action>\n' +
            '      <name>SetVolume</name>\n' +
            '      <argumentList>\n' +
            '        <argument>\n' +
            '          <name>InstanceID</name>\n' +
            '          <direction>in</direction>\n' +
            '          <relatedStateVariable>A_ARG_TYPE_InstanceID</relatedStateVariable>\n' +
            '        </argument>\n' +
            '        <argument>\n' +
            '          <name>Channel</name>\n' +
            '          <direction>in</direction>\n' +
            '          <relatedStateVariable>A_ARG_TYPE_Channel</relatedStateVariable>\n' +
            '        </argument>\n' +
            '        <argument>\n' +
            '          <name>DesiredVolume</name>\n' +
            '          <direction>in</direction>\n' +
            '          <relatedStateVariable>Volume</relatedStateVariable>\n' +
            '        </argument>\n' +
            '      </argumentList>\n' +
            '    </action>\n' +
            '  </actionList>\n' +
            '  <serviceStateTable>\n' +
            '    <stateVariable sendEvents="no">\n' +
            '      <name>A_ARG_TYPE_InstanceID</name>\n' +
            '      <dataType>ui4</dataType>\n' +
            '    </stateVariable>\n' +
            '    <stateVariable sendEvents="no">\n' +
            '      <name>A_ARG_TYPE_Channel</name>\n' +
            '      <dataType>string</dataType>\n' +
            '      <allowedValueList>\n' +
            '        <allowedValue>Master</allowedValue>\n' +
            '      </allowedValueList>\n' +
            '    </stateVariable>\n' +
            '    <stateVariable sendEvents="no">\n' +
            '      <name>Volume</name>\n' +
            '      <dataType>ui2</dataType>\n' +
            '    </stateVariable>\n' +
            '  </serviceStateTable>\n' +
            '</scpd>'
        ];
    }

    public getExpressRouter(): Router {
        this._get(
            '/dmr/RenderingControl/desc.xml',
            false,
            async(request, response): Promise<void> => {
                response.set('Content-Type', 'text/xml');
                response.send(RenderingControl._createDescXml().join());
            },
            {
                description: 'DLNA Media Render - RenderingControl desc.xml'
            }
        );

        return super.getExpressRouter();
    }

}