//src/providers/saleTransaction.provider.ts

import { BaseProviderInterface } from "../interface/base.provider";
import { SaleTransaction } from '../entity/phoenix/SaleTransaction';
import { SaleTransactionDetails } from '../entity/phoenix/saleTransactionDetail'
import { objectDecorators } from "../decorators/objectDecorators";
import { Repository } from "typeorm"; // Changed ViewEntity to Repository
import { PhoenixDataSource } from "./phoenix.data-source.provider";
import { Filters } from "../types/filter.types";

export interface SaleTransactionProvider extends BaseProviderInterface<SaleTransaction, Filters<SaleTransaction>> {
    trimWhitespace<T>(obj: T): T;
}

@objectDecorators
export class SaleTransactionProvider {
    private SaleTransactionRepository: Repository<SaleTransaction> | null = null; // Changed ViewEntity to Repository
    private dataSourceInstance: PhoenixDataSource;

    constructor(dataSourceInstance: PhoenixDataSource) { // Inject PhoenixDataSource in constructor
        this.dataSourceInstance = dataSourceInstance;
    }

    private _getRepository(): Repository<SaleTransaction> { // Changed ViewEntity to Repository
        if (!this.SaleTransactionRepository) {
            throw new Error("Sale transaction repository not initialized. Call initializeRepository() first.");
        }
        return this.SaleTransactionRepository;
    }

    async initializeRepository(): Promise<void> { // Initialize the repository
        const dataSource = await this.dataSourceInstance.init(); // Ensure DataSource is initialized
        this.SaleTransactionRepository = dataSource.getRepository(SaleTransaction);
    }

    async getTransactionById(id: number): Promise<{ SaleTransaction: SaleTransaction | null }> {
        try {
            const transaction = await this._getRepository().findOne({
                where: {
                    SalTrnId: id,
                },
                relations: ['saleTransactionDetails'], // Corrected to use 'saleTransactionDetails' and not 'products'
            });

            return { SaleTransaction: transaction || null };
        } catch (error) {
            console.error("Error fetching sale transaction:", error);
            return { SaleTransaction: null }; // or throw error
        }
    }
}