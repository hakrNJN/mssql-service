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
exports.Vwkotakcmsonline = void 0;
// src/entity/anushree/KotakCMS.entity.ts
const typeorm_1 = require("typeorm"); // Import JoinColumn, ManyToOne
const series_entity_1 = require("./series.entity"); // Assuming SerMst entity is in SerMst.entity.ts
let Vwkotakcmsonline = class Vwkotakcmsonline {
};
exports.Vwkotakcmsonline = Vwkotakcmsonline;
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Client_Code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Product_Code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Payment_Type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Payment_Ref_No", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", }),
    __metadata("design:type", Date)
], Vwkotakcmsonline.prototype, "Payment_Date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date", nullable: true }),
    __metadata("design:type", Date)
], Vwkotakcmsonline.prototype, "Instrument_Date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Dr_Ac_No", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Vwkotakcmsonline.prototype, "Amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Bank_Code_Indicator", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Beneficiary_Code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Beneficiary_Name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Beneficiary_Bank", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'Beneficiary_Bank/IFSC_Code', nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Beneficiary_Branch_IFSC_Code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Beneficiary_Acc_No", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Location", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Print_Location", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Instrument_Number", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Ben_Add1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Ben_Add2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Ben_Add3", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Ben_Add4", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Beneficiary_Email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Beneficiary_Mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Debit_Narration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Credit_Narration", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Payment_Details_1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Payment_Details_2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Payment_Details_3", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Payment_Details_4", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_3", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_4", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_5", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_6", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_7", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_8", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_9", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_10", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_11", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_12", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_13", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_14", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_15", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_16", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_17", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_18", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_19", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Enrichment_20", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Vwkotakcmsonline.prototype, "YearId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Vwkotakcmsonline.prototype, "Type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vwkotakcmsonline.prototype, "Conum", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], Vwkotakcmsonline.prototype, "vno", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => series_entity_1.SerMst, serMst => serMst.vwkotakcmsonlineEntries),
    (0, typeorm_1.JoinColumn)([
        { name: "Type", referencedColumnName: "id" }, // Vwkotakcmsonline.Type links to SerMst.id
        { name: "YearId", referencedColumnName: "YearId" } // Vwkotakcmsonline.YearId links to SerMst.YearId
    ]),
    __metadata("design:type", series_entity_1.SerMst)
], Vwkotakcmsonline.prototype, "seriesMaster", void 0);
exports.Vwkotakcmsonline = Vwkotakcmsonline = __decorate([
    (0, typeorm_1.Entity)("Vwkotakcmsonline")
], Vwkotakcmsonline);
