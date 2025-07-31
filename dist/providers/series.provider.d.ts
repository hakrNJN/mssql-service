import { SerMst } from "../entity/anushreeDb/series.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { AppDataSource } from "./data-source.provider";
export interface SeriesProvider extends BaseProviderInterface<SerMst, Filters<SerMst>> {
}
export declare class SeriesProvider implements SeriesProvider {
    private seriesRepository;
    private dataSourceInstance;
    constructor(dataSourceInstance: AppDataSource);
    private _getRepository;
    initializeRepository(): Promise<void>;
    getAllSeriesWithFilters(filters?: Filters<SerMst>): Promise<SerMst[]>;
    getAllSeries(): Promise<SerMst[]>;
    getSeriesById(id: number): Promise<SerMst | null>;
}
