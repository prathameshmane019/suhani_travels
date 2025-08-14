"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const auth_1 = require("../models/auth");
const auth_2 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { name, password, age, gender, phone } = req.body;
        if (!name || !phone || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        let user = await user_1.UserModel.findOne({ phone });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        user = new user_1.UserModel({ name, age, gender, phone });
        await user.save();
        const authUser = new auth_1.AuthModel({ userId: user._id, phone, password, role: 'passenger' });
        await authUser.save();
        const token = jsonwebtoken_1.default.sign({ id: user._id, role: 'passenger' }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token, user: { id: user._id, name: user.name, role: 'passenger', age: user.age, gender: user.gender, phone: user.phone } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Login
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        console.log(req.body);
        if (!identifier || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }
        let authUser = await auth_1.AuthModel.findOne({ $or: [{ phone: identifier }, { registrationNumber: identifier }] }).select('+password');
        if (!authUser || !(await authUser.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        if (authUser.role == 'passenger') {
            const user = await user_1.UserModel.findById(authUser.userId).select('name');
            authUser.name = user?.name;
        }
        // if (!user) {
        //   return res.status(401).json({ message: 'Invalid credentials' });
        // }
        const token = jsonwebtoken_1.default.sign({ id: authUser._id, role: authUser.role }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Logged in successfully', token, user: { id: authUser._id, name: authUser.name, role: authUser.role } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Get current user details (protected route)
router.get('/me', auth_2.default, async (req, res) => {
    try {
        console.log(req.user);
        const authUser = await auth_1.AuthModel.findById(req.user.id);
        let user;
        if (req.user.role === 'passenger') {
            user = await user_1.UserModel.findById(authUser?.userId);
            console.log(user);
            return res.json({ user });
        }
        console.log(authUser);
        res.json({ authUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map