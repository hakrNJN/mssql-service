import "reflect-metadata";
//src/providers/purchasePileLine.provider.ts
import { inject } from "tsyringe";
import { DataSource, DeleteResult, Repository, SelectQueryBuilder, UpdateResult } from "typeorm"; // Import UpdateResult, DeleteResult
import { objectDecorators } from "../decorators/objectDecorators";
import { PurchasePipeLine as PurchasePipeLineEntity } from "../entity/phoenixDb/purchasePipeLine.entity"; // Alias the entity
import { BaseProviderInterface } from "../interface/base.provider";
import { ILogger } from "../interface/logger.interface";
import { Filters } from "../types/filter.types";
import { PHOENIX_DATA_SOURCE } from "../types/symbols";
import { WINSTON_LOGGER } from "../utils/logger";
import { applyFilters } from "../utils/query-utils";

// Renamed the interface to avoid conflict with the entity class
export interface PurchasePileLineInterface extends BaseProviderInterface<PurchasePipeLineEntity, Filters<PurchasePipeLineEntity>> {
    trimWhitespace<T>(obj: T): T;

    // Renamed getById to avoid conflict with BaseProviderInterface's getById(id: number)
    // getByPurtrnIdAndType(PurtrnId: number, type: number): Promise<PurchasePipeLineEntity | null>;

    // BaseProviderInterface already defines 'getAll', 'create', 'update', 'delete'.
    // Ensure the parameters match the BaseProviderInterface definition.
    // If BaseProviderInterface's getAll does NOT take filters, offset, limit,
    // you might need to adjust BaseProviderInterface or define a separate method.
    // Assuming BaseProviderInterface's getAll method signature matches:
    // getAll(filters?: Filters<PurchasePipeLineEntity>, offset?: number, limit?: number): Promise<PurchasePipeLineEntity[]>;
    // If BaseProviderInterface's getAll is simply getAll(): Promise<T[]> then we need a separate method for filtering.
    // For now, let's assume it *does* take filters, offset, limit as you had it.

    // No need to redeclare create, update, delete here if BaseProviderInterface already has them.
    // If the base interface expects a different update signature (e.g., just by ID),
    // then the update method here might also need a different name.
    // Let's assume BaseProviderInterface's `update` takes `id: number, data: Partial<T>`.
    // And BaseProviderInterface's `create` takes `data: Partial<T>`.
    // And BaseProviderInterface's `delete` takes `id: number`.
}

@objectDecorators
export class PurchasePileLine implements PurchasePileLineInterface {
    private purchasePipeLineRepository: Repository<PurchasePipeLineEntity> | null = null;
    private readonly logger: ILogger;
    private readonly phoenixDataSource: DataSource;

    constructor(
        @inject(PHOENIX_DATA_SOURCE) phoenixDataSource: DataSource,
        @inject(WINSTON_LOGGER) logger: ILogger
    ) {
        this.phoenixDataSource = phoenixDataSource;
        this.logger = logger;
    }

    async getAll(offset?: number, limit?: number): Promise<PurchasePipeLineEntity[]> {
        try {
            const queryBuilder = this._getRepository().createQueryBuilder('purchasePipeline');

            if (offset !== undefined) {
                queryBuilder.skip(offset);
            }
            if (limit !== undefined) {
                queryBuilder.take(limit);
            }

            queryBuilder.orderBy('purchasePipeline.Purtrnid', 'ASC');

            const records = await queryBuilder.getMany();
            return this.trimWhitespace(records);
        } catch (error) {
            this.logger.error("Error fetching all Purchase Pipe Line entries", error);
            throw new Error(error as string);
        }
    }

    private _getRepository(): Repository<PurchasePipeLineEntity> {
        if (!this.purchasePipeLineRepository) {
            this.purchasePipeLineRepository = this.phoenixDataSource.getRepository(PurchasePipeLineEntity);
            this.logger.info("PurchasePileLine repository initialized lazily.");
        }
        return this.purchasePipeLineRepository;
    }

    public async initializeRepository(): Promise<void> {
        this.purchasePipeLineRepository = this.phoenixDataSource.getRepository(PurchasePipeLineEntity);
    }

