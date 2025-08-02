// src/providers/year.provider.ts
import { inject, injectable } from 'tsyringe';
import { Repository } from "typeorm";
import { SerMst } from "../entity/anushreeDb/series.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { ILogger } from "../interface/logger.interface";
import { Filters } from "../types/filter.types";
import { WINSTON_LOGGER } from "../utils/logger";
import { applyFilters } from "../utils/query-utils";
import { DataSource } from "typeorm";
import { MAIN_DATA_SOURCE } from "../services/dataSourceManager.service";

export interface SeriesProvider extends BaseProviderInterface<SerMst, Filters<SerMst>> { }

@injectable()
export class SeriesProvider implements SeriesProvider {
    private seriesRepository: Repository<SerMst> | null = null;
    private readonly logger: ILogger;
    private readonly mainDataSource: DataSource;

    constructor(
        @inject(MAIN_DATA_SOURCE) mainDataSource: DataSource,
        @inject(WINSTON_LOGGER) logger: ILogger
    ) {
        this.mainDataSource = mainDataSource;
        this.logger = logger;
        this.initializeRepository();
    }

    private _getRepository(): Repository<SerMst> {
        if (!this.seriesRepository) {
            throw new Error("Series repository not initialized. Call initializeRepository() first.");
        }
        return this.seriesRepository;
    }

    private initializeRepository(): void {
        this.seriesRepository = this.mainDataSource.getRepository(SerMst);
    }

    async getAllSeriesWithFilters(filters?: Filters<SerMst>): Promise<SerMst[]> {
        try {
            const queryBuilder = this._getRepository().createQueryBuilder('series');
            const filteredQueryBuilder = applyFilters(queryBuilder, filters, 'series'); // Call the imported utility function
            const series = await filteredQueryBuilder.getMany();
            return series;
        } catch (error) {
            this.logger.error("Error fetching All Series with Filter", error);
            throw new Error(error as string)
        }
    }

    async getAllSeries(): Promise<SerMst[]> {
        try {
            return await this._getRepository().find();

        } catch (error) {
            this.logger.error("Error fetching All Series", error);
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