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
exports.SpTblFinishInWardOutWard = void 0;
const typeorm_1 = require("typeorm");
const purchasePipeLine_entity_1 = require("../phoenixDb/purchasePipeLine.entity");
let SpTblFinishInWardOutWard = class SpTblFinishInWardOutWard {
    ;
};
exports.SpTblFinishInWardOutWard = SpTblFinishInWardOutWard;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "Conum", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "Type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "Vno", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], SpTblFinishInWardOutWard.prototype, "Dat", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "BillNo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "Series", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "LRCase", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "LRNo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "Transport", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "Customer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "Category", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], SpTblFinishInWardOutWard.prototype, "GRPName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], SpTblFinishInWardOutWard.prototype, "Add1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], SpTblFinishInWardOutWard.prototype, "Add2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], SpTblFinishInWardOutWard.prototype, "City", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], SpTblFinishInWardOutWard.prototype, "State", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], SpTblFinishInWardOutWard.prototype, "Mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], SpTblFinishInWardOutWard.prototype, "Phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], SpTblFinishInWardOutWard.prototype, "ConsPerson", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "BillAmount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "NetAmt", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "Qualid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "Baseid", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "Item", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "Quality", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "DesignNo", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "AgentName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "AgentCity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "TrnMode", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "TrnOrigin", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "Book", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "AgentId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "AccountID", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "RefId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "Pcs", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "Mtr", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "Rate", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "Amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "Plain", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "Company", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], SpTblFinishInWardOutWard.prototype, "CAdd1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Object)
], SpTblFinishInWardOutWard.prototype, "CAdd2", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "BalPcs", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "BalMtr", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "CmpType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "SiteName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SpTblFinishInWardOutWard.prototype, "SchdName", void 0);
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SpTblFinishInWardOutWard.prototype, "PurtrnId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchasePipeLine_entity_1.PurchasePipeLine, purchasePipeline => purchasePipeline.finishInWards) // Add inverse relation
    ,
    (0, typeorm_1.JoinColumn)([
        { name: "Purtrnid", referencedColumnName: "Purtrnid" }, // Join on Purtrnid
        { name: "Type", referencedColumnName: "Type" } // Join on Type
    ]),
    __metadata("design:type", purchasePipeLine_entity_1.PurchasePipeLine)
], SpTblFinishInWardOutWard.prototype, "purchasePipeline", void 0);
exports.SpTblFinishInWardOutWard = SpTblFinishInWardOutWard = __decorate([
    (0, typeorm_1.Entity)("SpTblFinishInWardOutWard")
], SpTblFinishInWardOutWard);
