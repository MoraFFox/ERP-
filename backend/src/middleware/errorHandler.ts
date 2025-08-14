import { Request, Response, NextFunction } from 'express';

interface ErrorResponse {
    message: string;
    stack?: string;
}

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    const error: ErrorResponse = {
        message: err.message,
    };

    if (process.env.NODE_ENV === 'development') {
        error.stack = err.stack;
    }

    res.status(500).json(error);
};

export default errorHandler;
