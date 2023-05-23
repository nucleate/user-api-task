export abstract class DBReposotitory<T> {
    constructor(readonly connectionString: string) {
        this.connectionString = connectionString;
    }

    abstract findAll(): Promise<Array<T>>;
    abstract create(user: Omit<T, 'id'>): Promise<T>;
}
