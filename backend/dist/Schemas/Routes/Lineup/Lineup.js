import { Vts } from 'vts';
export const SchemaLinupEntry = Vts.object({
    GuideNumber: Vts.string(),
    GuideName: Vts.string(),
    URL: Vts.string(),
    HD: Vts.boolean(),
    Favorite: Vts.boolean()
});
export const SchemaLineupResponse = Vts.array(SchemaLinupEntry);
//# sourceMappingURL=Lineup.js.map