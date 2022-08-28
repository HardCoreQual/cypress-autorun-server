export type ConfigureCypressServerOptions = {
  server: {
    port: number;
  },
  tests: {
    testsPath: string | string[];
    configPath: string;
  },
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: 'postgres';
  }
}
