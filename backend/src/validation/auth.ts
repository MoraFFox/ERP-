import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    username: z.string().min(3),
    fullName: z.string().optional(),
});

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        userSchema.parse(req.body);
        next();
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ errors: error.errors });
        } else {
            next(error);
        }
    }
};