    // Renamed from getAllWithFilters to getAll to satisfy BaseProviderInterface
    async getAllWithFilters(filters?: Filters<PurchasePipeLineEntity>, offset?: number, limit?: number): Promise<PurchasePipeLineEntity[]> {
        try {
            const queryBuilder = this._getRepository().createQueryBuilder('purchasePipeline');
            const filteredQueryBuilder: SelectQueryBuilder<PurchasePipeLineEntity> = applyFilters(queryBuilder, filters, 'purchasePipeline');

            if (offset !== undefined) {
                filteredQueryBuilder.skip(offset);
            }
            if (limit !== undefined) {
                filteredQueryBuilder.take(limit);
            }

            filteredQueryBuilder.orderBy('purchasePipeline.Purtrnid', 'ASC');

            const records = (await filteredQueryBuilder.getRawMany()).map(raw => ({
                PurtrnId: raw.purchasePipeline_PurtrnId,
                Type: raw.purchasePipeline_Type,
                Vno: raw.purchasePipeline_Vno,
                Dat: raw.purchasePipeline_Dat || null,
                BillNo: raw.purchasePipeline_BillNo,
                Customer: raw.purchasePipeline_Customer,
                City: raw.purchasePipeline_City,
                GroupName: raw.purchasePipeline_GroupName,
                AgentName: raw.purchasePipeline_AgentName,
                BillAmt: raw.purchasePipeline_BillAmt,
                Comapny: raw.purchasePipeline_Comapny,
                LRNo: raw.purchasePipeline_LRNo,
                Lrdat: raw.purchasePipeline_Lrdat || null,
                ReceiveDate: raw.purchasePipeline_ReceiveDate || null,
                OpenDate: raw.purchasePipeline_OpenDate || null,
                Entrydate: raw.purchasePipeline_Entrydate || null,
                UpdDate: raw.purchasePipeline_UpdDate || null,
            }));
            // filteredQueryBuilder
            //     .select([
            //         'purchasePipeline.Purtrnid AS Purtrnid',
            //         'purchasePipeline.Type AS Type',
            //         'purchasePipeline.Vno AS Vno',
            //         'purchasePipeline.Dat AS Dat',
            //         'purchasePipeline.BillNo AS BillNo',
            //         'purchasePipeline.Customer AS Customer',
            //         'purchasePipeline.City AS City',
            //         'purchasePipeline.GroupName AS GroupName',
            //         'purchasePipeline.AgentName AS AgentName',
            //         'purchasePipeline.BillAmt AS BillAmt',
            //         'purchasePipeline.Comapny AS Comapny',
            //         'purchasePipeline.LRNo AS LRNo',
            //         'purchasePipeline.Lrdat AS Lrdat',
            //         'purchasePipeline.ReceiveDate AS ReceiveDate',
            //         'purchasePipeline.OpenDate AS OpenDate',
            //         'purchasePipeline.Entrydate AS Entrydate',
            //         'purchasePipeline.UpdDate AS UpdDate'
            //     ]);

            // const records = await filteredQueryBuilder.getRawMany();
            return this.trimWhitespace(records);
        } catch (error) {
            this.logger.error("Error fetching Purchase Pipe Line with Filter", error);
            throw new Error(error as string)
        }
    }

    // Implementation of BaseProviderInterface's getById, using the entity's actual primary key 'id'
    async getById(purtrnid: number): Promise<PurchasePipeLineEntity | null> {
        try {
            const record = await this._getRepository().findOne({
                where: { PurtrnId: purtrnid } // Assuming 'Purtrnid' is the primary generated column
            });
            return record ? this.trimWhitespace(record) : null;
        } catch (error) {
            this.logger.error(`Error fetching Purchase Pipe Line by Purtrnid ${purtrnid}`, error);
            throw new Error(error as string);
        }
    }


    // New method for your specific composite key lookup
    // async getByPurtrnIdAndType(PurtrnId: number, type: number): Promise<PurchasePipeLineEntity | null> {
    //     try {
    //         const record = await this._getRepository().findOne({
    //             where: {
    //                 Purtrnid: PurtrnId,
    //                 Type: type
    //             }
    //         });
    //         return record ? this.trimWhitespace(record) : null;
    //     } catch (error) {
    //         this.logger.error(`Error fetching Purchase Pipe Line with PurtrnId ${PurtrnId} and Type ${type}`, error);
    //         throw new Error(error as string);
    //     }
    // }

    // Implementation of BaseProviderInterface's create
    async create(data: Partial<PurchasePipeLineEntity>): Promise<PurchasePipeLineEntity> {
        try {
            const newRecord = this._getRepository().create(data);
            const savedRecord = await this._getRepository().save(newRecord);
            return this.trimWhitespace(savedRecord);
        } catch (error) {
            this.logger.error("Error inserting Purchase Pipe Line entry", error);
            throw new Error(error as string);
        }
    }

    // Implementation of BaseProviderInterface's update
    // Assuming BaseProviderInterface's update takes a single ID for update
    async update(purtrnid: number, data: Partial<PurchasePipeLineEntity>): Promise<PurchasePipeLineEntity | null> {
        try {
            const updateData = { ...data, UpdDate: new Date().toISOString().slice(0, 10).replace(/-/g, '') }; // Add current date for UpdDate
            const updateResult: UpdateResult = await this._getRepository().update(
                { PurtrnId: purtrnid }, // Update by the entity's primary key 'Purtrnid'
                updateData
            );
            if ((updateResult.affected ?? 0) > 0) {
                return await this.getById(purtrnid); // Return the updated entity
            }
            return null; // Explicitly return null if not updated
        } catch (error) {
            this.logger.error(`Error updating Purchase Pipe Line with Purtrnid ${purtrnid}`, error);
            throw new Error(error as string);
        }
    }

    // New specific update method if you need to update by Purtrnid and Type directly
    // async updateByPurtrnIdAndType(Purtrnid: number, type: number, data: Partial<PurchasePipeLineEntity>): Promise<boolean> {
    //     try {
    //         const updateData = { ...data, UpdDate: new Date() }; // Add current date for UpdDate
    //         const updateResult: UpdateResult = await this._getRepository().update(
    //             { Purtrnid: Purtrnid, Type: type }, // Update by Purtrnid and Type
    //             updateData
    //         );
    //         return (updateResult.affected ?? 0) > 0; // Fix: Use nullish coalescing
    //     } catch (error) {
    //         this.logger.error(`Error updating Purchase Pipe Line with Purtrnid ${Purtrnid} and Type ${type}`, error);
    //         throw new Error(error as string);
    //     }
    // }


    // Implementation of BaseProviderInterface's delete
    async delete(purtrnid: number): Promise<boolean> {
        try {
            const deleteResult: DeleteResult = await this._getRepository().delete(purtrnid);
            return (deleteResult.affected ?? 0) > 0; // Fix: Use nullish coalescing
        } catch (error) {
            this.logger.error(`Error deleting Purchase Pipe Line with Purtrnid ${purtrnid}`, error);
            throw new Error(error as string);
        }
    }

    // Placeholder for trimWhitespace, provided by decorator
    trimWhitespace<T>(obj: T): T {
        // This method is typically added by the @objectDecorators.
        // If not, you'd need a real implementation here.
        return obj;
    }
}