//src/services/kotakCMS.service.ts
import { Vwkotakcmsonline } from "../entity/anushreeDb/kotakCMS.entity";
import { AppDataSource } from "../providers/data-source.provider";
import { KotakCMSProvider } from "../providers/kotakCMS.provider";
// import { Filters } from "../types/filter.types"; // No longer directly used in service method signature

export class KotakCMSService {
    private kotakCMSProvider: KotakCMSProvider;

    constructor(private dataSourceInstance: AppDataSource) {
        this.kotakCMSProvider = new KotakCMSProvider(this.dataSourceInstance);
    }

    async initialize(): Promise<void> {
        await this.kotakCMSProvider.initializeRepository();
    }

    // This method is now responsible for the complex query and its specific parameters
    async getKotakCMSData( // Renamed from getKotakCMSWithFilters to match provider method
        fromVno: number,
        toVno: number,
        conum: string,
        yearid: number,
        offset?: number,
        limit?: number
    ): Promise<Vwkotakcmsonline[]> {
        return this.kotakCMSProvider.getKotakCMSData(fromVno, toVno, conum, yearid, offset, limit);
    }

    // Removed getKotakCMSById from service as per requirement
}