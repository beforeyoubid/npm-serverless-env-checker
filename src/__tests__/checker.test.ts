import path from 'path';
import CheckServerlessEnvironmentSize from '../checker';

describe('CheckServerlessEnvironmentSize', () => {
  const serverlessFolderPath = path.join('module_test', 'fake-serverless');
  it('should throw an error if not provided a serverless file', () => {
    expect(() => CheckServerlessEnvironmentSize()).toThrow(Error);
  });
  it('should not throw an error if provided a serverless file', () => {
    expect(() => CheckServerlessEnvironmentSize(serverlessFolderPath)).not.toThrow(Error);
  });
});
