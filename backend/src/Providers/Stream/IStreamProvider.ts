import {IProvider, ProviderEntry} from 'figtree';
import {BufferedStream} from '../../Stream/BufferedStream.js';

export interface IStreamProvider extends IProvider<ProviderEntry> {

    /**
     * Return the Broad stream
     */
    getBroadcastStream(): BufferedStream|null;

}