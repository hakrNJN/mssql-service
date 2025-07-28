//src/services/KotakCMS.Service.ts
import { Vwkotakcmsonline } from "../entity/anushree/KotakCMS.entity";
import { KotakCMSProvider } from "../providers/KotakCMS.provider";
import { AppDataSource } from "../providers/data-source.provider";
import { Filters } from "../types/filter.types";

export class KotakCMSService {
    private kotakCMSProvider: KotakCMSProvider;

    constructor(private dataSourceInstance: AppDataSource) {
        this.kotakCMSProvider = new KotakCMSProvider(this.dataSourceInstance);
    }

    async initialize(): Promise<void> {
        await this.kotakCMSProvider.initializeRepository();
    }

    // This method already accepts the filters object, which will now contain Conum and Yearid
    async getKotakCMSWithFilters(filters?: Filters<Vwkotakcmsonline>, offset?: number, limit?: number): Promise<Vwkotakcmsonline[]> {
        return this.kotakCMSProvider.getAllWithFilters(filters, offset, limit);
    }

    // getKotakCMSById method is already removed from controller, so no longer directly called from there.
    // Keeping it in service if it's used internally or for future.
    async getKotakCMSById(vno: number): Promise<Vwkotakcmsonline | null> {
        return this.kotakCMSProvider.getById(vno);
    }
}