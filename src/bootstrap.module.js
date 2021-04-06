"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BootstrapModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var app_factory_1 = require("@config/app.factory");
var infrastructure_module_1 = require("./infrastructure/infrastructure.module");
var interface_module_1 = require("./interface/interface.module");
var BootstrapModule = /** @class */ (function () {
    function BootstrapModule() {
    }
    BootstrapModule = __decorate([
        common_1.Module({
            imports: [config_1.ConfigModule.forFeature(app_factory_1.createAppConfig), interface_module_1.InterfaceModule, infrastructure_module_1.InfrastructureModule]
        })
    ], BootstrapModule);
    return BootstrapModule;
}());
exports.BootstrapModule = BootstrapModule;
