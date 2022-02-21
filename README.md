# Serverless Env. Variable Checker

Checks env. variable size of packaged Serverless env. variables.

Designed to support the CI/CD process to ensure env variables packaged and deployed to Lambda are within AWS Lambda's maximum allowed size - currently 4,000 bytes.

## Commands

`--artifact`: specify path to the serverless package output serverless-state.json path, defaults to .serverless (default serverless package output path)
`--maxEnvSize`: specify max. env. variable size allowed, defaults to 4000 bytes

## Local Development

1. Run `yarn install` to install dependencies
2. Run `yarn link` to allow the project's CLI commands
3. Run `yarn unlink` to remove the project's CLI commands
