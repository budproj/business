"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.GraphQLTokenGuard = void 0;
var common_1 = require("@nestjs/common");
var execution_context_host_1 = require("@nestjs/core/helpers/execution-context-host");
var graphql_1 = require("@nestjs/graphql");
var passport_1 = require("@nestjs/passport");
var GraphQLTokenGuard = /** @class */ (function (_super) {
    __extends(GraphQLTokenGuard, _super);
    function GraphQLTokenGuard() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.logger = new common_1.Logger(GraphQLTokenGuard_1.name);
        return _this;
    }
    GraphQLTokenGuard_1 = GraphQLTokenGuard;
    GraphQLTokenGuard.prototype.canActivate = function (executionContext) {
        var _this = this;
        var graphqlContext = graphql_1.GqlExecutionContext.create(executionContext);
        var request = graphqlContext.getContext().req;
        var guardRequest = function () { return _super.prototype.canActivate.call(_this, new execution_context_host_1.ExecutionContextHost([request])); };
        this.logger.debug({
            message: 'Evaluating if we should allow request'
        });
        return guardRequest();
    };
    var GraphQLTokenGuard_1;
    GraphQLTokenGuard = GraphQLTokenGuard_1 = __decorate([
        common_1.Injectable()
    ], GraphQLTokenGuard);
    return GraphQLTokenGuard;
}(passport_1.AuthGuard('jwt')));
exports.GraphQLTokenGuard = GraphQLTokenGuard;
