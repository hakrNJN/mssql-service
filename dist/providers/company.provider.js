"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyProvider = void 0;
const company_entity_1 = require("../entity/anushreeDb/company.entity");
const query_utils_1 = require("../utils/query-utils");
class CompanyProvider {
    ;
    constructor(dataSourceInstance) {
        this.yearRepository = null;
        this.dataSourceInstance = dataSourceInstance;
    }
    _getRepository() {
        if (!this.yearRepository) {
            throw new Error("Year repository not initialized. Call initializeRepository() first.");
        }
        return this.yearRepository;
    }
    async initializeRepository() {
        const dataSource = await this.dataSourceInstance.init(); // Ensure DataSource is initialized
        this.yearRepository = dataSource.getRepository(company_entity_1.CompMst);
    }
    async getAllCompaniesWithFilters(filters) {
        const queryBuilder = this._getRepository().createQueryBuilder('company');
        const filteredQueryBuilder = (0, query_utils_1.applyFilters)(queryBuilder, filters, 'company'); // Call the imported utility function
        const company = await filteredQueryBuilder.getMany();
        return company;
    }
    async getAllCompanies() {
        try {
            return this._getRepository().find();
        }
        catch (error) {
            throw new Error(error);
        }
    }
    async getCompanyById(id) {
        return this._getRepository().findOneBy({ id });
    }
}
exports.CompanyProvider = CompanyProvider;
