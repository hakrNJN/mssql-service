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
exports.PhoenixDataSource = void 0;
// src/providers/phoenix-data-source.provider.ts
const tsyringe_1 = require("tsyringe");
const typeorm_1 = require("typeorm");
const winston_1 = __importDefault(require("winston"));
const config_1 = require("../config/config");
const logger_1 = require("../utils/logger");
const DB_CONFIG = config_1.AppConfig.DB_CONFIG;
let PhoenixDataSource = class PhoenixDataSource {
    constructor(logger) {
        this._dataSource = null;
        this.logger = logger;
    }
    async init() {
        if (!this._dataSource) {
            this._dataSource = new typeorm_1.DataSource({
                type: DB_CONFIG.type,
                host: DB_CONFIG.host,
                port: Number(DB_CONFIG.port),
                username: DB_CONFIG.username,
                password: DB_CONFIG.password,
                database: 'pheonixDB', //DB_CONFIG.database,//Main Database
                synchronize: DB_CONFIG.synchronize,
                logging: DB_CONFIG.logging,
                entities: ["src/entity/phoenix/*.ts"], //[YearMst, CompMst],
                subscribers: [],
                migrations: [],
                connectionTimeout: 1500000,
                options: {
                    encrypt: false, // Ensure encryption is enabled (if desired and configured on server)
                    // cryptoCredentialsDetails: {
                    //     minVersion: 'TLSv1.2' // Or 'TLSv1' if 1.2 doesn't work, but prefer 1.2 or higher
                    // }
                },
            });
            try {
                await this._dataSource.initialize();
                this.logger.info("Phoenix Data Source has been initialized!");
            }
            catch (err) {
                this.logger.error("Error during Phoenix Data Source initialization", err);
                this._dataSource = null;
                throw err;
            }
        }
        return this._dataSource;
    }
    async close() {
        if (this._dataSource) {
            try {
                await this._dataSource.destroy();
                this.logger.info("Phoenix Data Source has been closed!");
                this._dataSource = null;
            }
            catch (err) {
                this.logger.error("Error during Phoenix Data Source closing", err);
                throw err;
            }
        }
        else {
            this.logger.info("Phoenix Data Source was already closed or not initialized.");
        }
    }
    getDataSource() {
        return this._dataSource;
    }
};
exports.PhoenixDataSource = PhoenixDataSource;
exports.PhoenixDataSource = PhoenixDataSource = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(logger_1.WINSTON_LOGGER)),
    __metadata("design:paramtypes", [winston_1.default.Logger])
], PhoenixDataSource);
