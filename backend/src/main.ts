import {Backend} from './Application/Backend.js';

/**
 * MAIN
 */
(async(): Promise<void> => {
    const backend = new Backend();
    await backend.start();
})();