import { inject, injectable } from 'tsyringe';
import { SerMst } from "../entity/anushreeDb/series.entity";

import { SeriesProvider } from "../providers/series.provider";
import { DataSourceManager } from "./dataSourceManager.service";
import { ILogger } from "../interface/logger.interface";
import { WINSTON_LOGGER } from "../utils/logger";
import { Filters } from "../types/filter.types";

@injectable()
export class SeriesService {
    private seriesProvider: SeriesProvider;

    constructor(
        @inject(DataSourceManager) dataSourceManager: DataSourceManager,
        @inject(WINSTON_LOGGER) logger: ILogger
    ) {
        this.seriesProvider = new SeriesProvider(dataSourceManager.mainDataSource, logger);
        }

    async getAllSeries(): Promise<SerMst[]> {
        return this.seriesProvider.getAllSeries();
    }

    async getSeriesbyId(id: number): Promise<SerMst | null> {
        return this.seriesProvider.getSeriesById(id);
    }

    async getSeriesWithFilters(filters?: Filters<SerMst>): Promise<SerMst[]> {
        return this.seriesProvider.getAllSeriesWithFilters(filters);
    }
}