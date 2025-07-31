"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataSourceService = void 0;
// src/services/dataSource.service.ts
const tsyringe_1 = require("tsyringe"); // If using tsyringe or similar DI
const winston_1 = __importDefault(require("winston"));
const data_source_provider_1 = require("../providers/data-source.provider");
const phoenix_data_source_provider_1 = require("../providers/phoenix.data-source.provider");
const logger_1 = require("../utils/logger");
let DataSourceService = class DataSourceService {
    constructor(appDataSource, phoenixDataSource, logger) {
        this.appDataSource = appDataSource;
        this.phoenixDataSource = phoenixDataSource;
        this.logger = logger;
    }
    async initializeDataSources() {
        await this.appDataSource.init();
        await this.phoenixDataSource.init();
        this.logger.info("DataSources initialized!");
    }
    getAppDataSource() {
        return this.appDataSource;
    }
    getPhoenixDataSource() {
        return this.phoenixDataSource;
    }
};
exports.DataSourceService = DataSourceService;
exports.DataSourceService = DataSourceService = __decorate([
    (0, tsyringe_1.injectable)() // or @singleton() with tsyringe
    ,
    __param(0, (0, tsyringe_1.inject)(data_source_provider_1.AppDataSource)),
    __param(1, (0, tsyringe_1.inject)(phoenix_data_source_provider_1.PhoenixDataSource)),
    __param(2, (0, tsyringe_1.inject)(logger_1.WINSTON_LOGGER)),
    __metadata("design:paramtypes", [data_source_provider_1.AppDataSource,
        phoenix_data_source_provider_1.PhoenixDataSource, winston_1.default.Logger])
], DataSourceService);
