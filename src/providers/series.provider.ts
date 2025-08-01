// src/providers/year.provider.ts
import { injectable } from 'tsyringe';
import { Repository } from "typeorm";
import { SerMst } from "../entity/anushreeDb/series.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { applyFilters } from "../utils/query-utils";
import { AppDataSource } from "./data-source.provider";

export interface SeriesProvider extends BaseProviderInterface<SerMst, Filters<SerMst>> { }
@injectable()
export class SeriesProvider implements SeriesProvider {
    private seriesRepository: Repository<SerMst> | null = null;;
    private dataSourceInstance: AppDataSource;
    // private readonly logger: ILogger;

    constructor(dataSourceInstance: AppDataSource) { // Inject AppDataSource in constructor
        this.dataSourceInstance = dataSourceInstance;
        //  this.logger = container.resolve<ILogger>(WINSTON_LOGGER);
    }

    private _getRepository(): Repository<SerMst> {
        if (!this.seriesRepository) {
            throw new Error("Series repository not initialized. Call initializeRepository() first.");
        }
        return this.seriesRepository;
    }

    async initializeRepository(): Promise<void> { // Initialize the repository
        const dataSource = await this.dataSourceInstance.init(); // Ensure DataSource is initialized
        this.seriesRepository = dataSource.getRepository(SerMst);
    }

    async getAllSeriesWithFilters(filters?: Filters<SerMst>): Promise<SerMst[]> {
        const queryBuilder = this._getRepository().createQueryBuilder('series');
        const filteredQueryBuilder = applyFilters(queryBuilder, filters, 'series'); // Call the imported utility function
        const series = await filteredQueryBuilder.getMany();
        return series;
    }

    async getAllSeries(): Promise<SerMst[]> {
        try {
            return await this._getRepository().find();

        } catch (error) {
            console.log(`request at this level3`, error);
            throw new Error(error as string)
        }
    }

    async getSeriesById(id: number): Promise<SerMst | null> {
        return await this._getRepository().findOneBy({ id });
    }

    // Additional CRUD Methods
    // async createSeries(seriesData: Partial<SerMst>): Promise<SerMst> {
    //     const series = this._getRepository().create(seriesData);
    //     return this._getRepository().save(series);
    // }

    // async updateSeries(id: number, seriesData: Partial<SerMst>): Promise<SerMst | null> {
    //     await this._getRepository().update(id, seriesData);
    //     return this.getSeriesById(id); // Return the updated series
    // }

    // async deleteSeries(id: number): Promise<boolean> {
    //     const deleteResult = await this._getRepository().delete(id);
    //     return (deleteResult.affected ?? 0) > 0;; // Return true if deletion was successful
    // }
}