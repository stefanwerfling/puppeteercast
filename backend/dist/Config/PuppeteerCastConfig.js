import { Config, ConfigBackend, SchemaConfigBackendOptions } from 'figtree';
export class PuppeteerCastConfig extends ConfigBackend {
    static getInstance() {
        if (!Config._instance) {
            Config._instance = new PuppeteerCastConfig(SchemaConfigBackendOptions);
        }
        return Config._instance;
    }
    _loadEnv(aConfig) {
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
//# sourceMappingURL=PuppeteerCastConfig.js.map