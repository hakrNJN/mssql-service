import { SerMst } from "../entity/anushreeDb/series.entity";
import { AppDataSource } from "../providers/data-source.provider";
import { Filters } from "../types/filter.types";
export declare class SeriesService {
    private dataSourceInstance;
    private seriesProvider;
    constructor(dataSourceInstance: AppDataSource);
    initialize(): Promise<void>;
    getAllSeries(): Promise<SerMst[]>;
    getSeriesbyId(id: number): Promise<SerMst | null>;
    getSeriesWithFilters(filters?: Filters<SerMst>): Promise<SerMst[]>;
}
