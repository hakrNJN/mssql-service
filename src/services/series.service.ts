import { inject, injectable } from 'tsyringe';
import { SerMst } from "../entity/anushreeDb/series.entity";

import { SeriesProvider } from "../providers/series.provider";
import { Filters } from "../types/filter.types";

@injectable()
export class SeriesService {
    private seriesProvider: SeriesProvider;

    constructor(
        @inject(SeriesProvider) seriesProvider: SeriesProvider
    ) {
        this.seriesProvider = seriesProvider;
        this.initialize(); // Initialize the repository when the service is constructed
    }

    private async initialize(): Promise<void> {
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