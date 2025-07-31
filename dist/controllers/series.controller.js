"use strict";
//src/controllers/series.controller.ts
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesController = void 0;
const config_1 = require("../config/config");
const stringDecorators_1 = require("../decorators/stringDecorators");
const httpException_1 = require("../exceptions/httpException");
const series_service_1 = require("../services/series.service");
const api_response_1 = require("../utils/api-response");
let SeriesController = class SeriesController {
    constructor(seriesService) {
        this.getAllSeries = async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            try {
                const result = await this.seriesService.getAllSeries();
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `All Avalable Series Retrived` // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Series not found`);
                }
            }
            catch (error) {
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        this.getSeriesById = async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const seriesId = parseInt(req.params.id);
            try {
                const result = await this.seriesService.getSeriesbyId(seriesId);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `Series retrived for id ${seriesId}` // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Series not found`);
                }
            }
            catch (error) {
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        this.getIrnSeries = async (req, res) => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            //getting required query params
            const { yearid, type, company } = req.query;
            //checking if required query params are present or not, and if not throw error
            if (!company) {
                throw httpException_1.HttpException.BadRequest(`Company is required`);
            }
            if (!type) {
                throw httpException_1.HttpException.BadRequest(`tyoe is required`);
            }
            if (!yearid) {
                throw httpException_1.HttpException.BadRequest(`yearId is required`);
            }
            //splitting company string into array
            const comp = this.stringToArray(company); //company!.split(',');
            //checking if type is D or C and setting typeCondition accordingly
            const typeCondition = (type.toLowerCase() === 'd') ? ["sale", "dr note"] : ["sale return", "cr note"];
            //creating and empty array for orConditions For AllowedCompany
            const orConditionsForCompany = [];
            //checking if company array is empty or not, if not then modifying orConditionsForCompany array
            if (comp && comp.length > 0) {
                comp.forEach(singleComp => {
                    orConditionsForCompany.push({
                        AllowComp: { like: `%\\${singleComp}\\%` }
                    });
                    orConditionsForCompany.push({
                        AllowComp: { equalNull: true }
                    });
                    orConditionsForCompany.push({
                        AllowComp: { equal: "\\" }
                    });
                });
            }
            else {
                //although this condition is not required as we are already checking if company is present or not, but still added for safety
                orConditionsForCompany.push({
                    AllowComp: { equalNull: true }
                });
                orConditionsForCompany.push({
                    AllowComp: { equal: "\\" }
                });
            }
            //getting allowed forms for sale series
            const allowedForms = config_1.AppConfig.allowedFormsForSaleSeries.map((form) => `/${form}/`);
            //now creating the actual filters object from the above conditions
            const filters = {
                YearId: { equal: parseInt(yearid) },
                Type: { in: typeCondition },
                Name: { notLike: 'Supplier%' },
                or: orConditionsForCompany,
                Status: { equal: 'T' },
                AcEffect: { equal: true },
                Allow_form: { in: allowedForms }
            };
            try {
                const result = await this.seriesService.getSeriesWithFilters(filters);
                if (result) {
                    api_response_1.ApiResponse.success({
                        res,
                        req,
                        data: result,
                        message: `IRN Series retrived` // Include pagination metadata
                    });
                }
                else {
                    throw httpException_1.HttpException.NotFound(`Series not found`);
                }
            }
            catch (error) {
                throw httpException_1.HttpException.InternalServerError(`Something Went Wrong`, error);
            }
        };
        this.seriesService = seriesService;
        this.seriesService.initialize();
    }
};
exports.SeriesController = SeriesController;
exports.SeriesController = SeriesController = __decorate([
    stringDecorators_1.stringDecorators,
    __metadata("design:paramtypes", [series_service_1.SeriesService])
], SeriesController);
