import { Mast } from "../entity/anushreeDb/accounts.entity";
import { AppDataSource } from "../providers/data-source.provider";
import { Filters } from "../types/filter.types";
export declare class AccountService {
    private dataSourceInstance;
    private accountProvider;
    constructor(dataSourceInstance: AppDataSource);
    initialize(): Promise<void>;
    getAccountById(id: number): Promise<Mast | null>;
    getAccounts(offset?: number, limit?: number): Promise<Mast[] | null>;
    getAccountsWithFilters(filters?: Filters<Mast>, offset?: number, limit?: number): Promise<Mast[]>;
    getCustomers(offset?: number, limit?: number): Promise<Mast[] | null>;
    getCustomerById(id: number): Promise<Mast[] | null>;
    getCustomerByGST(gst: string): Promise<Mast[] | null>;
    getTransporters(offset?: number, limit?: number): Promise<Mast[] | null>;
    getAgents(offset?: number, limit?: number): Promise<Mast[] | null>;
    getAgentByIdWithCustomers(id: number): Promise<{
        Agent: Mast | null;
    }>;
}
