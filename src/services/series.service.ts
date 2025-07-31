//src/services/series.service.ts



import { injectable } from 'tsyringe';
import { SerMst } from "../entity/anushreeDb/series.entity";
import { AppDataSource } from "../providers/data-source.provider";
import { SeriesProvider } from "../providers/series.provider";
import { Filters } from "../types/filter.types";

@injectable()
export class SeriesService {
    private seriesProvider: SeriesProvider;

    constructor(private dataSourceInstance: AppDataSource) {
        this.seriesProvider = new SeriesProvider(this.dataSourceInstance)
    }

    async initialize(): Promise<void> {
        await this.seriesProvider.initializeRepository();
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