"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../models/auth");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const auth = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, token not found' });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const authUser = await auth_1.AuthModel.findById(decoded.id);
            if (!authUser) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }
            req.user = { ...decoded, role: authUser.role };
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions to access this resource.' });
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
exports.default = auth;
//# sourceMappingURL=auth.js.map