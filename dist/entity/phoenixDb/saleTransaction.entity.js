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
exports.SaleTransaction = void 0;
const typeorm_1 = require("typeorm");
const saleTransactionDetail_entity_1 = require("./saleTransactionDetail.entity");
// @Entity({ name: "SaleTransactions", database: "pheonixdb", schema: "dbo" })  // Map the entity to the view name
let SaleTransaction = class SaleTransaction {
};
exports.SaleTransaction = SaleTransaction;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "CustomerID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CustomerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CustomerGstin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CustomerAdd1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CustomerAdd2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CustomerCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CustomerState", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "CustomerStateCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "CustomerPin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "PinToPinDistance", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CustomerPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CustomerMobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CustomerEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "ShippingID", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "ShippingName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "ShippingGstin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "ShippingAdd1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "ShippingAdd2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "ShippingCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "ShippingState", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "ShippingStateCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "ShippingPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "shippingMobile", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "AgentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "AgentName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "AgentAdd1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "AgentAdd2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "AgentCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "AgentPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "AgentMobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "AgentEmail", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "CompanyId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyGstin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyAdd1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyAdd2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyCity", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyState", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "CompanyStateCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "CompanyPin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "CompanyMobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "CompanyPhone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyPan", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyTin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyCin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "CompanyAccNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyBank", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyBranch", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "CompanyIfscCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "DeliveryPlace", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "TransportID", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "TransporterName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "TransporterGstin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "LogisticReceiptNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], SaleTransaction.prototype, "LogisticReceiptDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "ParcelCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "Remark", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "BillType", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)() //@Column()
    ,
    __metadata("design:type", Number)
], SaleTransaction.prototype, "SalTrnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], SaleTransaction.prototype, "Date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "Vno", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "InvNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "Dhara", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "DueDays", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "BillAmount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "NetAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "RefBillNo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], SaleTransaction.prototype, "RefBillDate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "TotalPcs", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "Addless", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "TotalGST", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "CGSTAmount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "SGSTAmount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "IGSTAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "AlSr1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "Caption1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "AlExp1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "AlRefAmt1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "AlValue1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "AlAmount1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "AlSr2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "Caption2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "AlExp2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "AlRefAmt2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "AlValue2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "AlAmount2", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "Type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "Series", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "PackingSeries", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "RefId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "Book", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "TrnOrigin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "TrnMode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "OthRmk", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "UserName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], SaleTransaction.prototype, "LrUpdatedOn", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SaleTransaction.prototype, "IsService", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Number)
], SaleTransaction.prototype, "Ewayid", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], SaleTransaction.prototype, "EWayDat", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleTransaction.prototype, "IRN", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], SaleTransaction.prototype, "YearStart", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], SaleTransaction.prototype, "YearENd", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => saleTransactionDetail_entity_1.SaleTransactionDetails, (saleTransactionDetail) => saleTransactionDetail.saleTransaction),
    __metadata("design:type", Array)
], SaleTransaction.prototype, "products", void 0);
exports.SaleTransaction = SaleTransaction = __decorate([
    (0, typeorm_1.Entity)("SaleTransaction") // Map the entity to the view name
], SaleTransaction);
