//src/services/saleTransaction.service.ts

import { SaleTransaction } from "../entity/phoenixDb/saleTransaction.entity";

import { SaleTransactionProvider } from "../providers/saleTransaction.provider";

import { inject, injectable } from "tsyringe";
import { ILogger } from "../interface/logger.interface";
import { WINSTON_LOGGER } from "../utils/logger";
import { DataSourceManager } from "./dataSourceManager.service";

@injectable()
export class SaleTransactionService {
    private saleTransactionProvider: SaleTransactionProvider;

    constructor(
        @inject(DataSourceManager) dataSourceManager: DataSourceManager,
        @inject(WINSTON_LOGGER) logger: ILogger
    ) {
        this.saleTransactionProvider = new SaleTransactionProvider(dataSourceManager.phoenixDataSource, logger);
    }

    async getTransactionById(id: number): Promise<SaleTransaction | null> {
        return this.saleTransactionProvider.getTransactionById(id);
    }

}