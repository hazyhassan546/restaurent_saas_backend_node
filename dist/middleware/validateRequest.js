"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAuthorizationHeader = exports.validateRequest = void 0;
const validateRequest = (schema, source = "body") => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues.map((issue) => ({
                    field: issue.path.join(".") || "request",
                    message: issue.message,
                })),
            });
            return;
        }
        req[source] = result.data;
        next();
    };
};
exports.validateRequest = validateRequest;
const validateAuthorizationHeader = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    next();
};
exports.validateAuthorizationHeader = validateAuthorizationHeader;
//# sourceMappingURL=validateRequest.js.map