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
exports.AuthzStrategyProvider = void 0;
var common_1 = require("@nestjs/common");
var passport_1 = require("@nestjs/passport");
var jwks_rsa_1 = require("jwks-rsa");
var passport_jwt_1 = require("passport-jwt");
var AuthzStrategyProvider = /** @class */ (function (_super) {
    __extends(AuthzStrategyProvider, _super);
    function AuthzStrategyProvider(authzConfigService) {
        var _this = _super.call(this, {
            secretOrKeyProvider: jwks_rsa_1.passportJwtSecret({
                jwksUri: authzConfigService.get('issuer') + ".well-known/jwks.json"
            }),
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            audience: authzConfigService.get('audience'),
            issuer: authzConfigService.get('issuer'),
            algorithms: ['RS256']
        }) || this;
        _this.authzConfigService = authzConfigService;
        _this.logger = new common_1.Logger(AuthzStrategyProvider_1.name);
        return _this;
    }
    AuthzStrategyProvider_1 = AuthzStrategyProvider;
    AuthzStrategyProvider.prototype.validate = function (token) {
        this.logger.debug({ message: 'Received request to guarded endpoint with token', token: token });
        return { token: token };
    };
    var AuthzStrategyProvider_1;
    AuthzStrategyProvider = AuthzStrategyProvider_1 = __decorate([
        common_1.Injectable()
    ], AuthzStrategyProvider);
    return AuthzStrategyProvider;
}(passport_1.PassportStrategy(passport_jwt_1.Strategy)));
exports.AuthzStrategyProvider = AuthzStrategyProvider;
