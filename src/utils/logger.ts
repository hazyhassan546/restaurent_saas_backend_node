import fs from "fs";
import path from "path";
import type { NextFunction, Request, Response } from "express";
import pino from "pino";
import pinoHttp from "pino-http";

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const logFile = path.join(logsDir, "app.log");
const destination = pino.destination({ dest: logFile, sync: false });

export const logger = pino(
    {
        level: process.env.LOG_LEVEL || "info",
        timestamp: pino.stdTimeFunctions.isoTime,
        base: { pid: false },
    },
    destination
);

export const requestLogger = pinoHttp({
    logger,
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
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
    },
    wrapSerializers: true,
});

export function responseLogger(req: Request, res: Response, next: NextFunction): void {
    const oldJson = res.json.bind(res);
    const oldSend = res.send.bind(res);

    const captureResponse = (body: unknown): void => {
        res.locals.responseBody = body;
    };

    res.json = (body: unknown): Response => {
        captureResponse(body);
        return oldJson(body);
    };

    res.send = (body?: any): Response => {
        captureResponse(body);
        return oldSend(body);
    };

    res.once("finish", () => {
        logger.info(
            {
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
            },
            "http transaction complete"
        );
    });

    next();
}
