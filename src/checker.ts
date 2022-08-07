import arg from 'arg';

const logPrefix = '[ENV-CHECKER]';

const parseArgumentsIntoOptions = (rawArgs: string[]) => {
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

const calcPercentage = (firstValue: number, secondValue: number) => {
  try {
    return (firstValue/secondValue) * 100;
  } catch {
    return null;
  }
}

const validateEnvSize = (artifactFilePath = '.serverless', maxEnvSize = 4000): void => {
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
  console.log(`${logPrefix} Total used: ${calcPercentage(envVarByteSize, maxLambdaEnvVarByteSize)}%`);

  if (envVarByteSize < maxLambdaEnvVarByteSize) {
    console.log(
      `${logPrefix} SUCCESS: ENV. variables (${envVarByteSize}) within MAX. size (${maxLambdaEnvVarByteSize})`
    );
  }

  throw new Error(
    `${logPrefix} FAILURE: ENV. variables (${envVarByteSize}) outside MAX. allowed size (${maxLambdaEnvVarByteSize})`
  );
};

export const envChecker = (args: string[]) => {
  const options = parseArgumentsIntoOptions(args);
  const { artifact, maxEnvSize } = options;

  return validateEnvSize(artifact, maxEnvSize);
};

/**
 * check the serverless artifact to ensure the environment variables don't exceed maximum capacity for lambda;
 * 
 * throws an error if exceeding `maxEnvSize`
 * @param serverlessArtifactPath the filepath of the artifact folder; defaults to `.serverless`
 * @param maxEnvSize the maximum environment variable size; defaults to `4000`
 */
export default function CheckServerlessEnvironmentSize(serverlessArtifactPath = '.serverless', maxEnvSize = 4000) {
  return validateEnvSize(serverlessArtifactPath, maxEnvSize);
}