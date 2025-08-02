//src/services/kotakCMS.service.ts
import { Vwkotakcmsonline } from "../entity/anushreeDb/kotakCMS.entity";

import { KotakCMSProvider } from "../providers/KotakCMS.provider";
// import { Filters } from "../types/filter.types"; // No longer directly used in service method signature

import { inject, injectable } from "tsyringe";

@injectable()
export class KotakCMSService {
    private kotakCMSProvider: KotakCMSProvider;

    constructor(
        @inject(KotakCMSProvider) kotakCMSProvider: KotakCMSProvider
    ) {
        this.kotakCMSProvider = kotakCMSProvider;
        this.initialize();
    }

    private async initialize(): Promise<void> {
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