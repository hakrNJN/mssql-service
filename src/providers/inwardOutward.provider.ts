//src/providers/inwardOutward.provider.ts
import { container } from "tsyringe";
import { Repository, SelectQueryBuilder, QueryRunner } from "typeorm"; // Import QueryRunner
import { objectDecorators } from "../decorators/objectDecorators";
import { SpTblFinishInWardOutWard } from "../entity/anushree/SpTblFinishInWardOutWard.entity";
import { BaseProviderInterface } from "../interface/base.provider";
import { ILogger } from "../interface/logger.interface";
import { Filters } from "../types/filter.types";
import { WINSTON_LOGGER } from "../utils/logger";
import { applyFilters } from "../utils/query-utils";
import { AppDataSource } from "./data-source.provider";
import { HttpException } from "../exceptions/httpException";

// Defining a specific interface for the InWardOutWardProvider that includes the SP parameters
export interface InWardOutWardProvider extends BaseProviderInterface<SpTblFinishInWardOutWard, Filters<SpTblFinishInWardOutWard>> { // BaseProviderInterface expects one generic T
    trimWhitespace<T>(obj: T): T;
    // getAll methods are already part of BaseProviderInterface
    // This method is for the complex joined view, which now depends on SP execution
    getEntriesByFilter(
        conum: string,
        fdat: string, // YYYYMMDD format
        tdat: string, // YYYYMMDD format
        accountId: string,
        filters?: Filters<SpTblFinishInWardOutWard>,
        offset?: number,
        limit?: number
    ): Promise<any[]>; // Returns custom shape, so `any[]` or a defined DTO

    // If you need to get a single entry from the temporary data after SP execution
    getEntryByIdFromSPData(
        conum: string,
        fdat: string,
        tdat: string,
        accountId: string,
        purtrnId: number, // Assuming this is the unique identifier in the SP's output
        type: number // Assuming type is also part of the identifier
    ): Promise<SpTblFinishInWardOutWard | null>;
}

@objectDecorators
export class InWardOutWardProvider implements InWardOutWardProvider { // Ensure it implements the interface
    private inwardOutwardRepository: Repository<SpTblFinishInWardOutWard> | null = null;
    private dataSourceInstance: AppDataSource;
    private readonly logger: ILogger;

    constructor(dataSourceInstance: AppDataSource) {
        this.dataSourceInstance = dataSourceInstance;
        this.logger = container.resolve<ILogger>(WINSTON_LOGGER);
    }

    private _getRepository(): Repository<SpTblFinishInWardOutWard> {
        if (!this.inwardOutwardRepository) {
            throw new Error("Inward Outward repository not initialized. Call initializeRepository() first.");
        }
        return this.inwardOutwardRepository;
    }

    async initializeRepository(): Promise<void> {
        const dataSource = await this.dataSourceInstance.init();
        this.inwardOutwardRepository = dataSource.getRepository(SpTblFinishInWardOutWard);
    }

