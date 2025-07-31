import { SpTblFinishInWardOutWard } from "../entity/anushreeDb/spTblFinishInWardOutWard.entity";
import { PurchasePipeLine } from "../entity/phoenixDb/purchasePipeLine.entity";
import { AppDataSource } from "../providers/data-source.provider";
import { Filters } from "../types/filter.types";
export declare class PurchaseParcelStatusService {
    private dataSourceInstance;
    private inwardOutWardProvider;
    private purchasePileLineProvider;
    constructor(dataSourceInstance: AppDataSource);
    initialize(): Promise<void>;
    getEntriesByFilter(conum: string, fdat: string, tdat: string, accountId: string, filters?: Filters<SpTblFinishInWardOutWard>, offset?: number, limit?: number): Promise<any[]>;
    GetEntrybyId(conum: string, fdat: string, tdat: string, accountId: string, purTrnId: number): Promise<SpTblFinishInWardOutWard | null>;
    InsetEntry(data: Partial<PurchasePipeLine>): Promise<PurchasePipeLine>;
    UpdateEntry(PurTrnId: number, data: Partial<PurchasePipeLine>): Promise<PurchasePipeLine | null>;
}
