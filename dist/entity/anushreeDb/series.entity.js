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
exports.SerMst = void 0;
// src/entity/anushree/SerMst.entity.ts
const typeorm_1 = require("typeorm");
const kotakCMS_entity_1 = require("./kotakCMS.entity"); // Import Vwkotakcmsonline
let SerMst = class SerMst {
};
exports.SerMst = SerMst;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SerMst.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SerMst.prototype, "Name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SerMst.prototype, "Type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], SerMst.prototype, "YearId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SerMst.prototype, "Allow_form", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SerMst.prototype, "AllowComp", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SerMst.prototype, "Status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SerMst.prototype, "Remark", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SerMst.prototype, "Suffix", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'bit', nullable: true, default: 1 }),
    __metadata("design:type", Boolean)
], SerMst.prototype, "AcEffect", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => kotakCMS_entity_1.Vwkotakcmsonline, vwkotakcmsonline => vwkotakcmsonline.seriesMaster),
    __metadata("design:type", Array)
], SerMst.prototype, "vwkotakcmsonlineEntries", void 0);
exports.SerMst = SerMst = __decorate([
    (0, typeorm_1.Entity)("SerMst")
], SerMst);
