import { User } from '../database/models/user';
import { DBReposotitory } from '../database/repo/dbRepository';
import { calculateAverage } from '../utils/math';

export type UserRepositoryConfig = {
    readonly userRepository: DBReposotitory<User>;
    topEarningsLimit: number;
};

interface DistinctCountryDetails {
    usersNumber: number;
    trackedHighestEarnings: number[];
}

interface NumberOfUsersByCountry {
    country: string;
    usersNumber: number;
}

interface AverageTopEarningsByCountry {
    country: string;
    topAverageEarnings: string;
}

export class UserService {
    //used to store number of users and top earnings per each country,
    //can be implemented as a global app in-memory store
    private readonly countriesStorage: Map<string, DistinctCountryDetails>;
    constructor(private readonly config: UserRepositoryConfig) {
        this.countriesStorage = new Map();
    }

    async getAllUsers(): Promise<Array<User>> {
        return this.config.userRepository.findAll();
    }

    /**
     * O(k) time compexity, O(k) memory compexity due to using in-memory store, k - number of countries
     * Bruteforce - 0(k*n) time compexity, O(1) memory compexity if to iterate though all the users without usage of memory store, n - number of users
     **/
    async getAllDistinctCountries(): Promise<Array<NumberOfUsersByCountry>> {
        await this.fullfillCountriesStorageIfEmpty();

        const countriesWithUsers: Array<any> = [];
        for (const [
            country,
            countryDetails,
        ] of this.countriesStorage.entries()) {
            countriesWithUsers.push({
                country,
                usersNumber: countryDetails.usersNumber,
                earning: countryDetails.trackedHighestEarnings,
            });
        }

        return countriesWithUsers;
    }

    async createUser(user: Omit<User, 'id'>): Promise<User> {
        const createdUser = await this.config.userRepository.create(user);
        this.addUserDetailsToCountryStorage(createdUser.country, user.earnings);

        return createdUser;
    }

    async getAverageTopEarningsForCountries(): Promise<
        Array<AverageTopEarningsByCountry>
    > {
        await this.fullfillCountriesStorageIfEmpty();

        const countriesWithAverageEarnings: Array<any> = [];
        for (const [
            country,
            countryDetails,
        ] of this.countriesStorage.entries()) {
            const countryAverageByTopEarnings = calculateAverage(
                countryDetails.trackedHighestEarnings
            );
            countriesWithAverageEarnings.push({
                country,
                averageOfTopEarnings: `\$${countryAverageByTopEarnings.toFixed(
                    2
                )}`,
            });
        }

        return countriesWithAverageEarnings;
    }

    private async fullfillCountriesStorageIfEmpty() {
        if (!this.countriesStorage.size) {
            const users = await this.getAllUsers();
            for (const user of users) {
                this.addUserDetailsToCountryStorage(
                    user.country,
                    user.earnings
                );
            }
        }
    }

    private addUserDetailsToCountryStorage(
        country: string,
        earningString: string
    ) {
        let countryDetails = this.countriesStorage.get(country) ?? {
            usersNumber: 0,
            trackedHighestEarnings: [],
        };

        countryDetails = {
            usersNumber: ++countryDetails.usersNumber,
            trackedHighestEarnings: this.updateCountryTopEarnings(
                countryDetails.trackedHighestEarnings,
                parseFloat(earningString.slice(1))
            ),
        };

        this.countriesStorage.set(country, countryDetails);
    }

    private updateCountryTopEarnings(topEarnings: number[], earning: number) {
        const earningsTopLimit = this.config.topEarningsLimit;
        if (earning < topEarnings[earningsTopLimit - 1]) return topEarnings;
        let index = 0;

        // Find the correct index to insert the earning
        while (index < topEarnings.length && topEarnings[index] > earning) {
            index++;
        }

        // Insert the earning at the found index
        topEarnings.splice(index, 0, earning);

        // Trim the array to maintain the capacity limit
        if (topEarnings.length > earningsTopLimit) {
            topEarnings.length = earningsTopLimit;
        }

        return topEarnings;
    }
}
