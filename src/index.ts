import express from 'express';
import { Container } from './ioc';
import { Config } from './config';
import { handleErrors } from './common/errorsHandler';

const ioc = new Container(new Config());
const app = express();

app.use(express.json());

app.use('/users', ioc.usersController.provide());

app.use(handleErrors);

app.listen(ioc.config.appPort, () => {
    const port = ioc.config.appPort;
    console.info(`App is running on http://localhost:${port}/`);
});
