import express from 'express';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/user';
import { AuthModel, IAuthDocument } from '../models/auth';
import auth from '../middleware/auth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, password, age, gender, phone } = req.body;
    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }

    let user = await UserModel.findOne({ phone });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new UserModel({ name, age, gender, phone });
    await user.save();

    const authUser = new AuthModel({ userId: user._id, phone, password, role: 'passenger' });
    await authUser.save();

    const token = jwt.sign({ id: user._id, role: 'passenger' }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token, user: { id: user._id, name: user.name, role: 'passenger', age:user.age, gender:user.gender, phone:user.phone } });
  } catch (error) {
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

    let authUser = await AuthModel.findOne( 
      { $or: [ { phone: identifier }, { registrationNumber: identifier } ] }  ).select('+password') as IAuthDocument;
    

    if (!authUser || !(await authUser.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if(authUser.role == 'passenger'){
      const user = await UserModel.findById(authUser.userId).select('name');
      authUser.name = user?.name as string;
    }
    // if (!user) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }

    const token = jwt.sign({ id: authUser._id, role: authUser.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Logged in successfully', token, user: { id: authUser._id, name: authUser.name, role: authUser.role } });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get current user details (protected route)
router.get('/me', auth, async (req: any, res) => {
  try {
    console.log("User from middleware",req.user);
     const authUser = await AuthModel.findById(req.user.id)
   console.log("Auth user from db",authUser);
    let user;
    if (req.user.role === 'passenger') {
     user = await UserModel.findById(authUser?.userId);
     console.log(user);
     return res.json({user}); 
    }

    //  console.log(authUser);
    res.json({ user: authUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;