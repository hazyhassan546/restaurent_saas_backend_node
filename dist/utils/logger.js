"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.logger = void 0;
exports.responseLogger = responseLogger;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pino_1 = __importDefault(require("pino"));
const pino_http_1 = __importDefault(require("pino-http"));
const logsDir = path_1.default.join(process.cwd(), "logs");
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
const logFile = path_1.default.join(logsDir, "app.log");
const destination = pino_1.default.destination({ dest: logFile, sync: false });
exports.logger = (0, pino_1.default)({
    level: process.env.LOG_LEVEL || "info",
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
    base: { pid: false },
}, destination);
exports.requestLogger = (0, pino_http_1.default)({
    logger: exports.logger,
    customLogLevel: (req, res, err) => {
        if (res.statusCode >= 500 || err) {
            return "error";
        }
        if (res.statusCode >= 400) {
            return "warn";
        }
        return "info";
    },
    serializers: {
        req: pino_1.default.stdSerializers.req,
        res: pino_1.default.stdSerializers.res,
    },
    wrapSerializers: true,
});
function responseLogger(req, res, next) {
    const oldJson = res.json.bind(res);
    const oldSend = res.send.bind(res);
    const captureResponse = (body) => {
        res.locals.responseBody = body;
    };
    res.json = (body) => {
        captureResponse(body);
        return oldJson(body);
    };
    res.send = (body) => {
        captureResponse(body);
        return oldSend(body);
    };
    res.once("finish", () => {
        exports.logger.info({
            request: {
                method: req.method,
                url: req.originalUrl,
                headers: req.headers,
                body: req.body,
            },
            response: {
                statusCode: res.statusCode,
                headers: res.getHeaders(),
                body: res.locals.responseBody,
            },
        }, "http transaction complete");
    });
    next();
}
//# sourceMappingURL=logger.js.map