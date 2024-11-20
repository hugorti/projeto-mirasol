import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors'
import router from './routes';
import cors from 'cors';

const app = express()
app.use(express.json());
app.use(cors())

app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Error) {
        // Se for uma instancia do tipo error
        return res.status(400).json({
            error: err.message
        });
    }

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

app.listen(3333, () => {
    console.log('Servidor online..');
});