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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasePipeLine = void 0;
const typeorm_1 = require("typeorm");
const spTblFinishInWardOutWard_entity_1 = require("../anushreeDb/spTblFinishInWardOutWard.entity");
let PurchasePipeLine = class PurchasePipeLine {
};
exports.PurchasePipeLine = PurchasePipeLine;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchasePipeLine.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PurchasePipeLine.prototype, "Purtrnid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PurchasePipeLine.prototype, "Type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], PurchasePipeLine.prototype, "Vno", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], PurchasePipeLine.prototype, "Dat", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchasePipeLine.prototype, "BillNo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchasePipeLine.prototype, "Customer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchasePipeLine.prototype, "City", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], PurchasePipeLine.prototype, "GroupName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchasePipeLine.prototype, "AgentName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PurchasePipeLine.prototype, "BillAmt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchasePipeLine.prototype, "Comapny", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PurchasePipeLine.prototype, "LRNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], PurchasePipeLine.prototype, "Lrdat", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], PurchasePipeLine.prototype, "ReceiveDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime', nullable: true }),
    __metadata("design:type", Object)
], PurchasePipeLine.prototype, "OpenDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], PurchasePipeLine.prototype, "Entrydate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'datetime' }),
    __metadata("design:type", Date)
], PurchasePipeLine.prototype, "UpdDate", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => spTblFinishInWardOutWard_entity_1.SpTblFinishInWardOutWard, finishInWard => finishInWard.purchasePipeline),
    __metadata("design:type", Array)
], PurchasePipeLine.prototype, "finishInWards", void 0);
exports.PurchasePipeLine = PurchasePipeLine = __decorate([
    (0, typeorm_1.Entity)('PurchasePipeLine')
], PurchasePipeLine);
