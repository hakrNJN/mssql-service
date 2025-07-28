//src/providers/inwardOutward.provider.ts
import { container } from "tsyringe";
import { Repository } from "typeorm";
import { objectDecorators } from "../decorators/objectDecorators";
import { SpTblFinishInWardOutWard } from "../entity/anushree/SpTblFinishInWardOutWard.entity";
import { PurchasePipeLine } from "../entity/phoenix/PurchasePipeLine"; // Import PurchasePipeLine entity for the join
import { BaseProviderInterface } from "../interface/base.provider";
import { ILogger } from "../interface/logger.interface";
import { Filters } from "../types/filter.types";
import { WINSTON_LOGGER } from "../utils/logger";
import { AppDataSource } from "./data-source.provider";

export interface InWardOutWardProvider extends BaseProviderInterface<SpTblFinishInWardOutWard, Filters<SpTblFinishInWardOutWard>> {
    trimWhitespace<T>(obj: T): T;
    // Add signature for the new method
    getEntriesByFilter(filters?: Filters<SpTblFinishInWardOutWard>, offset?: number, limit?: number): Promise<any[]>; // Use any[] because the result shape is custom
}

@objectDecorators
export class InWardOutWardProvider {
    private inwardOutwardRepository: Repository<SpTblFinishInWardOutWard> | null = null;
    private dataSourceInstance: AppDataSource;
    private readonly logger: ILogger; // Corrected type

    constructor(dataSourceInstance: AppDataSource) { // Inject AppDataSource in constructor
        this.dataSourceInstance = dataSourceInstance;
        this.logger = container.resolve<ILogger>(WINSTON_LOGGER); // Corrected type
    }

    private _getRepository(): Repository<SpTblFinishInWardOutWard> {
        if (!this.inwardOutwardRepository) {
            throw new Error("Inward Outward repository not initialized. Call initializeRepository() first.");
        }
        return this.inwardOutwardRepository;
    }

    async initializeRepository(): Promise<void> { // Initialize the repository
        const dataSource = await this.dataSourceInstance.init(); // Ensure DataSource is initialized
        this.inwardOutwardRepository = dataSource.getRepository(SpTblFinishInWardOutWard);
    }

    // Placeholder for trimWhitespace, provided by decorator
    trimWhitespace<T>(obj: T): T {
        // The actual implementation is expected to come from the @objectDecorators.
        // For compilation purposes, we can provide a dummy implementation or ensure the decorator does it.
        // Assuming @objectDecorators adds this method.
        return obj;
    }

    // Renamed and updated existing method to match the requested SQL
    async getEntriesByFilter(filters?: Filters<SpTblFinishInWardOutWard>, offset?: number, limit?: number): Promise<any[]> {
        try {
            // Start with SpTblFinishInWardOutWard (aliased as T)
            const queryBuilder = this._getRepository().createQueryBuilder('T');

            // Left Join with PurchasePipeLine (aliased as D)
            // Note: If you registered 'pheonixDB' as a data source and want to cross-database join,
            // you might need to use raw SQL or configure TypeORM's `relations` carefully.
            // For now, assuming PurchasePipeLine is in the same database or schema is configured for cross-schema.
            // TypeORM's default behavior for relations handles this without explicit 'dbo.' or 'pheonixDB.' if
            // the entities are correctly defined and belong to the same connection.
            queryBuilder.leftJoin(PurchasePipeLine, 'D', 'T.Purtrnid = D.Purtrnid AND T.Type = D.Type');

            // Select specific columns as per the SQL query
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
                    'T.GRPName AS GroupName', // SQL uses GroupName, entity has GRPName
                    'T.AgentName',
                    'T.BillAmount AS BillAmt', // SQL uses BillAmt, entity has BillAmount
                    // Use COALESCE for ISNULL, which is more standard across databases.
                    // If you're strictly on SQL Server, you could use queryBuilder.addSelect('ISNULL(D.LrNo, T.LRNo)', 'LrNo')
                    // For broader compatibility:
                    'COALESCE(D.LrNo, T.LRNo) AS LrNo',
                    'D.Lrdat AS LrDat',
                    'D.ReceiveDate AS RecDat',
                    'D.OpenDate AS OpnDat',
                    'T.Company'
                ]);

            // Apply filters from the utility function
            // Note: applyFilters might expect the alias 'inwardOutward'. We use 'T' here.
            // You might need to adjust applyFilters or manually add conditions.
            // For this complex query, manual conditions are safer to avoid conflicts with 'T' and 'D' aliases.
            // If filters contain fields from SpTblFinishInWardOutWard, prefix with 'T.'
            // If filters contain fields from PurchasePipeLine, prefix with 'D.'

            // Example of manual filter application based on the original SQL constraints
            // and additional filters from the `filters` object
            queryBuilder.where("T.TrnOrigin = :trnOrigin", { trnOrigin: 'frmFinPurchEntry' });
            queryBuilder.andWhere("T.Dat >= :startDate", { startDate: '2021-08-01' }); // Use YYYY-MM-DD for dates

            if (filters) {
                // Iterating through filters to apply them manually, ensuring correct alias
                for (const key in filters) {
                    if (Object.prototype.hasOwnProperty.call(filters, key)) {
                        const filterValue = (filters as any)[key];
                        // Assuming filters are for 'T' (SpTblFinishInWardOutWard) for simplicity here
                        // You'd need more sophisticated logic to handle filters for 'D' (PurchasePipeLine)
                        if (filterValue && filterValue.value !== undefined) {
                            if (filterValue.operator === 'eq') {
                                queryBuilder.andWhere(`T.${key} = :${key}`, { [key]: filterValue.value });
                            } else if (filterValue.operator === 'like') {
                                queryBuilder.andWhere(`T.${key} LIKE :${key}`, { [key]: `%${filterValue.value}%` });
                            }
                            // Add other operators as needed
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

            // Order by T.vno, T.dat asc as per the SQL
            queryBuilder.orderBy('T.Vno', 'ASC').addOrderBy('T.Dat', 'ASC');

            const result = await queryBuilder.getRawMany(); // Use getRawMany to get the custom selected fields
            return this.trimWhitespace(result);
        } catch (error) {
            this.logger.error("Error fetching Inward Outward entries with custom filter and join", error);
            throw new Error(error instanceof Error ? error.message : String(error));
        }
    }
}