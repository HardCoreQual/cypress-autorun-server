import fs from 'fs';
import path from 'path';
import {ConfigureCypressServerOptions} from './types';
import {exec} from 'child_process';

const MAX_MINUTES_EXECUTION_OF_COMMAND = 100;

function prepareTestPaths(testPaths: string[]) {
  return testPaths.map(testPath => {
    if (!fs.existsSync(testPath)) {
      throw new Error('Test not exist');
    }

    return fs.lstatSync(testPath).isDirectory()
      ? fs.readdirSync(testPath).map(e => path.join(testPath, e))
      : [testPath];
  }).flat();
}


export async function runTest(
  { configPath, testsPath }: ConfigureCypressServerOptions['tests'],
  emitResult: (result: unknown) => void,
  ) {
  const paths = prepareTestPaths(Array.isArray(testsPath) ? testsPath : [testsPath]).flat();

  while (paths.length) {
    const pathToFile = paths.shift();

    const command = `npx cypress run --reporter json --reporter-options "toConsole=true" -q --config-file ${ configPath } --project ./ --spec ${ pathToFile }`;

    const startExecCommand = new Date();

    await new Promise<{ error: Error | null; } | { result: string; additional: string; }>((resolve, reject) => {
      // TODO: should replace exec with spawn and obtain stream of json if is possible
      const execCommandInstance = exec(command, (error, result, additional) => {
        resolve({
          error, result, additional,
        });
      });

      const interval = setInterval(() => {
        if (new Date().getTime() - startExecCommand.getTime() < MAX_MINUTES_EXECUTION_OF_COMMAND * 60 * 1000) {
          return;
        }

        clearInterval(interval);

        execCommandInstance.kill('SIGINT');

        resolve({ error: new Error(`Command execution take more ${ MAX_MINUTES_EXECUTION_OF_COMMAND } minutes`) });
      }, 1000);
    })
      .then((data) => {
        emitResult({

        });
      })
  }
}
