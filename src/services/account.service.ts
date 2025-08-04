//src/services/account.service.ts

import { inject, injectable } from "tsyringe";
import { Mast } from "../entity/anushreeDb/accounts.entity";
import { AccountProvider } from "../providers/account.provider";
import { DataSourceManager } from "./dataSourceManager.service";
import { ILogger } from "../interface/logger.interface";
import { WINSTON_LOGGER } from "../utils/logger";

import { EqualFilter, Filters } from "../types/filter.types";

@injectable()
export class AccountService {
    private accountProvider: AccountProvider;

    constructor(
        @inject(DataSourceManager) dataSourceManager: DataSourceManager,
        @inject(WINSTON_LOGGER) logger: ILogger
    ) {
        this.accountProvider = new AccountProvider(dataSourceManager.mainDataSource, logger);
    }

    async getAccountById(id: number): Promise<Mast | null> {
        return this.accountProvider.getAccountById(id);
    }

    async getAccounts(offset?: number, limit?: number): Promise<Mast[] | null> {
        return this.accountProvider.getAllAccounts(offset, limit);
    }

    async getAccountsWithFilters(filters?: Filters<Mast>, offset?: number, limit?: number): Promise<Mast[]> {
        return this.accountProvider.getAllAccountWithFilters(filters, offset, limit);
    }

    async getCustomers(offset?: number, limit?: number): Promise<Mast[] | null> {
        console.log(`request received at Service level`)
        const filters: Filters<Mast> = {
            Type: { equal: 6 } as EqualFilter<number>,
            Status: { equal: 'T' } as EqualFilter<string>,
        };
        return this.accountProvider.getAllAccountWithFilters(filters, offset, limit);
    }

    async getCustomerById(id: number): Promise<Mast[] | null> {
        const filters: Filters<Mast> = {
            id: { equal: id } as EqualFilter<number>,
            Type: { equal: 6 } as EqualFilter<number>
        };
        return this.accountProvider.getAllAccountWithFilters(filters, 0, 1);
    }

    async getCustomerByGST(gst: string): Promise<Mast[] | null> {
        const filters: Filters<Mast> = {
            GST: { equal: gst } as EqualFilter<string>,
            Type: { equal: 6 } as EqualFilter<number>
        };
        return this.accountProvider.getAllAccountWithFilters(filters, 0, 100);
    }

    async getTransporters(offset?: number, limit?: number): Promise<Mast[] | null> {
        const filters: Filters<Mast> = {
            Type: { equal: 25 } as EqualFilter<number>,
            Status: { equal: 'T' } as EqualFilter<string>,
        };
        return this.accountProvider.getAllAccountWithFilters(filters, offset, limit);
    }

    async getAgents(offset?: number, limit?: number): Promise<Mast[] | null> {
        const filters: Filters<Mast> = {
            Type: { equal: 2 } as EqualFilter<number>,
            Status: { equal: 'T' } as EqualFilter<string>,
        };
        return this.accountProvider.getAllAccountWithFilters(filters, offset, limit);
    }

    async getAgentByIdWithCustomers(id: number): Promise<{ Agent: Mast | null }> { // Service method also returns the structured type
        return this.accountProvider.getAgentByIdWithCustomers(id);
    }
}