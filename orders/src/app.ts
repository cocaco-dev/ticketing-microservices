import express from 'express';
import 'express-async-errors'

import cookieSession from 'cookie-session';

import {createOrderRouter} from './routes/new';
import {showOrderRouter} from './routes/show';
import {indexOrderRouter} from './routes'
import {deleteOrderRouter} from './routes/delete'

import {errorHandler,NotFoundError, currentUser} from '@microservices-loop/common'

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
    cookieSession({
        signed:false,
        secure:false
    })
)
app.use(currentUser);

app.use(createOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);


app.all('*', async (req, res) => {
    console.log('hi')
    throw new NotFoundError()
})
app.use(errorHandler);

export { app };
