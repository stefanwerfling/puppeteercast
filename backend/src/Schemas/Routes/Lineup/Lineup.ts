import {ExtractSchemaResultType, Vts} from 'vts';

export const SchemaLinupEntry = Vts.object({
    GuideNumber: Vts.string(),
    GuideName: Vts.string(),
    URL: Vts.string(),
    HD: Vts.boolean(),
    Favorite: Vts.boolean()
});

export type LinupEntry =  ExtractSchemaResultType<typeof SchemaLinupEntry>;

export const SchemaLineupResponse = Vts.array(SchemaLinupEntry);

export type LineupResponse =  ExtractSchemaResultType<typeof SchemaLineupResponse>;