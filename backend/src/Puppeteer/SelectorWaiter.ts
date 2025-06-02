/**
 * Interface Selector Queryable
 */
export interface SelectorQueryable {
    $(selector: string): Promise<any | null>;
}

/**
 * Selector waiter
 */
export class SelectorWaiter {

    /**
     *
     * @private
     */
    private _abortController?: AbortController;

    /**
     * wait for a selector with interval
     * @template T extends SelectorQueryable
     * @param {T} obj
     * @param {string} selector
     * @param {number} intervalMs
     * @param {number} maxDurationMs
     */
    public async waitForSelectorWithInterval<T extends SelectorQueryable>(
        obj: T,
        selector: string,
        intervalMs: number = 30000,
        maxDurationMs: number = 180000
    ): Promise<any> {
        if (this._abortController) {
            this._abortController.abort();
        }

        this._abortController = new AbortController();

        const signal = this._abortController.signal;
        const maxAttempts = Math.ceil(maxDurationMs / intervalMs);

        let attempts = 0;

        while (attempts < maxAttempts) {
            if (signal.aborted) {
                throw new Error('Polling is aborted.');
            }

            // eslint-disable-next-line no-await-in-loop
            const elementHandle = await obj.$(selector);

            if (elementHandle) {
                return elementHandle;
            }

            attempts++;

            if (attempts < maxAttempts) {
                // eslint-disable-next-line no-await-in-loop
                await new Promise<void>((resolve, reject) => {
                    const timeoutId = setTimeout(() => resolve(), intervalMs);

                    signal.addEventListener('abort', () => {
                        clearTimeout(timeoutId);
                        reject(new Error('Polling is aborted.'));
                    });
                });
            }
        }

        throw new Error(`Selector ${selector} not found by ${maxDurationMs / 1000} sec.`);
    }

    /**
     * cancel
     */
    public cancel(): void {
        if (this._abortController) {
            this._abortController.abort();
        }
    }

}