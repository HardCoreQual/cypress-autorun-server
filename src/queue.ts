import {runTest} from './run-tests';
import {ConfigureCypressServerOptions} from './types';

let isRun = false;
let waitRun = false;

function runQueue(options: ConfigureCypressServerOptions['tests'], prisma: unknown) {
  setTimeout(() => {
    if (isRun || !waitRun) {
      return;
    }

    waitRun = false;
    isRun = true;

    (async () => {
      await runTest(
        options,
        (result) => {
          console.log( result )
        },
      );

      isRun = false;
    })();
  }, 3000);
}
