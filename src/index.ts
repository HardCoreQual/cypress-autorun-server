import {createServer, defaultEndpointsFactory, z} from 'express-zod-api';
import {ConfigureCypressServerOptions} from './types';

export function configureServer (options: ConfigureCypressServerOptions) {
  createServer({
    server: {
      listen: options.server.port,
    },
    cors: true,
    logger: {
      level: "debug",
      color: true,
    },
  }, {
    '/require-run-tests': defaultEndpointsFactory.build({
      method: "get",
      input: z.object({}),
      output: z.object({
        executedAction: z.string(),
      }),
      handler: async ({ options, logger }) => {

        // create runTest and return testId (or use one that exist)
        return {
          "executedAction": "add execution and run right now",
        };
      },
    })
  });
}
