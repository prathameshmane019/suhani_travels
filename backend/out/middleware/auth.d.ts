import { Request, Response, NextFunction } from 'express';
import { IUserDocument } from '../models/user';
export interface IAuthUser extends IUserDocument {
    role: 'passenger' | 'admin' | 'agent';
}
interface AuthRequest extends Request {
    user?: IAuthUser;
}
declare const auth: (req: AuthRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const authorizeRoles: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default auth;
//# sourceMappingURL=auth.d.ts.map