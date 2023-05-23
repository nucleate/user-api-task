import { createIdGenerator } from '../../utils/math';
import { User } from '../models/user';
import { DBReposotitory } from './dbRepository';
import * as fs from 'fs';

export type UserRepositoryConfig = {
    readonly connectionString: string;
};

export class UserRepository extends DBReposotitory<User> {
    private readonly userIdGenerator: () => number;

    constructor(config: UserRepositoryConfig) {
        //filename is a connection string on abstract level
        super(config.connectionString);
        this.userIdGenerator = createIdGenerator(101);
    }

    async findAll(): Promise<Array<User>> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.connectionString, 'utf-8', (err, data) => {
                if (err) reject(err);
                resolve(JSON.parse(data));
            });
        });
    }

    async create(userDto: Omit<User, 'id'>): Promise<User> {
        const newUser = { id: this.userIdGenerator(), ...userDto };
        const users = await this.findAll();
        users.push(newUser);

        return new Promise((resolve, reject) => {
            fs.writeFile(
                this.connectionString,
                JSON.stringify(users),
                'utf-8',
                (error) => {
                    if (error) reject(error);
                    resolve(newUser);
                }
            );
        });
    }
}
