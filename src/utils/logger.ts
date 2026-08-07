import fs from "fs";
import path from "path";
import { Writable } from "stream";
import type { NextFunction, Request, Response } from "express";
import pino from "pino";
import pinoHttp from "pino-http";

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

class DailyFileStream extends Writable {
    private currentDate: string;
    private filePath: string;
    private fd: number | null = null;

    constructor(private readonly directory: string) {
        super();
        this.currentDate = this.getDateKey();
        this.filePath = path.join(directory, `app-${this.currentDate}.log`);
        this.fd = fs.openSync(this.filePath, "a");
    }

    private getDateKey(date = new Date()): string {
        return date.toISOString().slice(0, 10);
    }

    private rotateIfNeeded(): void {
        const today = this.getDateKey();
        if (today === this.currentDate) {
            return;
        }

        if (this.fd !== null) {
            fs.closeSync(this.fd);
        }

        this.currentDate = today;
        this.filePath = path.join(this.directory, `app-${this.currentDate}.log`);
        this.fd = fs.openSync(this.filePath, "a");
    }

    _write(chunk: Buffer | string, _encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        this.rotateIfNeeded();

        if (this.fd === null) {
            callback(new Error("Log file handle is not available"));
            return;
        }

        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk, _encoding);
        fs.writeSync(this.fd, buffer);
        callback();
    }

    _final(callback: (error?: Error | null) => void): void {
        if (this.fd !== null) {
            fs.closeSync(this.fd);
            this.fd = null;
        }
        callback();
    }
}

const destination = new DailyFileStream(logsDir);

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
