//src/providers/saleTransaction.provider.ts

import { DataSource, Repository } from "typeorm"; // Changed ViewEntity to Repository
import { objectDecorators } from "../decorators/objectDecorators";
import { SaleTransaction } from '../entity/phoenixDb/saleTransaction.entity';
import { BaseProviderInterface } from "../interface/base.provider";
import { ILogger } from "../interface/logger.interface";
import { Filters } from "../types/filter.types";

export interface SaleTransactionProvider extends BaseProviderInterface<SaleTransaction, Filters<SaleTransaction>> {
    trimWhitespace<T>(obj: T): T;
}

@objectDecorators
export class SaleTransactionProvider {
    private SaleTransactionRepository: Repository<SaleTransaction> | null = null; // Changed ViewEntity to Repository
    private readonly logger: ILogger;
    private readonly phoenixDataSource: DataSource;

    constructor(
        phoenixDataSource: DataSource,
        logger: ILogger
    ) {
        this.phoenixDataSource = phoenixDataSource;
        this.logger = logger;

    }

    private _getRepository(): Repository<SaleTransaction> {
        if (!this.SaleTransactionRepository) {
            this.SaleTransactionRepository = this.phoenixDataSource.getRepository(SaleTransaction);
            this.logger.info("SaleTransactionProvider repository initialized lazily.");
        }
        return this.SaleTransactionRepository;
    }

    public initializeRepository(): void {
        // This method is no longer needed as repository is initialized lazily.
        // Keeping it for now to avoid breaking interface contracts if any.
    }

    async getTransactionById(id: number): Promise<SaleTransaction | null> {
        console.log(id, "SalTrnId from argument id and request recieved in provider Level");
        // console.log(`logger in provider`, this.logger)
        // console.log(`mainDataSource in provider`, this.phoenixDataSource)
        try {
            const transaction = await this._getRepository().findOne({
                where: { SalTrnId: id },
                relations: ['products'], // Correct relations is specified
            });
            return transaction ? this.trimWhitespace(transaction) : null; // Trimming is applied here
        } catch (error) {
            console.log(`Error fetching transaction by ID: ${id}`, error);
            this.logger.error("Error fetching sale transaction:", error);
            return null; // or throw error
        }
    }
}