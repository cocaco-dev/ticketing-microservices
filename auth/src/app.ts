import express from 'express';
import 'express-async-errors'

import cookieSession from 'cookie-session';


import {currentUserRouter} from './routes/current-user';
import {signInRouter} from './routes/signin';
import {signOutRouter} from './routes/signout';
import {signUpRouter} from './routes/signup';

import {errorHandler,NotFoundError} from '@microservices-loop/common'

const app = express();
app.set('trust proxy', true);
app.use(express.json());
app.use(
    cookieSession({
        signed:false,
        secure:false
    })
)

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);


app.all('*', async (req, res) => {
    console.log('hi')
    throw new NotFoundError()
})
app.use(errorHandler);

export { app };
