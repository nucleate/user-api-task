import * as dotenv from 'dotenv';

export class Config {
    constructor() {
        dotenv.config();
    }

    get appPort(): number {
        return parseInt(process.env.PORT ?? '', 10) || 3000;
    }

    get dbConnectionString(): string {
        return process.env.DB_CONNECTION_STRING || 'user-collection.json';
    }

    get trackedTopEarningsLimit(): number {
        return parseInt(process.env.TRACKED_EARNINGS_NUMBER ?? '', 10) || 10;
    }
}
