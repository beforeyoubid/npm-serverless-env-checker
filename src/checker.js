import arg from 'arg';

const parseArgumentsIntoOptions = rawArgs => {
  const args = arg(
    {
      '--artifact': String,
      '--maxEnvSize': Number,
      '-a': '--artifact',
      '-m': '--maxEnvSize',
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    artifact: args['--artifact'] || './.serverless',
    maxEnvSize: args['--maxEnvSize'] || 4000,
  };
};

export const envChecker = args => {
  const options = parseArgumentsIntoOptions(args);
  console.log(options);
};
