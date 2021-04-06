"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GraphQLOptionsFactory = void 0;
var common_1 = require("@nestjs/common");
var GraphQLOptionsFactory = /** @class */ (function () {
    function GraphQLOptionsFactory(graphqlConfigService) {
        this.graphqlConfigService = graphqlConfigService;
    }
    GraphQLOptionsFactory.prototype.createGqlOptions = function () {
        var debug = this.graphqlConfigService.get('debug');
        var playground = this.graphqlConfigService.get('playground');
        var introspection = this.graphqlConfigService.get('introspection');
        var schema = this.graphqlConfigService.get('schema');
        return {
            debug: debug.enabled,
            playground: playground.enabled,
            introspection: introspection.enabled,
            autoSchemaFile: schema.filePath,
            useGlobalPrefix: true
        };
    };
    GraphQLOptionsFactory = __decorate([
        common_1.Injectable()
    ], GraphQLOptionsFactory);
    return GraphQLOptionsFactory;
}());
exports.GraphQLOptionsFactory = GraphQLOptionsFactory;
