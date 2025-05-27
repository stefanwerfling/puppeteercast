import {ExtractSchemaResultType, Vts} from 'vts';

export const SchemaStreamRequestPath = Vts.object({
    channel: Vts.string({description: '[Channel ID].ts'})
}, {description: 'Path parameter'});

export type StreamRequestPath = ExtractSchemaResultType<typeof SchemaStreamRequestPath>;