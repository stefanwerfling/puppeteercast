export class SelectorWaiter {
    _abortController;
    async waitForSelectorWithInterval(obj, selector, intervalMs = 30000, maxDurationMs = 180000) {
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
            const elementHandle = await obj.$(selector);
            if (elementHandle) {
                return elementHandle;
            }
            attempts++;
            if (attempts < maxAttempts) {
                await new Promise((resolve, reject) => {
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
    cancel() {
        if (this._abortController) {
            this._abortController.abort();
        }
    }
}
//# sourceMappingURL=SelectorWaiter.js.map