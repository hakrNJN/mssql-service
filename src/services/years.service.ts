//src/services/years.service.ts

import { inject, injectable } from "tsyringe";
import { YearMst } from "../entity/anushreeDb/years.entity";
import { YearsProvider } from "../providers/years.provider";
import { DataSourceManager } from "./dataSourceManager.service";
import { ILogger } from "../interface/logger.interface";
import { WINSTON_LOGGER } from "../utils/logger";
import { Filters } from "../types/filter.types";

@injectable()
export class YearService {
    private yearsProvider: YearsProvider;

    constructor(
        @inject(DataSourceManager) dataSourceManager: DataSourceManager,
        @inject(WINSTON_LOGGER) logger: ILogger
    ) {
        this.yearsProvider = new YearsProvider(dataSourceManager.mainDataSource, logger);
        }

    async getYearsWithFilters(filters?: Filters<YearMst>): Promise<YearMst[]> {
        return this.yearsProvider.getAllYearsWithFilters(filters);
    }

    async getYearsById(id: number): Promise<YearMst | null> {
        return this.yearsProvider.getYearById(id);
    }

    async getYears(): Promise<YearMst[] | null> {
        return this.yearsProvider.getAllYears();
    }
}