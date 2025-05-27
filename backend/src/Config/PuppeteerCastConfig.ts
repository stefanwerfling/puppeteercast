import {Config, ConfigBackend, ConfigBackendOptions, ConfigOptions, SchemaConfigBackendOptions} from 'figtree';

/**
 * Config
 */
export class PuppeteerCastConfig extends ConfigBackend {

    /**
     * Return the Config instance
     * @return {Config}
     */
    public static getInstance<I extends ConfigOptions>(): Config<I> {
        if (!Config._instance) {
            Config._instance = new PuppeteerCastConfig(SchemaConfigBackendOptions);
        }

        return Config._instance;
    }

    /**
     * _loadEnv
     * @param {ConfigBackendOptions|null} aConfig
     * @returns {ConfigBackendOptions|null}
     * @protected
     */
    protected _loadEnv(aConfig: ConfigBackendOptions | null): ConfigBackendOptions | null {
        let config = aConfig;

        if (config === null) {
            config = {
                db: {
                    mysql: {
                        database: '',
                        host: '',
                        password: '',
                        port: 3362,
                        username: 'root'
                    }
                },
                logging: {
                    level: 'silly'
                },
                httpserver: {
                    port: 3000,
                    publicdir: './public',
                    proxy: {
                        trust: true
                    }
                }
            };
        }

        return config;
    }

}