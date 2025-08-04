//src/services/kotakCMS.service.ts
import { Vwkotakcmsonline } from "../entity/anushreeDb/kotakCMS.entity";

import { KotakCMSProvider } from "../providers/KotakCMS.provider";
// import { Filters } from "../types/filter.types"; // No longer directly used in service method signature

import { inject, injectable, container } from "tsyringe";
import { ILogger } from "../interface/logger.interface";
import { WINSTON_LOGGER } from "../utils/logger";
import { DataSourceManager } from "./dataSourceManager.service";


@injectable()
export class KotakCMSService {
    private kotakCMSProvider: KotakCMSProvider;

    constructor(
        @inject(DataSourceManager) dataSourceManager: DataSourceManager
    ) {
        const logger = container.resolve<ILogger>(WINSTON_LOGGER);
        this.kotakCMSProvider = new KotakCMSProvider(dataSourceManager.mainDataSource, logger);
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