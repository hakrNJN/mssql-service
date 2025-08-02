//src/services/PurchaseInwardOutWard.service.ts

import { SpTblFinishInWardOutWard } from "../entity/anushreeDb/spTblFinishInWardOutWard.entity";
import { PurchasePipeLine } from "../entity/phoenixDb/purchasePipeLine.entity";
import { InWardOutWardProvider } from "../providers/inwardOutward.provider"; // This provider now handles the SP
import { PurchasePileLine as PurchasePileLineProvider } from "../providers/purchasePipeLine.provider";
import { Filters } from "../types/filter.types";

import { inject, injectable } from "tsyringe";

@injectable()
export class PurchaseParcelStatusService {
    private inwardOutWardProvider: InWardOutWardProvider;
    private purchasePileLineProvider: PurchasePileLineProvider;

    constructor(
        @inject(InWardOutWardProvider) inwardOutWardProvider: InWardOutWardProvider,
        @inject(PurchasePileLineProvider) purchasePileLineProvider: PurchasePileLineProvider
    ) {
        this.inwardOutWardProvider = inwardOutWardProvider;
        this.purchasePileLineProvider = purchasePileLineProvider;
        this.initialize();
    }

    private async initialize(): Promise<void> {
        await this.inwardOutWardProvider.initializeRepository();
        await this.purchasePileLineProvider.initializeRepository();
    }

    // Updated method signature to include SP parameters
    async getEntriesByFilter(
        conum: string,
        fdat: string,
        tdat: string,
        accountId: string,
        filters?: Filters<SpTblFinishInWardOutWard>,
        offset?: number,
        limit?: number
    ): Promise<any[]> {
        return this.inwardOutWardProvider.getEntriesByFilter(conum, fdat, tdat, accountId, filters, offset, limit);
    }

    // Updated method to get a single entry from the SP-generated data
    async GetEntrybyId(
        conum: string,
        fdat: string,
        tdat: string,
        accountId: string,
        purTrnId: number,
    ): Promise<SpTblFinishInWardOutWard | null> {
        // This now calls the specific method on InWardOutWardProvider
        return this.inwardOutWardProvider.getEntryByIdFromSPData(conum, fdat, tdat, accountId, purTrnId);
    }

    // The original `InsetEntry` and `UpdateEntry` are for `PurchasePipeLine` entity,
    // which does not depend on the SP. Keep them as is.
    async InsetEntry(data: Partial<PurchasePipeLine>): Promise<PurchasePipeLine> {
        return this.purchasePileLineProvider.create(data);
    }

    async UpdateEntry(PurTrnId: number, data: Partial<PurchasePipeLine>): Promise<PurchasePipeLine | null> {
        return this.purchasePileLineProvider.update(PurTrnId, data);
    }
}

// //src/services/PurchaseInwardOutWard.service.ts

// import { SpTblFinishInWardOutWard } from "../entity/anushree/SpTblFinishInWardOutWard.entity";
// import { PurchasePipeLine } from "../entity/phoenix/PurchasePipeLine"; // Import PurchasePipeLine Entity
// 
// import { InWardOutWardProvider } from "../providers/inwardOutward.provider";
// import { PurchasePileLine as PurchasePileLineProvider } from "../providers/purchasePipeLine.provider"; // Import the aliased provider
// import { Filters } from "../types/filter.types";

// export class PurchaseParcelStatusService {
//     private inwardOutWardProvider: InWardOutWardProvider; // Renamed for clarity
//     private purchasePileLineProvider: PurchasePileLineProvider; // Added new provider

//     constructor(private dataSourceInstance: AppDataSource) {
//         this.inwardOutWardProvider = new InWardOutWardProvider(this.dataSourceInstance);
//         this.purchasePileLineProvider = new PurchasePileLineProvider(this.dataSourceInstance); // Initialize new provider
//     }

//     async initialize(): Promise<void> {
//         await this.inwardOutWardProvider.initializeRepository();
//         await this.purchasePileLineProvider.initializeRepository(); // Initialize the new provider's repository
//     }

//     // New/Renamed method: getEntriesByFilter (from old getAllByFilters)
//     async getEntriesByFilter(filters?: Filters<SpTblFinishInWardOutWard>, offset?: number, limit?: number): Promise<any[]> {
//         // This method will use the InWardOutWardProvider to fetch joined data
//         return this.inwardOutWardProvider.getEntriesByFilter(filters, offset, limit);
//     }

//     // New method: GetEntrybyId
//     // Note: The original SQL was 'Select * from pheonixDB.dbo.PurchasePipeLine where purtrnid='.$_PUT['id'];
//     // Assuming `Purtrnid` and `Type` are the composite key for uniqueness from the joining context.
//     // If Purtrnid alone is truly unique for PurchasePipeLine, adjust provider/service to just use that.
//     // For now, I'll pass both Purtrnid and Type to make lookup precise as per the join logic.
//     async GetEntrybyId(PurTrnId: number): Promise<PurchasePipeLine | null> {
//         return this.purchasePileLineProvider.getById(PurTrnId);
//     }

//     // New method: InsertEntry
//     // Data should be a partial of the PurchasePipeLine entity
//     async InsetEntry(data: Partial<PurchasePipeLine>): Promise<PurchasePipeLine> {
//         return this.purchasePileLineProvider.create(data);
//     }

//     // New method: UpdateEntry
//     // Data should be a partial of the PurchasePipeLine entity
//     async UpdateEntry(PurTrnId: number,  data: Partial<PurchasePipeLine>): Promise<PurchasePipeLine | null> {
//         return this.purchasePileLineProvider.update(PurTrnId,  data);
//     }
// }