//require('dotenv').config()
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import helmet from 'helmet';
import logger from 'morgan';
import router from './routes/index.js'
const app = express();

app.use(helmet())
app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use('/', router);



export default app;