    // New method to execute the stored procedure
    // Crucially, this uses a QueryRunner to ensure subsequent queries are on the same session.
    private async _executePurchaseInwardOutwardSp(
        queryRunner: QueryRunner, // Takes an active queryRunner
        conum: string,
        fdat: string,
        tdat: string,
        accountId: string
    ): Promise<void> {
        try {
            const spName = 'YOUR_STORED_PROCEDURE_NAME_HERE'; // *** IMPORTANT: Replace with your actual SP name ***
            const params = [
                `@Conum = N'${conum}'`,
                `@Fdat = ${fdat}`, // Dates without quotes if they are numbers (like 20240401)
                `@Tdat = ${tdat}`,
                `@accountid = N'${accountId}'`
            ].join(', ');

            const spCall = `EXEC ${spName} ${params}`;
            this.logger.info(`Executing SP: ${spCall}`);
            await queryRunner.query(spCall);
            this.logger.info(`Stored procedure ${spName} executed successfully.`);
        } catch (error) {
            this.logger.error(`Error executing stored procedure: ${error instanceof Error ? error.message : String(error)}`, error);
            throw new Error(`Failed to execute stored procedure: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    // --- BaseProviderInterface Implementations ---

    // getAll method from BaseProviderInterface
    // Note: If BaseProviderInterface's getAll takes no filters or different parameters, adjust.
    // For this context, it's safer to have a dedicated method for SP-driven data.
    // However, to satisfy the interface, we'll provide a dummy or throw.
    async getAll(offset?: number, limit?: number): Promise<SpTblFinishInWardOutWard[]> {
        // This method cannot run the SP without parameters.
        // If BaseProviderInterface *must* be fully implemented, you'll need to decide
        // how to handle these parameters (e.g., make them optional in the interface,
        // or ensure they are provided by the service even for `getAll`).
        // For a read-only view, BaseProviderInterface might not be the best fit.
        this.logger.warn("Calling getAll without SP parameters. Data might be stale or empty.");
        // You could potentially fetch a small, default set without SP interaction if `SpTblFinishInWardOutWard`
        // is always populated, but the requirement is to run the SP first.
        // Thus, we must either throw or require parameters.
        throw new Error("Cannot call getAll directly. Use getEntriesByFilter and provide SP parameters.");
    }

    // getById method from BaseProviderInterface (by entity's own primary key, PurtrnId)
    // This would NOT typically trigger the SP, as it's for `SpTblFinishInWardOutWard` itself.
    async getById(id: number): Promise<SpTblFinishInWardOutWard | null> {
        try {
            const record = await this._getRepository().findOne({ where: { PurtrnId: id } }); // Assuming PurtrnId is the actual PK
            return record ? this.trimWhitespace(record) : null;
        } catch (error) {
            this.logger.error(`Error fetching Inward Outward by id ${id}`, error);
            throw new Error(error as string);
        }
    }

    // CRUD operations are likely not supported on this view entity, as before
    async create(data: Partial<SpTblFinishInWardOutWard>): Promise<SpTblFinishInWardOutWard> {
        throw HttpException.NotImplemented("Create operation not supported on view 'SpTblFinishInWardOutWard'.");
    }

    async update(id: number, data: Partial<SpTblFinishInWardOutWard>): Promise<SpTblFinishInWardOutWard | null> {
        throw HttpException.NotImplemented("Update operation not supported on view 'SpTblFinishInWardOutWard'.");
    }

    async delete(id: number): Promise<boolean> {
        throw HttpException.NotImplemented("Delete operation not supported on view 'SpTblFinishInWardOutWard'.");
    }

    // --- End BaseProviderInterface Implementations ---


    // Renamed from getEntriesByFilter to handle SP execution
    async getEntriesByFilter(
        conum: string,
        fdat: string,
        tdat: string,
        accountId: string,
        filters?: Filters<SpTblFinishInWardOutWard>,
        offset?: number,
        limit?: number
    ): Promise<any[]> {
        const dataSource = this.dataSourceInstance.getDataSource();
        if (!dataSource) {
            throw new Error("DataSource is not initialized.");
        }
        const queryRunner = dataSource.createQueryRunner(); // Get a query runner

        await queryRunner.connect(); // Connect to the database
        await queryRunner.startTransaction(); // Start a transaction for consistency

        try {
            // 1. Execute the stored procedure
            await this._executePurchaseInwardOutwardSp(queryRunner, conum, fdat, tdat, accountId);

            // 2. Query the temporary table/view data within the same transaction/session
            // Use queryRunner.manager.getRepository() to ensure the repository operates within the same queryRunner connection
            const queryBuilder = queryRunner.manager.getRepository(SpTblFinishInWardOutWard).createQueryBuilder('T');

            // Existing logic for joining (assuming PurchasePipeLine is available in the same context)
            // You mentioned the SP creates `sptblpurchaseInwrdOutward` and *then* we retrieve from it.
            // If the SP replaces/updates the data in `SpTblFinishInWardOutWard` directly, then no `LEFT JOIN` needed here.
            // If the SP creates a *temporary table*, and `SpTblFinishInWardOutWard` refers to the *permanent* table,
            // then you'd need raw SQL `SELECT * FROM #sptblpurchaseInwrdOutward` from the queryRunner.
            //
            // Assuming the SP *populates* the data that `SpTblFinishInWardOutWard` (the entity) then reads.
            // And that the JOIN to PurchasePipeLine (D) is still needed *after* `SpTblFinishInWardOutWard` is populated.
            // This is complex. Let's assume the previous complex SELECT statement IS the desired output after SP runs.
            // The `SpTblFinishInWardOutWard` entity is mapped to the view.
            // If your view `SpTblFinishInWardOutWard` uses `LEFT JOIN pheonixDB.dbo.PurchasePipeLine D`,
            // then the JOIN is already part of the VIEW definition in the database.
            // So, you just query the `SpTblFinishInWardOutWard` entity directly.
            // The previous `LEFT JOIN(PurchasePipeLine, 'D', ...)` in this provider would be redundant or incorrect
            // if `SpTblFinishInWardOutWard` is already a joined view.
            // Let's simplify based on `Vwkotakcmsonline` pattern where entity is view.

            // Simplify: If SpTblFinishInWardOutWard is a VIEW that already does the join,
            // then you just query SpTblFinishInWardOutWard directly.
            // If not, then the SP populates SpTblFinishInWardOutWard, and you *still* need to join.
            // Given the original SQL provided, it seems `SpTblFinishInWardOutWard` is one part,
            // and `PurchasePipeLine` is another that you join to.

            // Let's stick to the previous `getEntriesByFilter` logic, assuming `SpTblFinishInWardOutWard` is a base table/view,
            // and `PurchasePipeLine` is another, requiring a join.

            // Re-adding the join logic from the previous solution for `getEntriesByFilter`
            // and ensuring it uses `queryRunner.manager.getRepository`
            const PurchasePipeLine = (await import("../entity/phoenix/PurchasePipeLine")).PurchasePipeLine; // Dynamic import to avoid circular dependency if this is in a common module.

            queryBuilder.leftJoin(PurchasePipeLine, 'D', 'T.Purtrnid = D.Purtrnid AND T.Type = D.Type');

            queryBuilder
                .select([
                    'T.Purtrnid',
                    'T.Type',
                    'T.Vno',
                    'T.Dat',
                    'T.BillNo',
                    'T.Pcs',
                    'T.Customer',
                    'T.City',
                    'T.GRPName AS GroupName',
                    'T.AgentName',
                    'T.BillAmount AS BillAmt',
                    'COALESCE(D.LrNo, T.LRNo) AS LrNo',
                    'D.Lrdat AS LrDat',
                    'D.ReceiveDate AS RecDat',
                    'D.OpenDate AS OpnDat',
                    'T.Company'
                ]);

            queryBuilder.where("T.TrnOrigin = :trnOrigin", { trnOrigin: 'frmFinPurchEntry' });
            queryBuilder.andWhere("T.Dat >= :startDate", { startDate: '2021-08-01' });

            if (filters) {
                for (const key in filters) {
                    if (Object.prototype.hasOwnProperty.call(filters, key)) {
                        const filterValue = (filters as any)[key];
                        // This logic needs to know if the filter is for T or D alias.
                        // For simplicity, assuming filters are primarily for T (SpTblFinishInWardOutWard)
                        // If you have filters for D, you'll need to specify `D.${key}`
                        if (filterValue) {
                             if (filterValue.equal !== undefined) {
                                queryBuilder.andWhere(`T.${key} = :${key}_equal`, { [`${key}_equal`]: filterValue.equal });
                            } else if (filterValue.like !== undefined) {
                                queryBuilder.andWhere(`T.${key} LIKE :${key}_like`, { [`${key}_like`]: `%${filterValue.like}%` });
                            } else if (filterValue.in !== undefined) {
                                queryBuilder.andWhere(`T.${key} IN (:...${key}_in)`, { [`${key}_in`]: filterValue.in });
                            } else if (filterValue.betweenDate !== undefined) {
                                queryBuilder.andWhere(`T.${key} BETWEEN :${key}_from AND :${key}_to`, {
                                    [`${key}_from`]: filterValue.betweenDate[0],
                                    [`${key}_to`]: filterValue.betweenDate[1]
                                });
                            }
                            // Add other filter types as needed
                        }
                    }
                }
            }

            if (offset !== undefined) {
                queryBuilder.skip(offset);
            }
            if (limit !== undefined) {
                queryBuilder.take(limit);
            }

            queryBuilder.orderBy('T.Vno', 'ASC').addOrderBy('T.Dat', 'ASC');

            const result = await queryBuilder.getRawMany(); // Use getRawMany as before
            await queryRunner.commitTransaction(); // Commit the transaction
            return this.trimWhitespace(result);
        } catch (error) {
            await queryRunner.rollbackTransaction(); // Rollback on error
            this.logger.error("Error fetching Inward Outward entries with custom filter and SP execution", error);
            throw new Error(error instanceof Error ? error.message : String(error));
        } finally {
            await queryRunner.release(); // Release the query runner connection
        }
    }

    // New method to get a single entry from the SP-generated data
    // This also needs to execute the SP first.
    async getEntryByIdFromSPData(
        conum: string,
        fdat: string,
        tdat: string,
        accountId: string,
        purtrnId: number,
    ): Promise<SpTblFinishInWardOutWard | null> {
        const dataSource = this.dataSourceInstance.getDataSource();
        if (!dataSource) {
            throw new Error("DataSource is not initialized.");
        }
        const queryRunner = dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await this._executePurchaseInwardOutwardSp(queryRunner, conum, fdat, tdat, accountId);

            // Now query for the specific record within the same session
            const record = await queryRunner.manager.getRepository(SpTblFinishInWardOutWard).findOne({
                where: {
                    PurtrnId: purtrnId, // Assuming Purtrnid is the FK in SpTblFinishInWardOutWard
                }
            });

            await queryRunner.commitTransaction();
            return record ? this.trimWhitespace(record) : null;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(`Error fetching single Inward Outward entry after SP execution for Purtrnid ${purtrnId}`, error);
            throw new Error(error instanceof Error ? error.message : String(error));
        } finally {
            await queryRunner.release();
        }
    }


    trimWhitespace<T>(obj: T): T {
        return obj;
    }
}
