"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class FeaturesModel {
    constructor() {
        this.features = {};
        this.features = {};
    }
    read() {
        return this.features;
    }
    add(key, value) {
        if (!key || value === undefined) {
            throw new Error('Key or value is missing');
        }
        this.features[key] = value;
    }
    edit(key, value) {
        if (!key || value === undefined) {
            throw new Error('Key or value is missing');
        }
        if (!this.features[key]) {
            throw new Error('Key not found');
        }
        this.features[key] = value;
    }
    delete(key) {
        if (!key) {
            throw new Error('Key is missing');
        }
        if (!this.features[key]) {
            throw new Error('Key not found');
        }
        delete this.features[key];
    }
}
exports.default = FeaturesModel;
