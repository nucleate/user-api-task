import { Router } from 'express';
import { LazyProvider } from './common/providers';
import { Config } from './config';
import { createUserController } from './controllers/usersController';
import { UserService } from './services/usersService';
import { UserRepository } from './database/repo/userRepository';
import { DBReposotitory } from './database/repo/dbRepository';
import { User } from './database/models/user';

export class Container {
    constructor(readonly config: Config) {}

    readonly userRepository = new LazyProvider<DBReposotitory<User>>(() => {
        return new UserRepository({
            connectionString: this.config.dbConnectionString,
        });
    });

    readonly userService = new LazyProvider<UserService>(() => {
        return new UserService({
            userRepository: this.userRepository.provide(),
            topEarningsLimit: this.config.trackedTopEarningsLimit,
        });
    });

    readonly usersController = new LazyProvider<Router>(() => {
        return createUserController({
            service: this.userService.provide(),
        });
    });
}
