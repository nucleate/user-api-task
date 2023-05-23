import { Router } from 'express';
import { UserService } from '../services/usersService';
import { HTTPStatusCodes } from '../common/enums/statusCodes';

export type UserControllerConfig = {
    readonly service: UserService;
};

export const createUserController = (config: UserControllerConfig) => {
    const router = Router();
    const service = config.service;

    router.get('/', (_, res, next) => {
        service
            .getAllUsers()
            .then((users) => res.json(users))
            .catch(next);
    });

    router.get('/getAllDistinctCountries', (_, res, next) => {
        service
            .getAllDistinctCountries()
            .then((countries) => res.json(countries))
            .catch(next);
    });

    router.post('/', (req, res, next) => {
        const user = req.body;

        service
            .createUser(user)
            .then((user) => res.status(HTTPStatusCodes.CREATED).json(user))
            .catch(next);
    });

    router.get('/getAverageTopEarningsForCountries', (_, res, next) => {
        service
            .getAverageTopEarningsForCountries()
            .then((earnings) => res.json(earnings))
            .catch(next);
    });

    return router;
};
