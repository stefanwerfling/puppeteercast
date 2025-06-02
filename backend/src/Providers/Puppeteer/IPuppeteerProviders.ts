import {ProviderEntry, IProviders} from 'figtree';
import {IPuppeteerProvider} from './IPuppeteerProvider.js';

/**
 * Interface type of PuppeteerProviders
 */
export type IPuppeteerProviders = IProviders<ProviderEntry, IPuppeteerProvider>;