import multer from 'multer';
import express from 'express';
export declare const upload: multer.Multer;
export declare const handleMulterError: (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => express.Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=multer.d.ts.map