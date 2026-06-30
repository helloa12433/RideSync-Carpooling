"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const shared_utils_1 = require("@carpool/shared-utils");
const cassandra_1 = require("./config/cassandra");
const kafka_1 = require("./config/kafka");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use(shared_utils_1.tracingMiddleware);
app.use('/auth', auth_routes_1.default);
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Auth Service' });
});
app.use(auth_middleware_1.errorHandler);
const startServer = async () => {
    try {
        await (0, cassandra_1.connectCassandra)();
        await (0, kafka_1.connectKafka)();
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            console.log(`Auth Service running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start auth service', error);
    }
};
startServer();
