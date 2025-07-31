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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _FeatureController_instances, _FeatureController_getFeatures, _FeatureController_addFeatures, _FeatureController_editFeatures, _FeatureController_deleteFeatures;
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const feature_service_1 = __importDefault(require("../services/feature.service"));
let FeatureController = class FeatureController {
    constructor(featuresService) {
        _FeatureController_instances.add(this);
        this.featuresService = featuresService;
        this.handleRequest = this.handleRequest.bind(this); // Bind if you need 'this' context
        this.handlers = {
            'GET': __classPrivateFieldGet(this, _FeatureController_instances, "m", _FeatureController_getFeatures).bind(this), // Bind 'this' context
            'POST': __classPrivateFieldGet(this, _FeatureController_instances, "m", _FeatureController_addFeatures).bind(this),
            'PUT': __classPrivateFieldGet(this, _FeatureController_instances, "m", _FeatureController_editFeatures).bind(this),
            'DELETE': __classPrivateFieldGet(this, _FeatureController_instances, "m", _FeatureController_deleteFeatures).bind(this)
        };
    }
    async handleRequest(req, res, next) {
        try {
            await this.featuresService.fileService.initialize(); // Re-initialize for each request if you want live file changes (not recommended for performance in prod)
            const { method } = req;
            if (this.handlers[method]) {
                await this.handlers[method](req, res);
            }
            else {
                throw new Error('Invalid request method');
            }
        }
        catch (error) {
            next(error);
        }
    }
};
_FeatureController_instances = new WeakSet();
_FeatureController_getFeatures = async function _FeatureController_getFeatures(req, res) {
    const data = this.featuresService.fileService.model.read();
    res.json({ success: true, data });
};
_FeatureController_addFeatures = async function _FeatureController_addFeatures(req, res) {
    const { servicename, value } = req.body; // Assuming value is boolean
    if (typeof value !== 'boolean' || !servicename) {
        res.status(400).json({ success: false, message: 'Invalid request body. servicename (string) and value (boolean) are required.' });
        return;
    }
    try {
        this.featuresService.fileService.model.add(servicename, value);
        await this.featuresService.fileService.save();
        res.json({ success: true });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message }); // Send error message to client
    }
};
_FeatureController_editFeatures = async function _FeatureController_editFeatures(req, res) {
    const { servicename, value } = req.body; // Assuming value is boolean
    if (typeof value !== 'boolean' || !servicename) {
        res.status(400).json({ success: false, message: 'Invalid request body. servicename (string) and value (boolean) are required.' });
        return;
    }
    try {
        this.featuresService.fileService.model.edit(servicename, value);
        await this.featuresService.fileService.save();
        res.json({ success: true });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message }); // Key not found error
    }
};
_FeatureController_deleteFeatures = async function _FeatureController_deleteFeatures(req, res) {
    const { servicename } = req.body;
    if (!servicename) {
        res.status(400).json({ success: false, message: 'Invalid request body. servicename (string) is required.' });
        return;
    }
    try {
        this.featuresService.fileService.model.delete(servicename);
        await this.featuresService.fileService.save();
        res.json({ success: true });
    }
    catch (error) {
        res.status(404).json({ success: false, message: error.message }); // Key not found error
    }
};
FeatureController = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)(feature_service_1.default)),
    __metadata("design:paramtypes", [feature_service_1.default])
], FeatureController);
exports.default = FeatureController;
