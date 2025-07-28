//src/providers/KotakCMS.provider.ts
import { container } from "tsyringe";
import { Repository, SelectQueryBuilder } from "typeorm";
import { objectDecorators } from "../decorators/objectDecorators";
import { Vwkotakcmsonline } from "../entity/anushree/KotakCMS.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { WINSTON_LOGGER } from "../utils/logger";
import { applyFilters } from "../utils/query-utils";
import { AppDataSource } from "./data-source.provider";
import { ILogger } from "../interface/logger.interface";
import { HttpException } from "../exceptions/httpException"; // For NotImplemented

export interface KotakCMSProvider extends BaseProviderInterface<Vwkotakcmsonline, Filters<Vwkotakcmsonline>> {
    trimWhitespace<T>(obj: T): T;
    getAllWithFilters(filters?: Filters<Vwkotakcmsonline>, offset?: number, limit?: number): Promise<Vwkotakcmsonline[]>;
}

@objectDecorators
export class KotakCMSProvider implements KotakCMSProvider {
    private kotakCMSRepository: Repository<Vwkotakcmsonline> | null = null;
    private dataSourceInstance: AppDataSource;
    private readonly logger: ILogger;

    constructor(dataSourceInstance: AppDataSource) {
        this.dataSourceInstance = dataSourceInstance;
        this.logger = container.resolve<ILogger>(WINSTON_LOGGER);
    }

    private _getRepository(): Repository<Vwkotakcmsonline> {
        if (!this.kotakCMSRepository) {
            throw new Error("Kotak CMS repository not initialized. Call initializeRepository() first.");
        }
        return this.kotakCMSRepository;
    }

    async initializeRepository(): Promise<void> {
        const dataSource = await this.dataSourceInstance.init();
        this.kotakCMSRepository = dataSource.getRepository(Vwkotakcmsonline);
    }

    async getAll(offset?: number, limit?: number): Promise<Vwkotakcmsonline[]> {
        // This method will now fetch *all* data by default if no filters are passed.
        // If Conum/Yearid should always apply, even when `getAll` is called directly without filters,
        // you would need a mechanism to store/pass those default filters.
        // For now, it will apply only the filters passed.
        return this.getAllWithFilters(undefined, offset, limit);
    }

    async getAllWithFilters(filters?: Filters<Vwkotakcmsonline>, offset?: number, limit?: number): Promise<Vwkotakcmsonline[]> {
        try {
            const queryBuilder = this._getRepository().createQueryBuilder('kotakCMS');
            // `applyFilters` utility should be able to handle `filters.or` and new fields like `Client_Code` and `Yearid`
            const filteredQueryBuilder: SelectQueryBuilder<Vwkotakcmsonline> = applyFilters(queryBuilder, filters, 'kotakCMS');

            if (offset !== undefined) {
                filteredQueryBuilder.skip(offset);
            }
            if (limit !== undefined) {
                filteredQueryBuilder.take(limit);
            }

            filteredQueryBuilder.orderBy('kotakCMS.vno', 'ASC');

            const kotakCMSRecords = await filteredQueryBuilder.getMany();
            return this.trimWhitespace(kotakCMSRecords);
        } catch (error) {
            this.logger.error("Error fetching Kotak CMS with Filter", error);
            throw new Error(error as string)
        }
    }

    async getById(id: number): Promise<Vwkotakcmsonline | null> {
        try {
            const record = await this._getRepository().findOne({ where: { vno: id } });
            return record ? this.trimWhitespace(record) : null;
        } catch (error) {
            this.logger.error(`Error fetching Kotak CMS by vno ${id}`, error);
            throw new Error(error as string);
        }
    }

    // CRUD operations are not supported on this view
    async create(data: Partial<Vwkotakcmsonline>): Promise<Vwkotakcmsonline> {
        throw HttpException.NotImplemented("Create operation not supported on view 'Vwkotakcmsonline'.");
    }

    async update(id: number, data: Partial<Vwkotakcmsonline>): Promise<Vwkotakcmsonline | null> {
        throw HttpException.NotImplemented("Update operation not supported on view 'Vwkotakcmsonline'.");
    }

    async delete(id: number): Promise<boolean> {
        throw HttpException.NotImplemented("Delete operation not supported on view 'Vwkotakcmsonline'.");
    }

    trimWhitespace<T>(obj: T): T {
        return obj;
    }
}