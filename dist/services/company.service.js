"use strict";
//src/services/company.service.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const company_provider_1 = require("../providers/company.provider");
class CompanyService {
    constructor(dataSourceInstance) {
        this.dataSourceInstance = dataSourceInstance;
        this.companyProvider = new company_provider_1.CompanyProvider(this.dataSourceInstance);
    }
    async initialize() {
        await this.companyProvider.initializeRepository();
    }
    async getCompaniesWithFilters(filters) {
        return this.companyProvider.getAllCompaniesWithFilters(filters);
    }
    async getCompanyById(id) {
        return this.companyProvider.getCompanyById(id);
    }
    async getCompanies() {
        return this.companyProvider.getAllCompanies();
    }
}
exports.CompanyService = CompanyService;
