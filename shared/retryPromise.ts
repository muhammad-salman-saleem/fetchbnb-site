export interface retryPromiseOptions<T> {
    retryCatchIf?: (response: T) => boolean,
    retryIf?: (response: T) => boolean,
    retries?: number
}

export default function retryPromise<T>(promise: () => Promise<T>, options: retryPromiseOptions<T>) {
    const { retryIf = (_: T) => false, retryCatchIf = (_: T) => true, retries = 1 } = options
    let _promise = promise();

    for (var i = 1; i < retries; i++)
        _promise = _promise.catch((value) => retryCatchIf(value) ? promise() : Promise.reject(value))
            .then((value) => retryIf(value) ? promise() : Promise.reject(value));

    return _promise;
}