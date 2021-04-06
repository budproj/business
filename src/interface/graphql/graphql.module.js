"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GraphQLModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var graphql_1 = require("@nestjs/graphql");
var graphql_factory_1 = require("@config/graphql/graphql.factory");
var options_factory_1 = require("./options.factory");
var user_resolver_1 = require("./resolvers/user.resolver");
var GraphQLModule = /** @class */ (function () {
    function GraphQLModule() {
    }
    GraphQLModule = __decorate([
        common_1.Module({
            imports: [
                graphql_1.GraphQLModule.forRootAsync({
                    imports: [config_1.ConfigModule.forFeature(graphql_factory_1.createGraphQLConfig)],
                    useClass: options_factory_1.GraphQLOptionsFactory
                }),
            ],
            providers: [user_resolver_1.UserGraphQLResolver]
        })
    ], GraphQLModule);
    return GraphQLModule;
}());
exports.GraphQLModule = GraphQLModule;
