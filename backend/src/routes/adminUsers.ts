import express from 'express';
import { UserModel } from '../models/user'; // Import UserModel
import auth, { authorizeRoles } from '../middleware/auth'; // Import auth and authorizeRoles

const router = express.Router();

// Get all users (including passengers)
router.get('/', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await UserModel.find().select('-password'); // Exclude password
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single user by ID
router.get('/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new user (admin can create users)
router.post('/', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = new UserModel(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a user
router.put('/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user
router.delete('/:id', auth, authorizeRoles('admin'), async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
