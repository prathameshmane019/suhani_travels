import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthModel } from '../models/auth';
import { IUserDocument } from '../models/user';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

export interface IAuthUser extends IUserDocument {
  role: 'passenger' | 'admin' | 'agent';
}

interface AuthRequest extends Request {
  user?: IAuthUser;
}

const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token not found' });
    } 
    try {
      const decoded: any = jwt.verify(token, JWT_SECRET);
      console.log(decoded);
      const authUser = await AuthModel.findById(decoded.id );
      if (!authUser) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      req.user = { ...decoded, role: authUser.role } as IAuthUser;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have the necessary permissions to access this resource.' });
    }
    next();
  };
};

export default auth;
