"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerAutoshiftSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.triggerAutoshiftSchema = joi_1.default.object({
    rideId: joi_1.default.string().uuid().required(),
    driverId: joi_1.default.string().uuid().required(),
    reason: joi_1.default.string().valid('DRIVER_OFFLINE', 'DRIVER_CANCELLED', 'VEHICLE_BREAKDOWN', 'ENGINE_FAILURE', 'TYRE_PUNCTURE', 'DRIVER_ACCIDENT', 'DRIVER_EMERGENCY', 'RIDE_EMERGENCY').required(),
});
