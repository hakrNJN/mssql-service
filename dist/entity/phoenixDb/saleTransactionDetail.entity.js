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
exports.SaleTransactionDetails = void 0;
const typeorm_1 = require("typeorm");
const saleTransaction_entity_1 = require("./saleTransaction.entity");
// @Entity({ name: "SaleTransactionDetail", database: "pheonixdb", schema: "dbo" })  // Map the entity to the view name wit database and schema
let SaleTransactionDetails = class SaleTransactionDetails {
};
exports.SaleTransactionDetails = SaleTransactionDetails;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransactionDetails.prototype, "SalTrnId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "Srno", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransactionDetails.prototype, "Quality", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransactionDetails.prototype, "CatelogName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransactionDetails.prototype, "ProductDescription", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "HSNCode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransactionDetails.prototype, "PkgType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransactionDetails.prototype, "Unit", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "Qnty", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "Rate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "ItemGrossAmt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "DisPer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "Discount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "TaxableAmount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "TaxRate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "IGSTRate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "IGSTAmount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "CGSTRate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "CGSTAmount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "SGSTRate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransactionDetails.prototype, "SGSTAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => saleTransaction_entity_1.SaleTransaction, (saleTransaction) => saleTransaction.products),
    (0, typeorm_1.JoinColumn)({ name: "SalTrnId" }),
    __metadata("design:type", saleTransaction_entity_1.SaleTransaction)
], SaleTransactionDetails.prototype, "saleTransaction", void 0);
exports.SaleTransactionDetails = SaleTransactionDetails = __decorate([
    (0, typeorm_1.Entity)("SaleTransactionDetails") // Map the entity to the view name wit database and schema
], SaleTransactionDetails);
