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
//src/privoders/fileService.provider.ts
const fs = __importStar(require("fs/promises"));
const yaml = __importStar(require("js-yaml"));
const tsyringe_1 = require("tsyringe");
const feature_model_1 = __importDefault(require("../model/feature.model"));
const logger_1 = require("../utils/logger");
let FileService = class FileService {
    constructor(filePath, logger) {
        this.filePath = filePath;
        this.model = new feature_model_1.default();
        this.logger = logger;
    }
    async initialize() {
        try {
            const fileContent = await fs.readFile(this.filePath, 'utf8');
            const config = yaml.load(fileContent); // Type assertion
            if (config && typeof config === 'object') {
                for (const key in config) {
                    if (Object.prototype.hasOwnProperty.call(config, key)) {
                        this.model.add(key, config[key]);
                    }
                }
            }
        }
        catch (error) {
            this.logger.error('Error initializing FileService:', error);
            throw error; // Re-throw to be caught by service/controller
        }
    }
    async save() {
        try {
            const yamlStr = yaml.dump(this.model.read());
            await fs.writeFile(this.filePath, yamlStr, 'utf8');
        }
        catch (error) {
            this.logger.error('Error saving FileService:', error);
            throw error; // Re-throw to be caught by service/controller
        }
    }
};
FileService = __decorate([
    __param(1, (0, tsyringe_1.inject)(logger_1.WINSTON_LOGGER)),
    __metadata("design:paramtypes", [String, Object])
], FileService);
exports.default = FileService;
