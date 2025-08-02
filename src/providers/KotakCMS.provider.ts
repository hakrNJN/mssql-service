//src/providers/KotakCMS.provider.ts
import { container, inject } from "tsyringe";
import { Repository } from "typeorm";
import { objectDecorators } from "../decorators/objectDecorators";
import { Vwkotakcmsonline } from "../entity/anushreeDb/kotakCMS.entity";
import { SerMst } from "../entity/anushreeDb/series.entity";
// import { BaseProviderInterface } from "../interface/base.provider"; // REMOVED: Not implementing generic base interface
import { ILogger } from "../interface/logger.interface";
// import { Filters } from "../types/filter.types"; // REMOVED: Not using generic filters directly here
import { WINSTON_LOGGER } from "../utils/logger";
// Removed applyFilters as we're building a custom query
import { DataSource } from "typeorm";
import { MAIN_DATA_SOURCE } from "../services/dataSourceManager.service";

// Interface now contains only the specific methods needed for KotakCMS
export interface KotakCMSProvider { // Interface no longer extends BaseProviderInterface
    trimWhitespace<T>(obj: T): T;

    // This is the primary data retrieval method
    getKotakCMSData(
        fromVno: number,
        toVno: number,
        conum: string,
        yearid: number,
        offset?: number,
        limit?: number
    ): Promise<Vwkotakcmsonline[]>;

    // Optionally, if getById is still needed internally or by other services, keep it here.
    // However, the prompt indicates it's removed from the controller/route.
    getById(id: number): Promise<Vwkotakcmsonline | null>;
}

@objectDecorators
export class KotakCMSProvider implements KotakCMSProvider { // Class implements its own interface
    private kotakCMSRepository: Repository<Vwkotakcmsonline> | null = null;
    private serMstRepository: Repository<SerMst> | null = null;
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

    private _getKotakCMSRepository(): Repository<Vwkotakcmsonline> {
        if (!this.kotakCMSRepository) {
            throw new Error("Kotak CMS repository not initialized. Call initializeRepository() first.");
        }
        return this.kotakCMSRepository;
    }

    private _getSerMstRepository(): Repository<SerMst> {
        if (!this.serMstRepository) {
            throw new Error("SerMst repository not initialized. Call initializeRepository() first.");
        }
        return this.serMstRepository;
    }

    public initializeRepository(): void {
        this.kotakCMSRepository = this.mainDataSource.getRepository(Vwkotakcmsonline);
        this.serMstRepository = this.mainDataSource.getRepository(SerMst);
    }

    // Explicit implementation for getById if kept (from previously, not from BaseProviderInterface)
    async getById(id: number): Promise<Vwkotakcmsonline | null> {
        try {
            const record = await this._getKotakCMSRepository().findOne({ where: { vno: id } });
            return record ? this.trimWhitespace(record) : null;
        } catch (error) {
            this.logger.error(`Error fetching Kotak CMS by vno ${id}`, error);
            throw new Error(error as string);
        }
    }

    // This is the single, specific data retrieval method for Kotak CMS
    async getKotakCMSData(
        fromVno: number,
        toVno: number,
        conum: string,
        yearid: number,
        offset?: number,
        limit?: number
    ): Promise<Vwkotakcmsonline[]> {
        try {
            const queryBuilder = this._getKotakCMSRepository().createQueryBuilder('vwkotak');

            // Add WHERE conditions for vno and conum
            queryBuilder
                .where('vwkotak.vno BETWEEN :fromVno AND :toVno', { fromVno, toVno })
                .andWhere('vwkotak.Conum = :conum', { conum });

            // Add the subquery for TYPE IN (...)
            const subQuery = this._getSerMstRepository().createQueryBuilder('serMst')
                .select('serMst.id')
                .where('serMst.Type = :serMstType', { serMstType: 'Payment' })
                .andWhere('serMst.Name NOT IN (:...excludedNames)', { excludedNames: ['Multi Payment', 'Cash Payment'] })
                .andWhere('serMst.YearId = :yearid', { yearid });

            queryBuilder.andWhere(`vwkotak.Type IN (${subQuery.getQuery()})`);
            queryBuilder.setParameters(subQuery.getParameters()); // Important: Set parameters from subquery

            // Apply pagination
            if (offset !== undefined) {
                queryBuilder.skip(offset);
            }
            if (limit !== undefined) {
                queryBuilder.take(limit);
            }

            // Order by vno
            queryBuilder.orderBy('vwkotak.vno', 'ASC');

            const result = await queryBuilder.getMany();
            return this.trimWhitespace(result);
        } catch (error) {
            this.logger.error(`Error fetching Kotak CMS data with complex query: ${error instanceof Error ? error.message : String(error)}`, error);
            throw new Error(`Failed to fetch Kotak CMS data: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // Keep trimWhitespace, likely provided by decorator
    trimWhitespace<T>(obj: T): T {
        return obj;
    }

    // Removed BaseProviderInterface implementations (getAll, create, update, delete)
    // as this provider is now highly specialized for read-only complex query on a view.
    // If these are truly never used/needed for Vwkotakcmsonline, it simplifies the provider.
    // If they were, you'd re-add them here, and the interface would extend BaseProviderInterface again.
}