//src/providers/saleTransaction.provider.ts

import { container } from "tsyringe";
import { Repository } from "typeorm"; // Changed ViewEntity to Repository
import winston from "winston";
import { objectDecorators } from "../decorators/objectDecorators";
import { SaleTransaction } from '../entity/phoenix/SaleTransaction';
import { BaseProviderInterface } from "../interface/base.provider";
import { Filters } from "../types/filter.types";
import { WINSTON_LOGGER } from "../utils/logger";
import { PhoenixDataSource } from "./phoenix.data-source.provider";

export interface SaleTransactionProvider extends BaseProviderInterface<SaleTransaction, Filters<SaleTransaction>> {
    trimWhitespace<T>(obj: T): T;
}

@objectDecorators
export class SaleTransactionProvider {
    private SaleTransactionRepository: Repository<SaleTransaction> | null = null; // Changed ViewEntity to Repository
    private dataSourceInstance: PhoenixDataSource;
        private readonly logger: winston.Logger;

    constructor(dataSourceInstance: PhoenixDataSource) { // Inject PhoenixDataSource in constructor
        this.dataSourceInstance = dataSourceInstance;
        this.logger = container.resolve<winston.Logger>(WINSTON_LOGGER);
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

    async getTransactionById(id: number): Promise<SaleTransaction | null> {
        try {
            const transaction = await this._getRepository().findOne({
                where: { SalTrnId: id },
                relations: ['products'], // Correct relations is specified
            });
            return this.trimWhitespace(transaction) || null; // Trimming is applied here
        } catch (error) {
            this.logger.error("Error fetching sale transaction:", error);
            return null; // or throw error
        }
    }
}