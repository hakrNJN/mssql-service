"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
//src/services/feature.service.ts
const fs = __importStar(require("fs"));
const path_1 = require("path");
const tsyringe_1 = require("tsyringe"); // Import 'inject'
const winston_1 = __importDefault(require("winston"));
const appException_1 = require("../exceptions/appException");
const fileService_provider_1 = __importDefault(require("../providers/fileService.provider")); // Keep import for type, or remove if only using interface
const logger_1 = require("../utils/logger");
let FeaturesService = class FeaturesService {
    constructor(fileService, logger // Inject Logger
    ) {
        this.features = {};
        this.filePath = (0, path_1.join)(__dirname, '../config', 'feature.config.yml');
        this.fileService = fileService;
        this.features = {};
        this.logger = logger;
        this.initializeFileWatcher(); // Then call initializeFileWatcher, logger will be defined
    }
    async initialize() {
        await this.loadFeatures();
    }
    initializeFileWatcher() {
        fs.watchFile(this.filePath, { interval: 1000 }, async (curr, prev) => {
            if (curr.mtimeMs !== prev.mtimeMs) {
                this.logger.info('Feature config file changed. Reloading features...');
                try {
                    await this.reloadFeatures();
                    this.logger.info('Features reloaded successfully.');
                }
                catch (error) {
                    this.logger.error('Error reloading features after file change:', error);
                }
            }
        });
        this.logger.info(`Watching for changes in feature config file: ${this.filePath}`);
    }
    async reloadFeatures() {
        try {
            await this.fileService.initialize();
            this.features = this.fileService.model.read();
        }
        catch (error) {
            this.logger.error('Error reloading features in FeaturesService:', error);
            throw new appException_1.AppError(500, "Unable to reload features configuration");
        }
    }
    async loadFeatures() {
        try {
            await this.fileService.initialize();
            this.features = this.fileService.model.read();
        }
        catch (error) {
            this.logger.error('Error loading features in FeaturesService:', error);
            throw new appException_1.AppError(500, "Unable to load features configuration");
        }
    }
    getFeatures() {
        return this.features;
    }
    isFeatureEnabled(featureName) {
        return !!this.features[featureName];
    }
};
FeaturesService = __decorate([
    (0, tsyringe_1.injectable)(),
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)(fileService_provider_1.default)),
    __param(1, (0, tsyringe_1.inject)(logger_1.WINSTON_LOGGER)),
    __metadata("design:paramtypes", [Object, winston_1.default.Logger // Inject Logger
    ])
], FeaturesService);
exports.default = FeaturesService;
