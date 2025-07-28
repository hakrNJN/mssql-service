//src/services/PurchaseInwardOutWard.service.ts

import { SpTblFinishInWardOutWard } from "../entity/anushree/SpTblFinishInWardOutWard.entity";
import { PurchasePipeLine } from "../entity/phoenix/PurchasePipeLine"; // Import PurchasePipeLine Entity
import { AppDataSource } from "../providers/data-source.provider";
import { InWardOutWardProvider } from "../providers/inwardOutward.provider";
import { PurchasePileLine as PurchasePileLineProvider } from "../providers/purchasePileLine.provider"; // Import the aliased provider
import { Filters } from "../types/filter.types";

export class PurchaseParcelStatusService {
    private inwardOutWardProvider: InWardOutWardProvider; // Renamed for clarity
    private purchasePileLineProvider: PurchasePileLineProvider; // Added new provider

    constructor(private dataSourceInstance: AppDataSource) {
        this.inwardOutWardProvider = new InWardOutWardProvider(this.dataSourceInstance);
        this.purchasePileLineProvider = new PurchasePileLineProvider(this.dataSourceInstance); // Initialize new provider
    }

    async initialize(): Promise<void> {
        await this.inwardOutWardProvider.initializeRepository();
        await this.purchasePileLineProvider.initializeRepository(); // Initialize the new provider's repository
    }

    // New/Renamed method: getEntriesByFilter (from old getAllByFilters)
    async getEntriesByFilter(filters?: Filters<SpTblFinishInWardOutWard>, offset?: number, limit?: number): Promise<any[]> {
        // This method will use the InWardOutWardProvider to fetch joined data
        return this.inwardOutWardProvider.getEntriesByFilter(filters, offset, limit);
    }

    // New method: GetEntrybyId
    // Note: The original SQL was 'Select * from pheonixDB.dbo.PurchasePipeLine where purtrnid='.$_PUT['id'];
    // Assuming `Purtrnid` and `Type` are the composite key for uniqueness from the joining context.
    // If Purtrnid alone is truly unique for PurchasePipeLine, adjust provider/service to just use that.
    // For now, I'll pass both Purtrnid and Type to make lookup precise as per the join logic.
    async GetEntrybyId(PurTrnId: number, Type: number): Promise<PurchasePipeLine | null> {
        return this.purchasePileLineProvider.getById(PurTrnId, Type);
    }

    // New method: InsertEntry
    // Data should be a partial of the PurchasePipeLine entity
    async InsetEntry(data: Partial<PurchasePipeLine>): Promise<PurchasePipeLine> {
        return this.purchasePileLineProvider.create(data);
    }

    // New method: UpdateEntry
    // Data should be a partial of the PurchasePipeLine entity
    async UpdateEntry(PurTrnId: number, Type: number, data: Partial<PurchasePipeLine>): Promise<boolean> {
        return this.purchasePileLineProvider.update(PurTrnId, Type, data);
    }
}