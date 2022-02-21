import arg from 'arg';

const logPrefix = '[ENV-CHECKER]';

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
    artifact: args['--artifact'] || '.serverless',
    maxEnvSize: args['--maxEnvSize'] || 4000,
  };
};

const validateEnvSize = (artifactFilePath = '.serverless', maxEnvSize = 4000) => {
  const maxLambdaEnvVarByteSize = maxEnvSize;

  let serverlessJsonOutput;
  const serverlessJsonFilePath = `${process.cwd()}/${artifactFilePath}/serverless-state.json`;

  try {
    serverlessJsonOutput = require(serverlessJsonFilePath);
  } catch {
    throw new Error(`${logPrefix} Unable to find serverless-state JSON file at file path ${serverlessJsonFilePath}`);
  }

  if (!serverlessJsonOutput) {
    throw new Error(`${logPrefix} Unable to extract serverless-state JSON from file`);
  }

  if (
    !serverlessJsonOutput.service ||
    !serverlessJsonOutput.service.provider ||
    !serverlessJsonOutput.service.provider.environment
  ) {
    throw new Error(`${logPrefix} Invalid serverless-state JSON format. Unable to extract environment variables.`);
  }

  const envVarFormatted = serverlessJsonOutput.service.provider.environment;
  const envVarFlattened = JSON.stringify(envVarFormatted);
  const envVarByteSize = Buffer.byteLength(envVarFlattened, 'utf8');

  console.log(`${logPrefix} ENV. Size: ${envVarByteSize} bytes`);
  console.log(`${logPrefix} MAX. Size: ${maxLambdaEnvVarByteSize} bytes`);

  if (envVarByteSize < maxLambdaEnvVarByteSize) {
    console.log(
      `${logPrefix} SUCCESS: ENV. variables (${envVarByteSize}) within MAX. size (${maxLambdaEnvVarByteSize})`
    );
    return 'success';
  }

  throw new Error(
    `${logPrefix} FAILURE: ENV. variables (${envVarByteSize}) outside MAX. allowed size (${maxLambdaEnvVarByteSize})`
  );
};

export const envChecker = args => {
  const options = parseArgumentsIntoOptions(args);
  const { artifact, maxEnvSize } = options;

  return validateEnvSize(artifact, maxEnvSize);
};
