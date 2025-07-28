//src/sercices/KotakCMS.Service.ts
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

    async getAllByVno(filters?: Filters<Vwkotakcmsonline>, offset?: number, limit?: number): Promise<Vwkotakcmsonline[]> {
        return this.kotakCMSProvider.getAllKotakCMSWithFilters(filters, offset, limit);
    }
}   
