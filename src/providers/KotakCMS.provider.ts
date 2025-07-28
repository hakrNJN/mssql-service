//src/providers/KotakCMS.provider.ts
import { container } from "tsyringe";
import { Repository, SelectQueryBuilder } from "typeorm";
import winston from "winston";
import { objectDecorators } from "../decorators/objectDecorators";
import { Vwkotakcmsonline } from "../entity/anushree/KotakCMS.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { WINSTON_LOGGER } from "../utils/logger";
import { applyFilters } from "../utils/query-utils";
import { AppDataSource } from "./data-source.provider";

export interface KotakCMSProvider extends BaseProviderInterface<Vwkotakcmsonline, Filters<Vwkotakcmsonline>> {
    trimWhitespace<T>(obj: T): T;
}

@objectDecorators
export class KotakCMSProvider {
    private kotakCMSRepository: Repository<Vwkotakcmsonline> | null = null;
    private dataSourceInstance: AppDataSource;
    private readonly logger: winston.Logger;

    constructor(dataSourceInstance: AppDataSource) { // Inject AppDataSource in constructor
        this.dataSourceInstance = dataSourceInstance;
        this.logger = container.resolve<winston.Logger>(WINSTON_LOGGER);
    }

    private _getRepository(): Repository<Vwkotakcmsonline> {
        if (!this.kotakCMSRepository) {
            throw new Error("Kotak CMS repository not initialized. Call initializeRepository() first.");
        }
        return this.kotakCMSRepository;
    }

    async initializeRepository(): Promise<void> { // Initialize the repository
        const dataSource = await this.dataSourceInstance.init(); // Ensure DataSource is initialized
        this.kotakCMSRepository = dataSource.getRepository(Vwkotakcmsonline);
    }

    async getAllKotakCMSWithFilters(filters?: Filters<Vwkotakcmsonline>, offset?: number, limit?: number): Promise<Vwkotakcmsonline[]> {
        try {
            const queryBuilder = this._getRepository().createQueryBuilder('kotakCMS');
            const filteredQueryBuilder: SelectQueryBuilder<Vwkotakcmsonline> = applyFilters(queryBuilder, filters, 'kotakCMS'); // Call the imported utility function

            if (offset !== undefined) {
                filteredQueryBuilder.skip(offset);
            }
            if (limit !== undefined) {
                filteredQueryBuilder.take(limit);
            }

            filteredQueryBuilder.orderBy('kotakCMS.id', 'ASC'); // Order by id in ascending order

            const kotakCMSRecords = await filteredQueryBuilder.getMany();
            return this.trimWhitespace(kotakCMSRecords);
        } catch (error) {
            this.logger.error("Error fetching Kotak CMS with Filter", error);
            throw new Error(error as string)
        }
    }
}