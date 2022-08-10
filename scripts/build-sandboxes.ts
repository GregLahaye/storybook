import { ensureDir } from 'fs-extra';
import { basename, join, resolve } from 'path';
import { createOptions, getOptionsOrPrompt } from './utils/options';
import { options as oncePerTemplateOptions, oncePerTemplate } from './once-per-template';

const scriptName = basename(__filename, 'ts');
const builtDir = resolve(__dirname, '../built-sandboxes');
const logger = console;

export const options = createOptions({
  cadence: oncePerTemplateOptions.cadence,
  junit: oncePerTemplateOptions.junit,
});

async function run() {
  const { cadence, junit } = await getOptionsOrPrompt(`yarn ${scriptName}`, options);

  await ensureDir(builtDir);

  return oncePerTemplate({
    step: 'Building',
    cd: true,
    cadence,
    parallel: false,
    junit,
    scriptName: 'build-storybook',
    templateCommand: (template) =>
      `yarn build-storybook --quiet --output-dir=${join(builtDir, template.replace('/', '-'))}`,
  });
}

if (require.main === module) {
  run().catch((err) => {
    logger.error(`🚨 An error occurred when executing "${scriptName}":`);
    logger.error(err);
    process.exit(1);
  });
}
