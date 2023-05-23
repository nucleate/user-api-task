export abstract class Provider<T> {
    private override: Provider<T> | undefined;

    //could be useful for test mocks
    setOverride(provider: Provider<T>) {
        this.override = provider;
    }

    resetOverride() {
        this.override = undefined;
    }

    provide(): T {
        if (this.override) {
            return this.override.provide();
        }

        return this.onProvide();
    }

    protected abstract onProvide(): T;
}

export class LazyProvider<T> extends Provider<T> {
    constructor(private factory: () => T) {
        super();
    }

    protected onProvide(): T {
        return this.factory();
    }
}

export class SingletonProvider<T> extends LazyProvider<T> {
    private isProvided = false;
    private result: T | undefined;

    protected onProvide(): T {
        if (!this.isProvided) {
            this.result = super.onProvide();
            this.isProvided = true;
        }

        return this.result as T;
    }
}
