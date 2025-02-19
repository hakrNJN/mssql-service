//src/services/account.service.ts

import { Mast } from "../entity/anushree/accounts.entity";
import { AccountProvider } from "../providers/account.provider";
import { AppDataSource } from "../providers/data-source.provider";
import { EqualFilter, Filters } from "../types/filter.types";

export class AccountService {
    private accountProvider: AccountProvider;

    constructor(private dataSourceInstance: AppDataSource) {
        this.accountProvider = new AccountProvider(this.dataSourceInstance);
    }

    async initialize(): Promise<void> {
        await this.accountProvider.initializeRepository();
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
        return this.accountProvider.getAllAccountWithFilters(filters,0, 1);
    }

    async getCustomerByGST(gst: string): Promise<Mast[] | null> {
        const filters: Filters<Mast> = {
            GST: { equal: gst } as EqualFilter<string>,
            Type: { equal: 6 } as EqualFilter<number>
        };
        return this.accountProvider.getAllAccountWithFilters(filters, 0, 100);
    }

    async getTransporters( offset?: number, limit?: number): Promise<Mast[] | null> {
        const filters: Filters<Mast> = {
            Type: { equal: 25 } as EqualFilter<number>,
            Status: { equal: 'T' } as EqualFilter<string>,
        };
        return this.accountProvider.getAllAccountWithFilters(filters, offset, limit);
    }

    async getAgents( offset?: number, limit?: number): Promise<Mast[] | null> {
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